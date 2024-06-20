import datetime
from dto import PromptGeneratorResult, PromptParams


def generate_prompt(params: PromptParams) -> PromptGeneratorResult:
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

    market = params['market'] # Название отрасли owo

    evaluation_criteria = f'''
    Criteria for market analysis with {start_date} by {end_date}:
    1. Market volume, share of imports, share of exports, demand and supply in the market, figures for the period 2017-2024.
    2. Key suppliers in the Russian market (also called «list of key players»), their financial position and performance.
    3. List of distributed products in the niche under consideration. Explain each product.
    4. Factors of growth and market restrictions - at least 5 factors of growth and at least 5 restrictions.
    '''

    # Структура отчета в зависимости от длины
    if report_length == 'краткий':
        structure = f"""
        1. Industry name {market};
        2. Size of the market;
        3. Key suppliers in the RF market;
        4. List of common products in niche;
        5. Demand for specific products or services.
        """
    elif report_length == 'средний':
        structure = f"""
        1. Industry description {market}, market segments;
        2. Market size, import share, export share, market demand and supply;
        3. Key suppliers in the RF market;
        4. Review of suppliers in the industry;
        5. Key consumer industries in the RF market by segments;
        6. List of common products in niche;
        7. Demand for specific products or services.
        """
    else:
        structure = f"""
        1. Market definition {market}, industry description {market}, market segments;
        2. Market size, import share, export share, market demand and supply;
        3. Key suppliers in the RF market;
        4. List of key consumers by segment;
        5. List of distributed products in the niche;
        6. Factors of growth and market constraints;
        7. Trends in the development of the niche;
        8. Demand for specific products or services;
        9. Technological developments.
        """

    # Запрос для анализа
    prompt = f"Prepare {report_length} market overview {market} taking into account the following criteria {evaluation_criteria}. Report structure: {structure}. For employee {employee_grade}. The answer is in Russian language."

    ret = PromptGeneratorResult()
    ret.prompt = prompt.strip()
    ret.extra_sources = competitor_urls
    return ret
