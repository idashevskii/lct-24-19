import datetime
from dto import PromptGeneratorResult, PromptParams


def generate_prompt(params: PromptParams) -> PromptGeneratorResult:
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

    # Критерии анализа с учетом входных параметров
    evaluation_criteria = f'''
    Criteria for market analysis with {start_date} by {end_date}:.
    1. Basic information about the company {company}: «Business Card» (Head office, Year of foundation, Number of employees, Total revenue for the last year in dollars/euros, Volume of steel production for the last year in tons).
    2. Overview of sales and EBITDA revenue by year for the last 10 years - table with distribution of revenue.
    3. Overview of steel production in tons by year over the last 10 years. if available, also mining iron ore in tons by years over the past 10 years; explaining the reasons for the relevant drop or increase in production.
    4. Company Structure (Division into deviations within the company, Sales Markets by Region/Country, Sales Level, Sales Markets and Sales Level by Industry).
    5. Digitalization of the company (Digital Strategy and Company Transformation, Digital Solutions to Improve Production, Supply Chains, Logistics, Any Other Digital Implementations, Company Digital Products for Sale to Customers or Service Rendered («Smart Steel»)).
    6. Trends in future development beyond digitalization (e.g., decarbonization; introduction of new technologies and products that increase EBITDA; opening of new plants and production lines; entering new market niches, etc.).
    7. Production technology - interesting, non-standard, new production and (final) steel processing technologies (e.g. production of ultra-long rails, production of carbon-free steel).
    8. Research, development and education (patents, research centres, educational structures, cooperation with universities, own internal educational programs, qualification programs, innovation projects, etc.)
    '''

    # Структура отчета в зависимости от длины
    if report_length == 'краткий':
        structure = f"""
        1. Company name {company};
        2.  Overview of sales revenue and EBITDA by year for the last 10 years - Distribution table;
        3. Review of steel production in tons by years over the last 10 years;
        4.  Trends in future development beyond digitalization;
        5.  Manufacturing technology - interesting, non-standard, new production and (final) steel processing technologies.
        """
    elif report_length == 'средний':
        structure = f"""
        1. Basic information about the company {company}: «Business Card»;
        2. Overview of sales revenue and EBITDA by year for the last 10 years - Distribution table;
        3. Review of steel production in tons by years over the last 10 years;
        4. Company Structure;
        5. Manufacturing technology - interesting, non-standard, new production and (final) steel processing technologies;
        6. Research, development and education.
        """
    else:
        structure = f"""
        1. Basic information about the company {company}: «Business Card»;
        2. Overview of sales revenue and EBITDA by year for the last 10 years - Distribution table;
        3. Review of steel production in tons by years over the last 10 years;
        4. Company Structure;
        5. Digitalization of the company;
        6. Trends in future development beyond digitalization;
        7. Production technology - interesting, non-standard, new production and (final) steel processing technologies;
        8. Research, development and education.
        """

    # Запрос для анализа
    prompt = f"Prepare a {report_length} review of a competitor company {company} taking into account the following criteria {evaluation_criteria}. Report structure: {structure}. For employee {employee_grade}. The answer is in Russian language."

    ret = PromptGeneratorResult()
    ret.prompt = prompt.strip()
    ret.extra_sources = competitor_urls
    return ret
