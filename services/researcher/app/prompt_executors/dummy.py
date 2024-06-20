from dto import PromptGenerator, ResearchRequest, ResearchResult, ResearchResultMetadata
import os
from configurators import configure_rgpt

async def execute_prompt(
    prompt_generator: PromptGenerator, request: ResearchRequest
) -> ResearchResult:

    configure_rgpt(request.config)

    prompt_result = prompt_generator(request.promptParams)

    source_urls = request.promptParams.get("sources", [])
    if prompt_result.extra_sources:
        source_urls += prompt_result.extra_sources

    source_docs = request.promptParams.get("source_docs", [])

    markdown = f"""
# Эмуляция исследования

## Промпт

```
{prompt_result.prompt}
```

## Выбранные модели:

- Быстрая: {os.environ['FAST_LLM_MODEL']}
- Умная: {os.environ['SMART_LLM_MODEL']}


***
## Источники

{md_list(source_urls)}

## Документы

{md_list([f"{doc['name']}: {len(doc['content'])} байт" for doc in source_docs])}

Директория с локальными файлами: {os.environ.get("DOC_PATH", 'None')}

"""

    ret = ResearchResult()
    ret.markdown = markdown
    ret.metadata=ResearchResultMetadata()
    ret.metadata.source_urls = source_urls

    return ret

def md_list(l: list) -> str:
    return "- " + "\n - ".join(l) + "\n"
