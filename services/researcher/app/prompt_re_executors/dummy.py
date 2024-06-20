from dto import ReResearchRequest, ResearchResult, ResearchResultMetadata


async def re_execute_prompt(
    request: ReResearchRequest
) -> ResearchResult:
    source_urls = request.medatada.source_urls
        
    markdown = f"""
# Эмуляция внесения правок

Длина исходного документа: {len(request.document)}

## Промпт 

```
{request.prompt}
```

Фрагмент от {request.selectionStart} символа, длиной {request.selectionLength} символов

***
## Источники

{"- " + "\n - ".join(source_urls) + "\n"}

"""

    ret = ResearchResult()
    ret.markdown = markdown
    ret.metadata=ResearchResultMetadata()
    ret.metadata.source_urls = source_urls

    return ret
