import hashlib
import json

from scrapy.exceptions import DropItem


class HarvesterDedupPipeline:
    def __init__(self):
        self.seen = set()

    def process_item(self, item, spider):
        fingerprint = hashlib.md5(json.dumps(dict(item), sort_keys=True).encode()).hexdigest()
        if fingerprint in self.seen:
            raise DropItem("Duplicate item")
        self.seen.add(fingerprint)
        return item
