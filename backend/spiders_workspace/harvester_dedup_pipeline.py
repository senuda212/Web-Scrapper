
import hashlib
import json


class HarvesterDedupPipeline:
    def __init__(self):
        self.seen = set()

    def process_item(self, item, spider):
        fp = hashlib.md5(json.dumps(dict(item), sort_keys=True).encode()).hexdigest()
        if fp in self.seen:
            from scrapy.exceptions import DropItem
            raise DropItem("Duplicate item")
        self.seen.add(fp)
        return item
