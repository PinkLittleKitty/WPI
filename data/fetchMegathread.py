import requests
from bs4 import BeautifulSoup
import json

def fetch_section_content(url):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        content = soup.find('div', class_='md wiki')
        if content:
            links = []
            for a in content.find_all('a'):
                href = a.get('href')
                text = a.get_text(strip=True)
                # Filter out megathread links and safety results
                if (href and 
                    not href.startswith(('#', '/u/')) and 
                    not 'megathread' in href.lower() and
                    not 'safety' in text.lower()):
                    links.append({
                        "text": text,
                        "url": href
                    })
            return links
    return []

data = {"sections": []}
sections = [
    ("⛵ ➜ Not so fast sailor! Do this first", "https://www.reddit.com/r/Piracy/wiki/megathread/tools/"),
    ("🧭 All Purpose", "https://www.reddit.com/r/Piracy/wiki/megathread/all_purpose/"),
    ("⭐ Anime", "https://www.reddit.com/r/Piracy/wiki/megathread/anime/"),
    ("📚 Books", "https://www.reddit.com/r/Piracy/wiki/megathread/books/"),
    ("🕹️ Emulators", "https://www.reddit.com/r/Piracy/wiki/megathread/emulators/"),
    ("🎮 Games", "https://www.reddit.com/r/Piracy/wiki/megathread/games/"),
    ("📱 Mobile", "https://www.reddit.com/r/Piracy/wiki/megathread/mobile/"),
    ("🎦 Movies & TV", "https://www.reddit.com/r/Piracy/wiki/megathread/movies_and_tv/"),
    ("🎹 Music", "https://www.reddit.com/r/Piracy/wiki/megathread/music/"),
    ("⚙️ Software", "https://www.reddit.com/r/Piracy/wiki/megathread/software/"),
    ("🧰 Tools", "https://www.reddit.com/r/Piracy/wiki/megathread/tools/")
]

for title, url in sections:
    links = fetch_section_content(url)
    if links:
        data["sections"].append({"title": title, "links": links})

with open('data/piracy_megathread.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=4, ensure_ascii=False)

print("JSON file created successfully with all section content.")
