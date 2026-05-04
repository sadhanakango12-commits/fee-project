const searchProducts = [
    { name: "Black Oversized T-Shirt", link: "black_oversized_tshirt.html" },
    { name: "Black Slim Shirt", link: "black_slim_shirt.html" },
    { name: "Black Sports Shoes", link: "black_sports_shoes.html" },
    { name: "Blue Street T-Shirt", link: "blue_street_tshirt.html" },
    { name: "Casual Sneakers", link: "casual_sneakers.html" },
    { name: "Checked Casual Shirt", link: "checked_casual_shirt.html" },
    { name: "Classic Analog Watches", link: "classic_analog_watches.html" },
    { name: "Classic White Shirt", link: "classic_white_shirt.html" },
    { name: "Comfort Sandals", link: "comfort_sandles.html" },
    { name: "Diamond Earrings", link: "diamond_earings.html" },
    { name: "Elegant Black Dress", link: "elegant_black.html" },
    { name: "Floral Dress", link: "floral.html" },
    { name: "Golden Necklace", link: "golden_neckless.html" },
    { name: "Graphic Print T-Shirt", link: "graphic_print_tshirt.html" },
    { name: "Leather Boots", link: "leather_boots.html" },
    { name: "Leather Sling Bag", link: "leather_sling_bag.html" },
    { name: "Luxury Steel Watch", link: "luxury_steel_watch.html" },
    { name: "Minimal Black Watch", link: "minimal_black_watch.html" },
    { name: "Mini Backpack", link: "minni_packpack.html" },
    { name: "Modern Smart Watch", link: "modern_smart_watch.html" },
    { name: "Party Clutch", link: "party_clutch.html" },
    { name: "Party Wear Dress", link: "party_wear.html" },
    { name: "Running Shoes", link: "running_shoes.html" },
    { name: "Silver Bracelet", link: "silver_braclet.html" },
    { name: "Street Style Sneakers", link: "street_styl_sneaker.html" },
    { name: "Styling Heels", link: "styling_heels.html" },
    { name: "Stylish Handbag", link: "stylish_handbag.html" },
    { name: "Traditional Jhumka", link: "traditional_jhumka.html" },
    { name: "White Casual T-Shirt", link: "whirte_casual_tshirt.html" },
    { name: "White Sneakers", link: "white_sneaker.html" }
];

document.addEventListener('DOMContentLoaded', () => {
    // Inject CSS for the dropdown
    const style = document.createElement('style');
    style.innerHTML = `
        .search-autocomplete-dropdown {
            position: absolute;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            max-height: 300px;
            overflow-y: auto;
            z-index: 10000;
            display: none;
            width: 100%;
            border: 1px solid #e2e8f0;
        }
        .search-autocomplete-dropdown.active {
            display: block;
            animation: fadeInDown 0.2s ease-out;
        }
        .search-item {
            padding: 12px 18px;
            cursor: pointer;
            transition: background 0.2s;
            color: #334155;
            display: flex;
            align-items: center;
            gap: 10px;
            border-bottom: 1px solid #f1f5f9;
        }
        .search-item:last-child {
            border-bottom: none;
        }
        .search-item:hover {
            background: #f8fafc;
            color: #2563eb;
        }
        .search-item i {
            color: #94a3b8;
            font-size: 0.9rem;
        }
        .search-item:hover i {
            color: #2563eb;
        }
        @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);

    const searchBoxes = document.querySelectorAll('.search-box');
    
    searchBoxes.forEach(searchBox => {
        const input = searchBox.querySelector('input');
        if (!input) return;

        // Ensure searchBox has relative positioning for the dropdown
        searchBox.style.position = 'relative';
        // Remove overflow hidden from search box so dropdown can overflow
        searchBox.style.overflow = 'visible';
        
        // We need to keep the border radius look, but if we remove overflow hidden, 
        // the inner elements might leak if they have background. 
        // Let's modify the input and button inside slightly if needed, 
        // or we can append the dropdown to the document body to avoid overflow issues entirely.
        
        // Actually, appending to searchBox is fine if we make searchBox overflow: visible.
        // Let's create the dropdown
        const dropdown = document.createElement('div');
        dropdown.className = 'search-autocomplete-dropdown';
        // Position it just below the search box
        dropdown.style.top = '100%';
        dropdown.style.marginTop = '8px';
        dropdown.style.left = '0';
        searchBox.appendChild(dropdown);

        input.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            dropdown.innerHTML = '';
            
            if (query.length === 0) {
                dropdown.classList.remove('active');
                return;
            }

            const results = searchProducts.filter(product => 
                product.name.toLowerCase().includes(query)
            );

            if (results.length > 0) {
                dropdown.classList.add('active');
                results.forEach(product => {
                    const item = document.createElement('div');
                    item.className = 'search-item';
                    item.innerHTML = `<i class="fas fa-search"></i> ${product.name}`;
                    item.addEventListener('click', () => {
                        window.location.href = product.link;
                    });
                    dropdown.appendChild(item);
                });
            } else {
                dropdown.classList.add('active');
                const noResult = document.createElement('div');
                noResult.className = 'search-item';
                noResult.style.color = '#94a3b8';
                noResult.style.cursor = 'default';
                noResult.innerHTML = 'No products found';
                dropdown.appendChild(noResult);
            }
        });

        // Hide dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchBox.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });

        // Show again if clicking back on input and there's text
        input.addEventListener('focus', () => {
            if (input.value.trim().length > 0 && dropdown.children.length > 0) {
                dropdown.classList.add('active');
            }
        });
    });
});
