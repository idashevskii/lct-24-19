import datetime
from dto import PromptGeneratorResult, PromptParams


def generate_prompt(params: PromptParams) -> PromptGeneratorResult:
    prompt = params["prompt"]

    ret = PromptGeneratorResult()
    ret.prompt = prompt.strip()
    return ret
