import openai

from 回测.config import LLM_MODEL, LLM_API_KEY, LLM_BASE_URL


class LLMHelper:

    def __init__(self):

        openai.api_key = LLM_API_KEY

        openai.base_url = LLM_BASE_URL



    def ask(self, prompt):

        try:

            rsp = openai.chat.completions.create(model=LLM_MODEL, messages=[{"role": "user", "content": prompt}])

            return rsp.choices[0].message.content

        except:

            return "大模型调用失败"