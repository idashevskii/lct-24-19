from dto import GeneratorConfig
import os

llmModels = {
    'openai_base' : ['gpt-4o', 'gpt-4o'],    
    'openai_complex' : ['gpt-4-turbo', 'gpt-4o'], 
    'openai_hard' : ['gpt-4-turbo', 'gpt-4-turbo'],    
    'openai_lite' : ['gpt-4o', 'gpt-3.5-turbo'],    
    'openai_least' : ['gpt-3.5-turbo', 'gpt-3.5-turbo'],   
    'mistral_base' : ['open-mistral-7b', 'open-mistral-7b'],   
    'mistral_complex' : ['mistral-large-latest', 'open-mistral-7b'],
    'mistral_hard' : ['mistral-large-latest', 'mistral-large-latest'],   
    'mistral_lite' : ['mistral-medium-latest', 'mistral-medium-latest'],   
    'google_base' : ['gemini-1.5-flash', 'gemini-1.5-flash'],    
    'google_complex' : ['gemini-1.5-pro', 'gemini-1.5-flash'], 
    'google_hard' : ['gemini-1.5-pro', 'gemini-1.5-pro'],    
    'google_lite' : ['gemini-1.0-pro', 'gemini-1.0-pro'],    
    'anthropic_base' : ['claude-3-opus-20240229', 'claude-3-opus-20240229'], 
    'anthropic_complex' : ['claude-3-sonnet-20240229', 'claude-3-opus-20240229'],
    'anthropic_lite' : ['claude-3-haiku-20240307', 'claude-3-haiku-20240307'], 
}

def configure_rgpt(config: GeneratorConfig):
    os.environ["OPENAI_API_KEY"] = config.llmKey
    os.environ["TAVILY_API_KEY"] = config.tavilyApiKey
    os.environ['RETRIEVER'] = 'tavily'

    conf = llmModels.get(config.llmPreset)

    os.environ['FAST_LLM_MODEL'] = conf[1]
    os.environ['SMART_LLM_MODEL'] = conf[0]
