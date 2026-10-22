/**
 * js/index.js
 * Mengambil data produk dari DummyJSON API dan menampilkannya dalam format editorial luxury.
 * Praktikum 6 PAW - Muhamad Irfan Al Arib (20240140171)
 */

const btnLoadData = document.getElementById('btnLoadData');
const productList = document.getElementById('productList');
const loadingStatus = document.getElementById('loadingStatus');
const errorStatus = document.getElementById('errorStatus');

// Kontrol Editorial
const skeletonLoader = document.getElementById('skeletonLoader');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const categoryFilters = document.getElementById('categoryFilters');
const productCounter = document.getElementById('productCounter');
const activeCategoryTag = document.getElementById('activeCategoryTag');
const resetCategoryBtn = document.getElementById('resetCategoryBtn');

// Modal Elements
const productModal = document.getElementById('productModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalBody = document.getElementById('modalBody');

// State
let allProducts = [];
let currentCategory = 'all';

// Event Listeners
if (btnLoadData) {
    btnLoadData.addEventListener('click', fetchProducts);
}
if (searchInput) {
    searchInput.addEventListener('input', applyFiltersAndSort);
}
if (sortSelect) {
    sortSelect.addEventListener('change', applyFiltersAndSort);
}
if (resetCategoryBtn) {
    resetCategoryBtn.addEventListener('click', () => {
        currentCategory = 'all';
        applyFiltersAndSort();
        updateCategoryActiveUI();
    });
}

// Modal closing
if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
}
if (productModal) {
    productModal.addEventListener('click', (e) => {
        if (e.target === productModal) closeModal();
    });
}
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && productModal && productModal.classList.contains('active')) {
        closeModal();
    }
});

/**
 * Fetch Data Produk dari DummyJSON API
 */
async function fetchProducts() {
    loadingStatus.classList.remove('hidden');
    if (skeletonLoader) skeletonLoader.classList.remove('hidden');
    errorStatus.classList.add('hidden');
    productList.innerHTML = '';
    btnLoadData.disabled = true;
    if (productCounter) productCounter.textContent = 'Menghubungkan ke API...';

    try {
        const url = "https://dummyjson.com/products";
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Request gagal dengan status ${response.status}`);
        }

        const data = await response.json();
        allProducts = data.products || [];

        // Buat daftar kategori radio-style sesuai referensi
        setupCategoryFilters(allProducts);

        // Render produk
        applyFiltersAndSort();

        showToast(`${allProducts.length} produk berhasil dimuat`, 'fa-check');

    } catch (error) {
        console.error("Fetch error:", error);
        errorStatus.innerHTML = `
            <i class="fa-solid fa-circle-exclamation"></i>
            <span>Gagal memuat data produk: ${error.message}</span>
        `;
        errorStatus.classList.remove('hidden');
        if (productCounter) productCounter.textContent = 'Gagal memuat data.';
        showToast('Gagal terhubung ke API', 'fa-xmark');
    } finally {
        loadingStatus.classList.add('hidden');
        if (skeletonLoader) skeletonLoader.classList.add('hidden');
        btnLoadData.disabled = false;
    }
}

/**
 * Membuat filter kategori radio-style seperti pada gambar
 */
function setupCategoryFilters(products) {
    if (!categoryFilters) return;

    const categories = ['all', ...new Set(products.map(p => p.category))];
    categoryFilters.innerHTML = '';

    categories.forEach(cat => {
        const count = cat === 'all' 
            ? products.length 
            : products.filter(p => p.category === cat).length;

        const item = document.createElement('div');
        item.classList.add('category-checkbox-item');
        if (cat === currentCategory) item.classList.add('active');
        item.setAttribute('data-category', cat);

        const label = cat === 'all' 
            ? 'Semua Kategori' 
            : cat.charAt(0).toUpperCase() + cat.slice(1);

        item.innerHTML = `
            <span><span class="category-radio-icon"></span>${label}</span>
            <span style="font-size: 0.72rem; color: var(--text-muted);">${count}</span>
        `;

        item.addEventListener('click', () => {
            currentCategory = cat;
            updateCategoryActiveUI();
            applyFiltersAndSort();
        });

        categoryFilters.appendChild(item);
    });
}

function updateCategoryActiveUI() {
    const items = document.querySelectorAll('.category-checkbox-item');
    items.forEach(el => {
        if (el.getAttribute('data-category') === currentCategory) {
            el.classList.add('active');
        } else {
            el.classList.remove('active');
        }
    });

    if (activeCategoryTag) {
        activeCategoryTag.textContent = currentCategory === 'all' 
            ? 'All Collection' 
            : currentCategory.toUpperCase();
    }
}

/**
 * Filter dan Sort Produk
 */
function applyFiltersAndSort() {
    if (!allProducts.length) return;

    const keyword = (searchInput ? searchInput.value.trim().toLowerCase() : '');
    const sortVal = (sortSelect ? sortSelect.value : 'default');

    let filtered = allProducts.filter(item => {
        const matchesCategory = (currentCategory === 'all' || item.category === currentCategory);
        const matchesKeyword = (
            item.title.toLowerCase().includes(keyword) ||
            (item.brand && item.brand.toLowerCase().includes(keyword)) ||
            item.category.toLowerCase().includes(keyword) ||
            (item.description && item.description.toLowerCase().includes(keyword))
        );
        return matchesCategory && matchesKeyword;
    });

    if (sortVal === 'price-low') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sortVal === 'price-high') {
        filtered.sort((a, b) => b.price - a.price);
    } else if (sortVal === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
    }

    renderProducts(filtered);
}

/**
 * Render Kartu Produk sesuai gaya gambar referensi
 */
function renderProducts(products) {
    productList.innerHTML = '';

    if (productCounter) {
        productCounter.textContent = `Showing ${products.length} of ${allProducts.length} items`;
    }

    if (products.length === 0) {
        productList.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
                <p style="font-size: 1rem; color: var(--text-primary); margin-bottom: 0.35rem;">No products match your criteria</p>
                <p style="font-size: 0.82rem;">Try adjusting your search terms or category filter.</p>
            </div>
        `;
        return;
    }

    products.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('product-card');

        // Simulasi like count proporsional dengan rating produk (seperti pada referensi gambar: 168 likes, 212 likes, etc.)
        const simulatedLikes = Math.floor((product.rating || 4.2) * 58) + (product.id * 3 % 40);

        card.innerHTML = `
            <div class="product-img-wrapper">
                <img src="${product.thumbnail}" alt="${product.title}" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80';">
                <div class="product-card-hover-actions">
                    <button class="btn-hover-quick btn-detail" data-id="${product.id}">Detail</button>
                    <a href="form.html?nama=${encodeURIComponent(product.title)}&keunggulan=${encodeURIComponent(product.description || (product.title + ' $' + product.price))}" class="btn-hover-quick">Caption</a>
                </div>
            </div>

            <div class="product-card-body">
                <div class="product-meta-row">
                    <span class="product-brand">${product.brand || product.category || 'Atelier'}</span>
                    <span class="product-likes"><i class="fa-solid fa-heart"></i> ${simulatedLikes} likes</span>
                </div>

                <h3 title="${product.title}">${product.title}</h3>

                <div class="product-price-row">
                    <span class="price">$${product.price}</span>
                    <span style="font-size: 0.72rem; color: var(--text-muted);">★ ${(product.rating || 4.5).toFixed(1)}</span>
                </div>
            </div>
        `;

        const detailBtn = card.querySelector('.btn-detail');
        if (detailBtn) {
            detailBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openModal(product);
            });
        }

        // Klik pada kartu juga membuka modal detail
        card.addEventListener('click', () => openModal(product));

        productList.appendChild(card);
    });
}

/**
 * Modal Detail Produk
 */
function openModal(product) {
    if (!productModal || !modalBody) return;

    modalBody.innerHTML = `
        <div class="modal-img-wrapper">
            <img src="${product.thumbnail}" alt="${product.title}">
        </div>
        <div class="modal-details">
            <span class="modal-category">${product.category} • ${product.brand || 'Original Brand'}</span>
            <h2>${product.title}</h2>
            <p class="modal-desc">${product.description || 'Deskripsi produk berkualitas tinggi dengan kurasi terbaik.'}</p>
            
            <div class="modal-specs-list">
                <div class="spec-item">
                    <span>Price</span>
                    <strong>$${product.price}</strong>
                </div>
                <div class="spec-item">
                    <span>Stock</span>
                    <strong>${product.stock || 25} Units</strong>
                </div>
                <div class="spec-item">
                    <span>Rating</span>
                    <strong>${(product.rating || 4.5).toFixed(2)} / 5.0</strong>
                </div>
                <div class="spec-item">
                    <span>Shipping</span>
                    <strong>${product.shippingInformation || 'Standard Delivery'}</strong>
                </div>
            </div>

            <div style="display: flex; gap: 0.65rem; margin-top: 1rem;">
                <a href="form.html?nama=${encodeURIComponent(product.title)}&keunggulan=${encodeURIComponent(product.description || product.title)}" class="btn" style="flex: 1; text-align: center;">
                    Buat Caption Promosi
                </a>
            </div>
        </div>
    `;

    productModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    if (productModal) {
        productModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * Toast Notification Minimal
 */
function showToast(message, icon = 'fa-check') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <i class="fa-solid ${icon}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.transition = 'all 0.25s ease';
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 250);
    }, 2800);
}
