import os
import tempfile
from typing import Dict, List
from dto import PromptGenerator, ResearchRequest, ResearchResult, ResearchResultMetadata
from dto import ResearchRequest, ResearchResult
from gpt_researcher import GPTResearcher
from configurators import configure_rgpt
import base64


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
        researcher = GPTResearcher(
            query=prompt_result.prompt,
            report_type=report_type,
            source_urls=source_urls
        )
        await researcher.conduct_research()
        markdown = await researcher.write_report()

    

    ret = ResearchResult()
    ret.markdown = markdown
    ret.metadata=ResearchResultMetadata()
    ret.metadata.source_urls = source_urls

    return ret
