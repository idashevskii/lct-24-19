import datetime
from dto import PromptGeneratorResult, PromptParams


def generate_prompt(params: PromptParams) -> PromptGeneratorResult:
    field = params["field"]
    company = params["company"]
    employee_grade = params["employee_grade"]
    start_date = str(params["date"])
    end_date = datetime.datetime.now().strftime("%Y-%m-%d")
    report_length = params["report_length"]
    competitor_urls_raw = params.get("competitor_urls", "").strip()
    competitor_urls = (
        [url.strip() for url in competitor_urls_raw.split("\n")]
        if competitor_urls_raw
        else []
    )

    specific_products = params["specific_products"]
    company_location = params["company_location"]

    # Критерии анализа с учетом входных параметров
    evaluation_criteria = f'''
    Критерии для анализа конкурентов с {start_date} по {end_date}:
    1. Размер и масштаб операций (производственные мощности, география продаж и т.д.)
    2. Инновационная активность по продуктам: {specific_products}
    3. Финансовое положение и результаты деятельности
    4. Стратегические инициативы и инвестиции (партнерства, расширение, M&A)
    5. Рыночное положение и доля (изменения в доле рынка, конкурентное положение)
    6. Особое внимание на {company_location} компании
    '''

    # Структура отчета в зависимости от длины
    if report_length == 'краткий':
        structure = f"""
        1. Название компании
        2. Ключевые инновации и продукты
        3. Основные финансовые показатели
        4. Ссылки на источники
        """
    elif report_length == 'средний':
        structure = f"""
        1. Название компании
        2. Обзор ключевых фактов
        3. Анализ деятельности и стратегии
        4. Финансовые показатели
        5. Ссылки на источники
        """
    else:
        structure = f"""
        1. Название компании
        2. Обзор ключевых фактов о компании
        3. Анализ деятельности и стратегии в контексте {field}
        4. Основные финансовые показатели и результаты
        5. Инновации и технологические достижения по продуктам: {specific_products}
        6. Рыночная доля и конкурентное положение
        7. Ссылки на источники
        """

    # Запрос для анализа
    prompt = f"Подготовить {report_length} обзор конкурентов для {company} в {field} с учетом следующих критериев {evaluation_criteria}. Структура отчета: {structure}. {employee_grade}. Ответ на русском языке."

    ret = PromptGeneratorResult()
    ret.prompt = prompt.strip()
    ret.extra_sources = competitor_urls
    return ret
