import datetime
from dto import PromptGeneratorResult, PromptParams

def generate_prompt(params: PromptParams) -> PromptGeneratorResult:
    field = params["field"]

    products = params["products"]
    to_compare_companies = params["to_compare_companies"]
    criteries = params["criteries"]

    start_date = str(params["date"])
    end_date = datetime.datetime.now().strftime("%Y-%m-%d")

    report_structure = params['report_structure']
    competitor_urls_raw = params.get("product_links", "").strip()
    competitor_urls = (
        [url.strip() for url in competitor_urls_raw.split("\n")]
        if competitor_urls_raw
        else []
    )

    prompt = f"""
Проведи сравнительный анализ продуктов, услуг или технологий в {field}.
Вам необходимо провести сравнительный анализ следующего: \n {products}

Сравнивать эти продукты у следующих конкурирующих компаний: \n{to_compare_companies}.

Анализ проводить по следующим критериям: \n{criteries}

Информацию предоставлять в таблицах в удобочитаемом виде.
Необходимо приводить больше численной информации, чем текстовой. Цифры лучше чем текст.

Информацию в интернете искать в период с {start_date} по {end_date}

Структура отчёта: {report_structure}. Ответ на русском языке.
      """

    ret = PromptGeneratorResult()
    ret.prompt = prompt.strip()
    ret.extra_sources = competitor_urls
    return ret
