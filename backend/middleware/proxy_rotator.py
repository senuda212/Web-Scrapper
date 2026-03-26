import random


class ProxyRotatorMiddleware:
    def __init__(self, proxies: list[str] | None = None):
        self.proxies = proxies or []

    def process_request(self, request, spider):
        if not self.proxies:
            return None
        request.meta["proxy"] = random.choice(self.proxies)
        return None
