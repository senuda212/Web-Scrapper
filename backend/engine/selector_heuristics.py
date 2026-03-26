from lxml import etree


def suggest_basic_selectors(html: str) -> list[dict]:
    suggestions: list[dict] = []
    try:
        root = etree.HTML(html)
        if root is None:
            return []
        mappings = [
            ("h1", "title", "text"),
            ("h2", "heading", "text"),
            ("a", "link", "href"),
            ("img", "image", "src"),
        ]
        for selector, name, attr in mappings:
            if root.cssselect(selector):
                suggestions.append(
                    {"name": name, "selector": selector, "type": "css", "attr": attr}
                )
    except Exception:
        return []
    return suggestions
