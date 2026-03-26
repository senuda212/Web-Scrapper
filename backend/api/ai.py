import io

import httpx
from fastapi import APIRouter, HTTPException
from lxml import etree
from pydantic import BaseModel

router = APIRouter(prefix="/api/ai", tags=["ai"])


class FetchPageRequest(BaseModel):
    url: str


class GenerateSelectorsRequest(BaseModel):
    url: str
    html: str
    description: str
    api_key: str | None = None


class GenerateSpiderRequest(BaseModel):
    url: str
    description: str
    api_key: str | None = None


@router.post("/fetch-page")
async def fetch_page(req: FetchPageRequest):
    try:
        async with httpx.AsyncClient(
            timeout=15,
            follow_redirects=True,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            },
        ) as client:
            response = await client.get(req.url)
            return {
                "html": response.text,
                "status_code": response.status_code,
                "url": str(response.url),
                "content_type": response.headers.get("content-type", ""),
            }
    except Exception as exc:
        raise HTTPException(500, f"Failed to fetch URL: {exc}")


@router.post("/generate-selectors")
async def generate_selectors(req: GenerateSelectorsRequest):
    return _heuristic_generate_selectors(req.html)


def _heuristic_generate_selectors(html: str) -> dict:
    fields: list[dict] = []
    try:
        parser = etree.HTMLParser()
        tree = etree.parse(io.StringIO(html), parser)
        root = tree.getroot()
        checks = [
            ("h1", "title", "text"),
            ("h2", "heading", "text"),
            ("p", "paragraph", "text"),
            ("a", "link", "href"),
            ("img", "image", "src"),
            (".price, [class*='price']", "price", "text"),
            (".name, [class*='name'], [class*='title']", "name", "text"),
            (".description, [class*='desc']", "description", "text"),
        ]

        for selector, name, attr in checks:
            try:
                if "." in selector or "[" in selector:
                    elements = root.cssselect(selector)
                else:
                    elements = root.findall(f".//{selector}")
                if elements:
                    fields.append(
                        {
                            "name": name,
                            "selector": selector.split(",")[0].strip(),
                            "type": "css",
                            "attr": attr,
                            "example": (elements[0].text or "").strip()[:80]
                            if getattr(elements[0], "text", None)
                            else "",
                        }
                    )
            except Exception:
                continue
    except Exception:
        pass

    return {"fields": fields[:8], "source": "heuristic"}


@router.post("/generate-spider-code")
async def generate_spider_code(req: GenerateSpiderRequest):
    name = "custom_spider"
    code = f'''import scrapy


class CustomSpider(scrapy.Spider):
    name = "{name}"
    start_urls = ["{req.url}"]

    def parse(self, response):
        # Generated local scaffold (AI provider disabled in this build)
        item = {{
            "url": response.url,
            "title": response.css("title::text").get(default="").strip(),
        }}
        yield item
'''
    return {"code": code, "source": "local-template"}
