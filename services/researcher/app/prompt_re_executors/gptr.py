import os
from openai import OpenAI
from gpt_researcher import GPTResearcher
from configurators import configure_rgpt
from dto import ReResearchRequest, ResearchResult, ResearchResultMetadata

def context_extractor(prompt, text, client):
  '''
  Извлечение контекста для изменения фрагмента.
  '''

  chat_completion = client.chat.completions.create(
      messages=[
          {
              "role": "user",
              "content": f"{text}",
          },
          {
              "role": "system",
              "content": f"{prompt}",
          },

      ],
      model="gpt-4o", # Можно попробовать внедрить смену модельки.
  )
  return chat_completion.to_dict().get('choices')[-1].get('message').get('content')

def regenerate(prompt, text, context, start_sym, length):
  '''
  prompt: str - пожелание юзера, что сделать с текстом
  text: str - то, что было сгенерировано нейросетью
  context: str - нужный для понимания контекст, в данном случае изначальный промпт
  start_sym: int - положение символа, с которого начать переписывание
  length: int - длина строки на изменение
  '''

  fragment = text[start_sym : length + start_sym]

  newprompt = f"""
Тебе нужно изменить этот фрагмент с использованием дополнительной информации.
Пожелания заказчика к правке текста:
"{prompt.strip()}"

Этот фрагмент отчёта не понравился заказчику:
"{fragment.strip()}"

Контекст для понимания того, о чём был текст и оформление текста:
"{context.strip()}"

Чётко следуй указаниям заказчика. Делай в точности так, как он пожелал.
Выведи новый фрагмент текста с дополнительной информацией.
  """

  # Возвращает промпт newprompt     (str)
  # Стартовый символ и длина строки (int, int)
  return newprompt, (start_sym, length)

def add_new(text, new_fragment, startpos, length):
  return text[:startpos] + new_fragment + text[startpos + length:]

async def re_execute_prompt(
    request: ReResearchRequest
) -> ResearchResult:
    source_urls = request.medatada.source_urls
    
    configure_rgpt(request.config)

    # Промпт для агента gpt-4o, извлечение контекста.
    gpt_4o_pp = """Ты лучший копирайтер в мире, умеешь всего в десяток пунктов описать, о чём текст. 
    Опиши каждый абзац текста и что в нём сказано.
    Нужен контекст этого текста."""

    # Генерация промпта для изменения
    openai_client = OpenAI(api_key = request.config.llmKey)
    newprompt, sympos = regenerate(
       prompt = request.prompt,
       text = request.document,
       context = context_extractor(
          prompt= gpt_4o_pp,
          text= request.document,
          client= openai_client,
       ),
       start_sym = int(request.selectionStart),
       length = int(request.selectionLength),
    )
    start_sym, length = sympos

    # gpt-researcher
    researcher = GPTResearcher(
       query = newprompt,
       report_type = 'custom_report',
       source_urls = source_urls,
    )
    await researcher.conduct_research()
    fragment_generated = await researcher.write_report()

    # Замена фрагмента в изначальном текста
    result = add_new(
            request.document,
            fragment_generated,
            start_sym,
            length,
        )

    ret = ResearchResult()
    ret.markdown = result
    ret.metadata=ResearchResultMetadata()
    ret.metadata.source_urls = source_urls

    return ret
