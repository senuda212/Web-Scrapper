
import random

try:
    from fake_useragent import UserAgent
    _ua = UserAgent()
    def get_ua():
        return _ua.random
except Exception:
    _UA_LIST = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15",
        "Mozilla/5.0 (X11; Linux x86_64; rv:127.0) Gecko/20100101 Firefox/127.0",
    ]
    def get_ua():
        return random.choice(_UA_LIST)


class AntiBotMiddleware:
    ACCEPT_LANGUAGES = ["en-US,en;q=0.9", "en-GB,en;q=0.8", "en;q=0.7"]

    def process_request(self, request, spider):
        request.headers["User-Agent"] = get_ua()
        request.headers["Accept-Language"] = random.choice(self.ACCEPT_LANGUAGES)
        request.headers["Accept"] = "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
        request.headers["Accept-Encoding"] = "gzip, deflate, br"
        request.headers["Sec-Fetch-Dest"] = "document"
        request.headers["Sec-Fetch-Mode"] = "navigate"
        request.headers["Sec-Fetch-Site"] = "none"
        request.headers["Upgrade-Insecure-Requests"] = "1"
        return None
