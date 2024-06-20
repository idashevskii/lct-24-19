from youtube_transcript_api import YouTubeTranscriptApi
from openai import OpenAI
import os
import time
import requests

yt_apikey = '<apikey>'
openai_apikey = '<apikey>'

"""
Можно будет впоследствии добавить классы для парсинга ссылок с RuTube и VK
"""

class YVid():
    def __init__(self):
        self.link = "https://www.googleapis.com/youtube/v3/search"

    def get_json(self, search, mres):
        params = {
            'part': 'snippet',
            'maxResults': mres,
            'q': search,
            'type': 'video',
            'videoDuration': 'any',
            'order': 'viewCount',
            'key': yt_apikey,
        }

        response = requests.get(self.link, params=params)
        if response.status_code != 200:
            return None

        return response.json()

    def get_urls(self, search, mres):
        ans = self.get_json(search, mres)

        lst_ids = list()
        lst_links = list()

        for item in ans.get('items'):
            if item:
                link = 'https://www.youtube.com/watch?v='
                lst_links.append(
                    link + item.get('id').get('videoId')
                )
                lst_ids.append(
                    item.get('id').get('videoId')
                )

            else:
                return None

        return lst_ids

    def process(self, search, mres = 1):
        return self.get_urls(search, mres)

class TranscriptYoutube():
    def __init__(self):
        self.transcript = YouTubeTranscriptApi()

    def get_subtitles(self, ids):
        '''
        Функция для получения субтитров.
        :param ids: Может быть ссылка на видео, либо id видео, либо список id видео.
        :return: субтитры видео
        '''

        if not isinstance(ids, list):
            ids = [ids]

        texts = []
        for id in ids:
            text = ''
            try:
                ts = self.transcript.get_transcript(id, languages=['ru', 'en'])
                for elem in ts:
                    text += elem.get('text') + ' '

                texts.append(text)
            except Exception as err:
                pass

        return texts

class AISubtitles_summary():
    simple_prompt = """Ты - эксперт в области экономики и металлургии.
                  Ты анализируешь субтитры к одному из видео про металлургический комплекс РФ.
                  Выдели особенности, цифры, тезисы и прочее."""

    def __init__(self, DEBUG=True, model='gpt-4o'):
        self.model = model
        self.DEBUG = DEBUG  # Переменная для подтверждения использования токенов OpenAI.

        self.client = OpenAI(api_key = openai_apikey)
        self.modes = {
            'simple': self.simple_summary,
        }

    def __confirm(self):
        prompt = "Вы уверены в использовании токенов? \nВероятно большое их использование. \n>> Y/(any to drop)"
        if self.DEBUG:
            if input(prompt) != 'Y':
                raise Exception('Использование токенов не подтверждено.')
        return True

    def simple_summary(self, text):
        '''
        Простая суммаризация одним агентом GPT-4o.
        :param text:
        :return:
        '''
        client_ = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": self.simple_prompt},
                {"role": "user", "content": text}
            ],
        )

        self.__confirm()
        return client_.to_dict().get('choices')[-1]['message']['content']

    def youtube_scraper(self, thesis, video_amnt=1, idx=None):
        transcriptor = TranscriptYoutube()
        responser_y = YVid()

        ids = responser_y.process(thesis, video_amnt)
        ids = idx if idx else ids
        texts = transcriptor.get_subtitles(ids)

        return texts

    def mode(self, mode, elem):
        if len(elem) == 0:
            return None

        return self.modes[mode](elem)

    def correct(self, idx):
        if not isinstance(idx, type(None)):
            idx = None if len(idx) == 0 else idx

        if isinstance(idx, list):
            l = idx
            for index, item in enumerate(l):
                try:
                    l[index] = item.split('=')[1]
                except Exception:
                    pass
            return l

        if isinstance(idx, str):
            try:
                return idx.split('=')[1]
            except Exception:
                return idx

    def save(self, report):
        if 'reports' not in os.listdir():
          os.mkdir('reports')


        if isinstance(report, list):
            repo = ''
            for i, rp in enumerate(report):
                repo += rp + f'\n {"-" * 20}\n'

            with open(f'reports/report.txt', 'w', encoding='utf-8') as file:
                file.write(repo)


        if isinstance(report, str):
            with open(f'reports/report.txt', 'w', encoding='utf-8') as file:
                file.write(report)


    def process(self, text, mode='yandex', concat=True, video_amnt=1, idx=None):
        '''
        :param text: Тезис, по которому ищутся видео на Youtube. Является целью исследования.
        :param mode: Режим работы суммаризатора (yandex, simple, complex)
        :param concat: Исследование раздельно/совместно. True/False
        :param video_amnt: Количество исследуемых видео
        :param idx: ID или Ссылки на видео, которые нужно исследовать
        :return: список/строка, суммаризация субтитров видео.
        '''

        counter = 0
        idx = self.correct(idx)
        subtitles = self.youtube_scraper(text, video_amnt, idx)

        if concat:
            jointext = ''
            for index, elem in enumerate(subtitles):
                counter += 1
                jointext += elem + '\n'

            repo = self.mode(mode, jointext)
            self.save(repo)
            return repo

        else:
            analysis_subtitles = []
            for elem in subtitles:
                counter += 1
                time.sleep(1)
                red = self.mode(mode, elem)
                analysis_subtitles.append(red)

            self.save(analysis_subtitles)
            return analysis_subtitles

processor = AISubtitles_summary()
processor.process(
    ''
)