from typing import Any, Awaitable, Callable, Coroutine, Dict, List, Union
from pydantic import BaseModel


type PromptParams = Dict[str, Any]

class GeneratorConfig(BaseModel):
    dummyApi: bool
    llmKey: str
    tavilyApiKey: str
    llmPreset: str

class ResearchRequest(BaseModel):
    config: GeneratorConfig
    reportTopic: str
    promptParams: PromptParams

class ResearchResultMetadataRequest(BaseModel):
    source_urls: List[str]

class ReResearchRequest(BaseModel):
    config: GeneratorConfig
    document: str
    medatada: ResearchResultMetadataRequest
    prompt: str
    selectionStart: int
    selectionLength: int

class ResearchResultMetadata:
    source_urls: List[str]

class ResearchResult:
    metadata: ResearchResultMetadata
    markdown: str


class PromptGeneratorResult:
    prompt: str
    extra_sources: Union[List[str], None] = None


type PromptGenerator = Callable[[PromptParams], PromptGeneratorResult]

type PromptExecutor = Callable[[PromptGenerator, ResearchRequest], Awaitable[ResearchResult]]

type PromptReExecutor = Callable[[ReResearchRequest], Coroutine[Any, Any, ResearchResult]]
