import random

_UA_LIST = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15",
    "Mozilla/5.0 (X11; Linux x86_64; rv:127.0) Gecko/20100101 Firefox/127.0",
]


class AntiBotMiddleware:
    def process_request(self, request, spider):
        request.headers["User-Agent"] = random.choice(_UA_LIST)
        request.headers["Accept-Language"] = "en-US,en;q=0.9"
        return None
