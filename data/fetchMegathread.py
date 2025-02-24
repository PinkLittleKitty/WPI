import requests
from bs4 import BeautifulSoup
import json

# URL of the rPiracy megathread
url = "https://www.reddit.com/r/Piracy/wiki/megathread"

# Set headers to mimic a real browser request
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
}

# Fetch the content of the megathread
response = requests.get(url, headers=headers)
if response.status_code != 200:
    print(f"Failed to retrieve the page. Status code {response.status_code}")
    exit()

# Parse the HTML content
soup = BeautifulSoup(response.text, 'html.parser')

# Initialize the JSON structure
data = {"sections": []}

# Find the main content div
main_content = soup.find('div', class_='md wiki')

# Find all sections in the megathread
sections = main_content.find_all(['h2', 'h3']) if main_content else []

for section in sections:
    section_title = section.get_text(strip=True)
    links = []
    current = section.find_next()
    
    # Continue until we hit the next section or run out of content
    while current and current.name not in ['h2', 'h3']:
        if current.name == 'a':
            link_text = current.get_text(strip=True)
            link_url = current.get('href')
            if link_url and not link_url.startswith('#'):
                links.append({"text": link_text, "url": link_url})
        elif current.find_all('a'):
            for link in current.find_all('a'):
                link_text = link.get_text(strip=True)
                link_url = link.get('href')
                if link_url and not link_url.startswith('#'):
                    links.append({"text": link_text, "url": link_url})
        current = current.find_next()
    
    if links:  # Only add sections that have links
        data["sections"].append({"title": section_title, "links": links})

# Save the data to a JSON file
with open('piracy_megathread.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=4, ensure_ascii=False)

print("JSON file 'piracy_megathread.json' has been created successfully.")
