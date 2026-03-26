
import json
import hashlib
import sqlite3
import uuid
from datetime import datetime


class HarvesterPipeline:
    def open_spider(self, spider):
        db_path = spider.settings.get("HARVESTER_DB_PATH")
        self.crawl_job_id = spider.settings.get("HARVESTER_CRAWL_JOB_ID")
        self.spider_id = spider.settings.get("HARVESTER_SPIDER_ID")
        self.conn = sqlite3.connect(db_path)
        self.cur = self.conn.cursor()

    def process_item(self, item, spider):
        data = dict(item)
        item_id = str(uuid.uuid4())
        url = data.pop("_url", "")
        fingerprint = hashlib.md5(
            f"{self.spider_id}:{url}:{json.dumps(data, sort_keys=True)}".encode("utf-8")
        ).hexdigest()
        self.cur.execute(
            "INSERT INTO scraped_items (id, crawl_job_id, spider_id, data, url, fingerprint, scraped_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (
                item_id,
                self.crawl_job_id,
                self.spider_id,
                json.dumps(data),
                url,
                fingerprint,
                datetime.utcnow().isoformat(),
            ),
        )
        self.conn.commit()
        self.cur.execute(
            "UPDATE crawl_jobs SET items_scraped = items_scraped + 1 WHERE id = ?",
            (self.crawl_job_id,),
        )
        self.conn.commit()
        return item

    def close_spider(self, spider):
        self.conn.close()
