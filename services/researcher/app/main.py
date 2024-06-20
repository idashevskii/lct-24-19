import asyncio
import os

import prompt_generators.market_analysis
import prompt_generators.product_compare

os.environ["USER_AGENT"] = (
    "Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) "
    + "AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19"
)

from fastapi import FastAPI, HTTPException

from dto import PromptExecutor, PromptGenerator, PromptReExecutor, ReResearchRequest, ResearchRequest

import prompt_re_executors.dummy
import prompt_re_executors.gptr

import prompt_executors.dummy
import prompt_executors.gptr

import prompt_generators.innovation_news
import prompt_generators.competitor_review
import prompt_generators.competitors_review
import prompt_generators.custom


app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/research")
def research(request: ResearchRequest):
    # Choose prompt executor
    executor: PromptExecutor
    if request.config.dummyApi:
        executor = prompt_executors.dummy.execute_prompt
    else:
        executor = prompt_executors.gptr.execute_prompt
        # raise HTTPException(status_code=400, detail="Can not choose prompt executor")

    # Choose prompt generator
    prompt_generator: PromptGenerator

    if request.reportTopic == "CUSTOM":
        prompt_generator = prompt_generators.custom.generate_prompt
    elif request.reportTopic == "INNOVATION_NEWS":
        prompt_generator = prompt_generators.innovation_news.generate_prompt
    elif request.reportTopic == "COMPETITOR_REVIEW":
        prompt_generator = prompt_generators.competitor_review.generate_prompt
    elif request.reportTopic == "COMPETITORS_REVIEW":
        prompt_generator = prompt_generators.competitors_review.generate_prompt
    elif request.reportTopic == "MARKET_ANALYSIS":
        prompt_generator = prompt_generators.market_analysis.generate_prompt
    elif request.reportTopic == "PRODUCT_COMPARISON":
        prompt_generator = prompt_generators.product_compare.generate_prompt
    else:
        raise HTTPException(status_code=400, detail="Can not choose prompt generator")

    # Execute prompt
    return asyncio.run(executor(prompt_generator, request))


@app.post("/re-research")
def re_research(request: ReResearchRequest):
    # Choose executor
    executor: PromptReExecutor
    if request.config.dummyApi:
        executor = prompt_re_executors.dummy.re_execute_prompt
    else:
        executor = prompt_re_executors.gptr.re_execute_prompt

    # Execute
    return asyncio.run(executor(request))
