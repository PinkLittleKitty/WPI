document.addEventListener("DOMContentLoaded", function() {
    showTable();
    addTableAnimations();
    setupThemeToggle();
    setupSearch();
    setupViewToggle();
    setupBackToTop();
    addTooltips();
});

function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return; // Guard clause in case element doesn't exist
    
    const htmlElement = document.documentElement;
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    htmlElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
    
    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return; // Guard clause
    
    const clearButton = document.getElementById('clearSearch');
    const tables = document.querySelectorAll('.table-wrapper');
    const noResults = document.createElement('div');
    
    noResults.className = 'no-results';
    noResults.innerHTML = `
        <i class="fas fa-search"></i>
        <h3>No se encontraron resultados</h3>
        <p>Intenta con otra búsqueda o cambia de categoría</p>
    `;
    document.querySelector('.table-sections').appendChild(noResults);
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        clearButton.classList.toggle('visible', searchTerm.length > 0);
        
        let hasResults = false;
        
        if (searchTerm.length > 0) {
            // Show all tables initially to search across all categories
            tables.forEach(table => {
                table.style.display = 'block';
                table.classList.remove('hidden');
                
                const rows = table.querySelectorAll('tbody tr');
                let tableHasResults = false;
                
                rows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    const isMatch = text.includes(searchTerm);
                    row.style.display = isMatch ? '' : 'none';
                    if (isMatch) tableHasResults = true;
                });
                
                if (tableHasResults) {
                    table.style.display = 'block';
                    hasResults = true;
                } else {
                    table.style.display = 'none';
                }
            });
            
            // Hide card containers during search
            document.querySelectorAll('.card-container').forEach(container => {
                container.classList.remove('visible');
            });
            
            noResults.classList.toggle('visible', !hasResults);
        } else {
            // Reset to default view - show only the selected category
            showTable();
            noResults.classList.remove('visible');
        }
    });
    
    if (clearButton) {
        clearButton.addEventListener('click', function() {
            searchInput.value = '';
            searchInput.focus();
            clearButton.classList.remove('visible');
            showTable(); // Show the selected category when cleared
            noResults.classList.remove('visible');
        });
    }
}

function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    const clearButton = document.getElementById('clearSearch');
    
    if (searchInput && clearButton) {
        searchInput.value = '';
        clearButton.classList.remove('visible');
        
        // Reset all table rows to be visible
        document.querySelectorAll('.table-wrapper tbody tr').forEach(row => {
            row.style.display = '';
        });
        
        // Show the selected category
        showTable();
        
        // Hide no results message
        const noResults = document.querySelector('.no-results');
        if (noResults) {
            noResults.classList.remove('visible');
        }
    }
}

function setupViewToggle() {
    const tableViewBtn = document.getElementById('tableView');
    const cardViewBtn = document.getElementById('cardView');
    if (!tableViewBtn || !cardViewBtn) return; // Guard clause
    
    const tableContainers = document.querySelectorAll('.table-wrapper');
    
    // Create card containers for each table
    tableContainers.forEach(table => {
        const tableId = table.id;
        const categoryName = tableId.replace('Table', '');
        const rows = table.querySelectorAll('tbody tr');
        
        // Create card container
        const cardContainer = document.createElement('div');
        cardContainer.className = 'card-container';
        cardContainer.id = categoryName + 'Cards';
        
        // Create cards for each row
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length > 0) {
                const card = document.createElement('div');
                card.className = 'card';
                
                // Card header - first cell content
                const cardHeader = document.createElement('div');
                cardHeader.className = 'card-header';
                cardHeader.textContent = cells[0].textContent;
                card.appendChild(cardHeader);
                
                // Card body - links from other cells
                const cardBody = document.createElement('div');
                cardBody.className = 'card-body';
                
                // Description if available (third cell)
                if (cells.length > 2 && cells[2].textContent.trim()) {
                    const description = document.createElement('p');
                    description.textContent = cells[2].textContent;
                    cardBody.appendChild(description);
                }
                
                // Links (second cell)
                if (cells.length > 1) {
                    const links = cells[1].querySelectorAll('a');
                    if (links.length > 0) {
                        const linksContainer = document.createElement('div');
                        linksContainer.className = 'card-links';
                        
                        links.forEach(link => {
                            const newLink = link.cloneNode(true);
                            linksContainer.appendChild(newLink);
                        });
                        
                        cardBody.appendChild(linksContainer);
                    }
                }
                
                card.appendChild(cardBody);
                cardContainer.appendChild(card);
            }
        });
        
        // Add card container after the table
        table.parentNode.insertBefore(cardContainer, table.nextSibling);
    });
    
    // Toggle between views
    tableViewBtn.addEventListener('click', function() {
        tableViewBtn.classList.add('active');
        cardViewBtn.classList.remove('active');
        
        document.querySelectorAll('.table-wrapper.visible').forEach(table => {
            table.style.display = 'block';
        });
        
        document.querySelectorAll('.card-container').forEach(container => {
            container.classList.remove('visible');
        });
    });
    
    cardViewBtn.addEventListener('click', function() {
        cardViewBtn.classList.add('active');
        tableViewBtn.classList.remove('active');
        
        document.querySelectorAll('.table-wrapper.visible').forEach(table => {
            const tableId = table.id;
            const categoryName = tableId.replace('Table', '');
            const cardContainer = document.getElementById(categoryName + 'Cards');
            
            table.style.display = 'none';
            if (cardContainer) {
                cardContainer.classList.add('visible');
            }
        });
    });
}

function setupBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    if (!backToTopButton) return; // Guard clause
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function addTooltips() {
    // Add tooltips to links that don't have descriptive text
    document.querySelectorAll('td a').forEach(link => {
        const text = link.textContent.trim();
        
        // If the link text is just a version number or "Última", add tooltip
        if (/^\d+(\.\d+)*$/.test(text) || text === 'Última' || text === 'Base' || text === 'Todas') {
            const parentRow = link.closest('tr');
            if (parentRow) {
                const firstCell = parentRow.querySelector('td:first-child');
                if (firstCell) {
                    const parentText = firstCell.textContent.trim();
                    link.setAttribute('data-tooltip', `Descargar ${parentText}`);
                }
            }
        }
    });
}

function showTable() {
    var category = document.getElementById("category").value;
    var tables = document.querySelectorAll('.table-wrapper');
    var cardContainers = document.querySelectorAll('.card-container');
    
    // Hide all tables and card containers
    tables.forEach(function(table) {
        table.classList.add('hidden');
        table.classList.remove('visible');
        table.style.display = 'none'; // Explicitly hide tables
    });
    
    cardContainers.forEach(function(container) {
        container.classList.remove('visible');
    });
    
    // Show selected table
    var selectedTable = document.getElementById(category + "Table");
    if (!selectedTable) return; // Guard clause
    
    selectedTable.classList.remove('hidden');
    
    setTimeout(() => {
        selectedTable.classList.add('visible');
        selectedTable.style.display = 'block'; // Explicitly show the selected table
        
        // If card view is active, show cards instead
        const cardViewBtn = document.getElementById('cardView');
        if (cardViewBtn && cardViewBtn.classList.contains('active')) {
            selectedTable.style.display = 'none';
            const cardContainer = document.getElementById(category + 'Cards');
            if (cardContainer) {
                cardContainer.classList.add('visible');
            }
        }
    }, 50);
}

function addTableAnimations() {
    document.querySelectorAll('.table-wrapper').forEach(function(table) {
        table.classList.add('animate-on-scroll');
    });
}
