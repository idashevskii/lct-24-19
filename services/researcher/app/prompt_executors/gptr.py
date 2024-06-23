import os
import tempfile
from typing import Dict, List
from dto import PromptGenerator, ResearchRequest, ResearchResult, ResearchResultMetadata
from dto import ResearchRequest, ResearchResult

# from gpt_researcher import GPTResearcher
from configurators import configure_rgpt
import base64
from agents import ChiefEditorAgent
from agents import PublisherAgent


class LocalFilesManager(object):
    def __init__(self, sources_dir: str):
        self.sources_dir = sources_dir

    def __enter__(self):
        os.environ["DOC_PATH"] = self.sources_dir

    def __exit__(self, *args):
        del os.environ["DOC_PATH"]


async def execute_prompt(
    prompt_generator: PromptGenerator, request: ResearchRequest
) -> ResearchResult:

    report_type = "custom_report"  # research_report, resource_report, outline_report, custom_report, subtopic_report

    configure_rgpt(request.config)

    prompt_result = prompt_generator(request.promptParams)

    source_urls = request.promptParams.get("sources", [])
    if prompt_result.extra_sources:
        source_urls += prompt_result.extra_sources

    # [{'name': str, 'content': str}]
    source_docs: List[Dict[str, str]] = request.promptParams.get("source_docs", [])

    researcher: GPTResearcher

    if source_docs and len(source_docs):
        with tempfile.TemporaryDirectory() as tmpdirname:
            with LocalFilesManager(tmpdirname):
                # Saving pdf`s and so on
                for element in source_docs:
                    with open(f'{tmpdirname}/{element['name']}', 'wb') as file:
                        binary_content=base64.decodebytes(element['content'].encode("ascii"))
                        file.write(binary_content)

                researcher = GPTResearcher(
                    query=prompt_result.prompt,
                    report_type=report_type,
                    report_source = "local",
                )
                await researcher.conduct_research()
                markdown = await researcher.write_report()
    else:
        # researcher = GPTResearcher(
        #     query=prompt_result.prompt,
        #     report_type=report_type,
        #     source_urls=source_urls
        # )
        # await researcher.conduct_research()
        # markdown = await researcher.write_report()

        chief_editor = ChiefEditorAgent(
            {
                # "query": "Сравни русские метталургические компании и выдай куда инвестировать",
                "query": prompt_result.prompt,
                "max_sections": 3,
                # "max_sections": 1,
                "follow_guidelines": True,
                "model": "gpt-4o",
                "guidelines": [
                    # "Используй все данные только за 2023 год.",
                    # "Для каждого контрагента указывай ИНН.",
                    # "Отчет ДОЛЖЕН быть написан в формате APA.",
                    # "Используй только российские источники",
                    "Каждый подраздел ДОЛЖЕН включать поддерживающие источники с использованием гиперссылок. Если таковых не существует, удалите подраздел или перепишите его, чтобы он стал частью предыдущего раздела.",
                    "Отчет ДОЛЖЕН быть написан на русском языке.",
                ],
                "verbose": True,
            }
        )

    # graph = chief_editor.init_research_team()
    # graph = graph.compile()

    result = await chief_editor.run_research_task()

    # print("INFO: RESULT: ",  result)

    ret = ResearchResult()
    ret.markdown = result["report"]
    ret.metadata = ResearchResultMetadata()
    ret.metadata.source_urls = source_urls

    return ret
