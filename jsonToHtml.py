import json

def generate_table_html(section):
    # Filter out duplicates and unwanted content
    seen_links = set()
    filtered_links = []
    current_text = None
    current_urls = []
    
    for link in section['links']:
        if (not 'megathread' in link['url'].lower() and 
            not 'safety' in link['text'].lower()):
            if link['text'].isdigit() and current_text:
                current_urls.append(link['url'])
            else:
                if current_text and current_urls:
                    filtered_links.append({"text": current_text, "urls": current_urls})
                current_text = link['text']
                current_urls = [link['url']]
    
    if current_text and current_urls:
        filtered_links.append({"text": current_text, "urls": current_urls})

    section_id = section['title'].lower()
    section_id = section_id.replace(' ', '_')
    section_id = section_id.replace('➜', '')
    section_id = section_id.replace('!', '')
    section_id = section_id.strip('_')
    
    html = f'''
            <div class="table-wrapper" id="{section_id}Table">
                <table class="fl-table">
                    <thead>
                    <tr>
                        <th>{section['title']}</th>
                    </tr>
                    </thead>
                    <tbody>
                    '''
    
    for link in filtered_links:
        urls_html = ' '.join([f'<a href="{url}" target="_blank">{"Mirror " + str(i+1) if i > 0 else link["text"]}</a>' for i, url in enumerate(link.get("urls", []))])
        html += f'''
                    <tr>
                        <td>{urls_html}</td>
                    </tr>
        '''
    
    html += '''
                    </tbody>
                </table>
            </div>
    '''
    return html

# Read the JSON file
with open('data/piracy_megathread.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Create complete HTML structure
complete_html = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Piracy Megathread - WPI</title>
    <link rel="stylesheet" href="styles/main.css">
    <link rel="stylesheet" href="styles/animations.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <nav class="top-nav">
        <div class="logo">
            <a href="./index.html"><i class="fas fa-desktop"></i> WPI</a>
        </div>
        <div class="nav-controls">
            <label for="category">Choose Category:</label>
            <select id="category" onchange="showTable()">
'''

# Add dropdown options dynamically based on sections
for section in data['sections']:
    section_id = section['title'].lower().replace(' ', '_').replace('➜', '').replace('!', '').strip('_')
    complete_html += f'                <option value="{section_id}">{section["title"]}</option>\n'

complete_html += '''
            </select>
        </div>
    </nav>
    <header class="site-header">
        <h1>Piracy Megathread</h1>
        <p class="subtitle">Live data from r/Piracy megathread</p>
    </header>

    <div class="content-container">
        <div class="table-sections">
'''

# Add all tables
for section in data['sections']:
    complete_html += generate_table_html(section)

# Add closing tags and scripts
complete_html += '''
        </div>
    </div>

    <script>
        document.addEventListener("DOMContentLoaded", function() {
            showTable();
            addTableAnimations();
        });

        function showTable() {
            var category = document.getElementById("category").value;
            var tables = document.querySelectorAll('.table-wrapper');
            
            tables.forEach(function(table) {
                table.classList.add('hidden');
                table.classList.remove('visible');
            });

            var selectedTable = document.getElementById(category + "Table");
            selectedTable.classList.remove('hidden');
            setTimeout(() => {
                selectedTable.classList.add('visible');
            }, 50);
        }

        function addTableAnimations() {
            document.querySelectorAll('.table-wrapper').forEach(function(table) {
                table.classList.add('animate-on-scroll');
            });
        }
    </script>
</body>
</html>'''

# Write the complete HTML file
with open('megathread.html', 'w', encoding='utf-8') as f:
    f.write(complete_html)

print("Complete HTML file 'megathread.html' has been generated successfully.")
