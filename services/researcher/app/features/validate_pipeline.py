import aiohttp
import asyncio
from transformers import pipeline

# Load the sentiment analysis pipeline
sentiment_analyzer = pipeline("text-classification", model="sismetanin/rubert-toxic-pikabu-2ch", truncation=True, max_length=512)

async def fetch_text(url):
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            return await response.text()

def check_input_format(text):
    if not isinstance(text, str):
        raise ValueError("Input must be a string.")
    return text

async def validate_report(report: str, sources: list) -> bool:
    try:
        report_text = check_input_format(report)
        report_result = sentiment_analyzer(report_text)
        valid = True

        for source_url in sources:
            source_text = await fetch_text(source_url)
            source_text = check_input_format(source_text)
            source_result = sentiment_analyzer(source_text)

            if report_result[0]['label'] != source_result[0]['label']:
                print(f"Warning: Report content might not align with sources. Report: {report}")
                valid = False

        return valid
    except Exception as e:
        print(f"An error occurred: {e}")
        return False
async def main():

    if await validate_report(report, sources):
        print("Report is validated.")
    else:
        print("Errors found in the report.")

if __name__ == "__main__":
    asyncio.run(main())
