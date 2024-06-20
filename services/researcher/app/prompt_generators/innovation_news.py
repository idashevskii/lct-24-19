import datetime
from dto import PromptGeneratorResult, PromptParams


def generate_prompt(params: PromptParams) -> PromptGeneratorResult:
    field = params["field"]
    company = params["company"]
    news_amount = str(params["news_amount"])

    employee_grade = params["employee_grade"]
    importance = params["importance"]
    date = str(params["date"])

    m_criterias = f"""
Критерии оценки важности новостей:
1. Релевантность для {field}
2. Новизна и актуальность новостей. Сегодняшная дата: {date}
3. Влияние на отрасль и рынок (новости о крупных сделках, изменениях в законодательстве и т.д.
будут иметь higher score, чем новости о локальных событиях)
4. Авторитетность источника (новости из авторитетных источников, таких как Forbes, Bloomberg и
т.д., будут иметь higher score, чем новости из менее авторитетных источников)
5. Кол-во новостей - {news_amount}
6. Сортировка - важности для критериев
"""

    prompt = f"""
Provide full and comprehensive news summury over the last week that sutisfy this criterias {m_criterias}
Structure:
1. Заголовок новости
2. Краткое содержание
3. пояснение важности для области: {field}, {company} - {importance} 
3. Ссылка на новость и источник 
4. Дата публикации

Для сотрудника: {employee_grade}. Respond in russian.
"""

    ret = PromptGeneratorResult()
    ret.prompt = prompt.strip()
    return ret
