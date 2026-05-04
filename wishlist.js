document.addEventListener("DOMContentLoaded", () => {
    // 1. Inject FontAwesome if not exists
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const fa = document.createElement('link');
        fa.rel = 'stylesheet';
        fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
        document.head.appendChild(fa);
    }

    // 2. Inject CSS for wishlist buttons and navbar dropdown
    const style = document.createElement('style');
    style.innerHTML = `
        /* Product Card Heart Button */
        .wishlist-btn-dynamic {
            position: absolute;
            top: 15px;
            right: 15px;
            background: rgba(255, 255, 255, 0.9);
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            z-index: 10;
            color: #ccc;
            font-size: 1.2rem;
            backdrop-filter: blur(5px);
        }
        .wishlist-btn-dynamic:hover {
            transform: scale(1.1);
            color: #ef4444;
        }
        .wishlist-btn-dynamic.active {
            color: #ef4444;
        }
        .wishlist-btn-dynamic.active i {
            animation: pulseHeart 0.3s ease;
        }
        @keyframes pulseHeart {
            0% { transform: scale(1); }
            50% { transform: scale(1.3); }
            100% { transform: scale(1); }
        }
        .product-image .wishlist-btn-dynamic {
            top: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            font-size: 1.5rem;
        }

        /* Navbar Wishlist Button */
        .wishlist-nav-btn {
            padding: 10px 18px;
            border: none;
            border-radius: 25px;
            background: #f1f5f9;
            cursor: pointer;
            font-weight: 600;
            position: relative;
            color: #0f172a;
            transition: 0.3s;
            margin-right: 5px;
        }
        .wishlist-nav-btn:hover {
            background: #e2e8f0;
        }
        .wishlist-nav-btn i {
            color: #ef4444;
        }

        /* Navbar Wishlist Dropdown */
        .wishlist-dropdown {
            position: absolute;
            top: 65px;
            right: 120px; /* Offset from cart dropdown */
            width: 340px;
            max-height: 420px;
            overflow-y: auto;
            background: white;
            border-radius: 18px;
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
            padding: 15px;
            display: none;
            z-index: 9999;
        }
        @media (max-width: 768px) {
            .wishlist-dropdown { right: 0; }
        }
        .wishlist-dropdown.active {
            display: block;
        }
        .wishlist-dropdown h3 {
            margin-bottom: 12px;
            font-size: 1.1rem;
            color: #0f172a;
        }
        .wishlist-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px;
            border-radius: 12px;
            cursor: pointer;
            transition: 0.3s;
            margin-bottom: 10px;
            position: relative;
        }
        .wishlist-item:hover {
            background: #f8fafc;
        }
        .wishlist-item img {
            width: 55px;
            height: 55px;
            object-fit: cover;
            border-radius: 10px;
        }
        .wishlist-item-info {
            flex: 1;
        }
        .wishlist-item-info h4 {
            font-size: 0.95rem;
            margin-bottom: 4px;
            color: #0f172a;
        }
        .wishlist-item-info p {
            font-size: 0.85rem;
            color: #64748b;
        }
        .remove-wishlist {
            position: absolute;
            top: 8px;
            right: 8px;
            width: 24px;
            height: 24px;
            border: none;
            border-radius: 50%;
            background: #fee2e2;
            color: #dc2626;
            cursor: pointer;
            font-size: 12px;
            transition: 0.3s;
        }
        .remove-wishlist:hover {
            background: #fecaca;
            transform: scale(1.1);
        }
        .empty-wishlist {
            text-align: center;
            color: #64748b;
            padding: 20px 0;
        }
    `;
    document.head.appendChild(style);

    // 3. Wishlist State Management
    let wishlist = JSON.parse(localStorage.getItem('uniswap_wishlist')) || [];

    function saveWishlist() {
        localStorage.setItem('uniswap_wishlist', JSON.stringify(wishlist));
        updateWishlistNavbar();
        syncProductHeartIcons();
    }

    // 4. Inject Navbar UI
    const navRight = document.querySelector('.nav-right');
    if (navRight) {
        // Create the Nav Button
        const navBtn = document.createElement('button');
        navBtn.className = 'wishlist-nav-btn';
        navBtn.innerHTML = '<i class="fas fa-heart"></i> Likes (<span id="wishlist-nav-count">0</span>)';
        
        // Create the Dropdown
        const dropdown = document.createElement('div');
        dropdown.className = 'wishlist-dropdown';
        dropdown.id = 'wishlist-dropdown';
        dropdown.innerHTML = `
            <h3>Your Wishlist</h3>
            <div id="wishlist-nav-items"></div>
        `;

        // Insert before cart button or at the end
        const cartBtn = navRight.querySelector('.cart-btn');
        if (cartBtn) {
            navRight.insertBefore(navBtn, cartBtn);
            navRight.insertBefore(dropdown, cartBtn);
        } else {
            navRight.appendChild(navBtn);
            navRight.appendChild(dropdown);
        }

        // Toggle dropdown logic
        navBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target) && !navBtn.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    }

    // Expose remove function to global scope so inline onclick works
    window.removeWishlistItem = function(index, e) {
        if (e) e.stopPropagation();
        wishlist.splice(index, 1);
        saveWishlist();
    };

    function updateWishlistNavbar() {
        const countSpan = document.getElementById('wishlist-nav-count');
        const itemsContainer = document.getElementById('wishlist-nav-items');
        
        if (countSpan) countSpan.innerText = wishlist.length;
        
        if (itemsContainer) {
            if (wishlist.length === 0) {
                itemsContainer.innerHTML = '<div class="empty-wishlist">Your wishlist is empty</div>';
            } else {
                itemsContainer.innerHTML = wishlist.map((item, index) => `
                    <div class="wishlist-item" onclick="window.location.href='${item.link}'">
                        <img src="${item.image}">
                        <div class="wishlist-item-info">
                            <h4>${item.name}</h4>
                            <p>${item.price}</p>
                        </div>
                        <button class="remove-wishlist" onclick="window.removeWishlistItem(${index}, event)">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `).join('');
            }
        }
    }

    function toggleWishlist(item) {
        const index = wishlist.findIndex(w => w.name === item.name);
        if (index > -1) {
            wishlist.splice(index, 1); // Remove
        } else {
            wishlist.push(item); // Add
        }
        saveWishlist();
    }

    function isWishlisted(name) {
        return wishlist.some(w => w.name === name);
    }

    // Sync all product heart icons on the current page
    function syncProductHeartIcons() {
        document.querySelectorAll('.wishlist-btn-dynamic').forEach(btn => {
            const itemName = btn.getAttribute('data-item-name');
            if (isWishlisted(itemName)) {
                btn.classList.add('active');
                btn.innerHTML = '<i class="fa-solid fa-heart"></i>';
            } else {
                btn.classList.remove('active');
                btn.innerHTML = '<i class="fa-regular fa-heart"></i>';
            }
        });
    }

    // 5. Inject buttons into Product Cards
    document.querySelectorAll('.card').forEach(card => {
        card.style.position = 'relative';
        
        let titleEl = card.querySelector('h3');
        let imgEl = card.querySelector('img');
        let linkEl = card.querySelector('a');
        let priceEl = card.querySelector('.sale') || card.querySelector('.price');

        if (!titleEl || !imgEl) return;

        let item = {
            name: titleEl.innerText.trim(),
            image: imgEl.src,
            link: linkEl ? linkEl.href : window.location.href,
            price: priceEl ? priceEl.innerText : ''
        };

        let btn = document.createElement('button');
        btn.className = 'wishlist-btn-dynamic';
        btn.setAttribute('data-item-name', item.name);
        
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(item);
        });

        card.appendChild(btn);
    });

    // 6. Inject buttons into Product Detail Pages
    let productContainer = document.querySelector('.product-container');
    if (productContainer) {
        let titleEl = productContainer.querySelector('h1');
        let imgEl = productContainer.querySelector('img');
        let priceEl = productContainer.querySelector('.price');
        
        if (titleEl && imgEl) {
            let item = {
                name: titleEl.innerText.trim(),
                image: imgEl.src,
                link: window.location.href,
                price: priceEl ? priceEl.innerText : ''
            };

            let imgContainer = productContainer.querySelector('.product-image');
            if (imgContainer) {
                imgContainer.style.position = 'relative';

                let btn = document.createElement('button');
                btn.className = 'wishlist-btn-dynamic';
                btn.setAttribute('data-item-name', item.name);
                
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWishlist(item);
                });

                imgContainer.appendChild(btn);
            }
        }
    }

    // Initialize UI on load
    updateWishlistNavbar();
    syncProductHeartIcons();
});
