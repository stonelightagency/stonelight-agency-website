document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENT SELECTION ---
    const grid = document.getElementById('blog-grid-main');
    const searchBar = document.getElementById('blog-search-bar');
    const paginationContainer = document.getElementById('blog-pagination');
    const noResultsMessage = document.getElementById('no-results-message');
    
    // Modal elements
    const filterModal = document.getElementById('filter-modal');
    const openFilterBtn = document.getElementById('open-filter-modal-btn');
    const closeModalBtn = document.getElementById('close-filter-modal-btn');
    const modalBackdrop = document.querySelector('.filter-modal-backdrop');
    const categoryFiltersContainer = document.getElementById('blog-category-filters');
    
    if (!grid || !filterModal || !paginationContainer || !openFilterBtn) {
        console.error('Essential blog elements are missing from the page.');
        return;
    }
    
    const allPosts = Array.from(grid.querySelectorAll('.blog-card'));
    const categoryButtons = Array.from(categoryFiltersContainer.querySelectorAll('.filter-option-btn'));
    const applyFiltersBtn = document.getElementById('apply-filters-btn');
    const clearFiltersBtn = document.getElementById('clear-filters-btn');


    // --- STATE MANAGEMENT ---
    let state = {
        currentPage: 1,
        postsPerPage: 9,
        activeCategories: [],
        searchQuery: '',
        filteredPosts: [...allPosts],
    };
    
    // State for tracking changes within the modal
    let initialModalCategories = [];
    let tempActiveCategories = [];

    function init() {
        setupEventListeners();
        applyFiltersAndRender();
    }

    function setupEventListeners() {
        searchBar.addEventListener('input', debounce(handleSearch, 300));
        
        openFilterBtn.addEventListener('click', openModal);
        closeModalBtn.addEventListener('click', closeModal);
        modalBackdrop.addEventListener('click', closeModal);
        applyFiltersBtn.addEventListener('click', applyFiltersFromModal);
        clearFiltersBtn.addEventListener('click', clearFiltersInModal);

        categoryButtons.forEach(button => {
            button.addEventListener('click', () => handleCategoryClick(button));
        });

        paginationContainer.addEventListener('click', handlePaginationClick);
    }
    
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    function openModal() {
        initialModalCategories = [...state.activeCategories].sort();
        tempActiveCategories = [...state.activeCategories];
        
        updateModalButtonStates();
        checkFilterChanges();
        
        filterModal.classList.add('active');
        document.body.classList.add('filter-modal-open');
    }

    function closeModal() {
        filterModal.classList.remove('active');
        document.body.classList.remove('filter-modal-open');
    }
    
    function checkFilterChanges() {
        const initialString = initialModalCategories.join(',');
        const tempString = [...tempActiveCategories].sort().join(',');

        if (initialString !== tempString) {
            applyFiltersBtn.textContent = 'Apply Filters';
        } else {
            applyFiltersBtn.textContent = 'Back';
        }
    }

    function updateModalButtonStates() {
        categoryButtons.forEach(button => {
            button.classList.toggle('active', tempActiveCategories.includes(button.dataset.filter));
        });
    }
    
    function handleCategoryClick(button) {
        const filter = button.dataset.filter;
        const index = tempActiveCategories.indexOf(filter);

        if (index > -1) {
            tempActiveCategories.splice(index, 1);
        } else {
            tempActiveCategories.push(filter);
        }
        updateModalButtonStates();
        checkFilterChanges();
    }

    function applyFiltersFromModal() {
        if (applyFiltersBtn.textContent === 'Back') {
            closeModal();
            return;
        }
        
        state.activeCategories = [...tempActiveCategories];
        state.currentPage = 1;
        closeModal();
        applyFiltersAndRender();
    }

    function clearFiltersInModal() {
        tempActiveCategories = [];
        updateModalButtonStates();
        checkFilterChanges();
    }

    function handleSearch(e) {
        state.searchQuery = e.target.value.toLowerCase().trim();
        state.currentPage = 1;
        applyFiltersAndRender();
    }

    function applyFiltersAndRender() {
        let postsToFilter = allPosts;

        if (state.activeCategories.length > 0) {
            postsToFilter = postsToFilter.filter(post => {
                const postCategories = (post.dataset.categories || '').split(',');
                return state.activeCategories.some(activeCat => postCategories.includes(activeCat));
            });
        }

        if (state.searchQuery) {
            postsToFilter = postsToFilter.filter(post => {
                const title = post.querySelector('.blog-card-title a')?.textContent.toLowerCase() || '';
                const excerpt = post.querySelector('.blog-card-excerpt')?.textContent.toLowerCase() || '';
                return title.includes(state.searchQuery) || excerpt.includes(state.searchQuery);
            });
        }

        state.filteredPosts = postsToFilter;

        renderGrid();
        renderPagination();
        updateNoResultsMessage();
        updateFilterButtonIndicator();
    }
    
    function updateFilterButtonIndicator() {
        openFilterBtn.classList.toggle('filters-active', state.activeCategories.length > 0);
    }

    function renderGrid() {
        allPosts.forEach(post => post.style.display = 'none');
        const startIndex = (state.currentPage - 1) * state.postsPerPage;
        const endIndex = startIndex + state.postsPerPage;
        const postsForCurrentPage = state.filteredPosts.slice(startIndex, endIndex);
        postsForCurrentPage.forEach(post => { post.style.display = 'flex'; });
    }

    function renderPagination() {
        paginationContainer.innerHTML = '';
        const totalPages = Math.ceil(state.filteredPosts.length / state.postsPerPage);

        if (totalPages <= 1) return;

        const prevButton = document.createElement('button');
        prevButton.innerHTML = `<i class="fas fa-arrow-left"></i> Prev`;
        prevButton.classList.add('pagination-btn', 'prev-btn');
        prevButton.disabled = state.currentPage === 1;
        prevButton.dataset.action = 'prev';
        paginationContainer.appendChild(prevButton);

        const pageInfo = document.createElement('span');
        pageInfo.textContent = `Page ${state.currentPage} of ${totalPages}`;
        pageInfo.classList.add('pagination-info');
        paginationContainer.appendChild(pageInfo);

        const nextButton = document.createElement('button');
        nextButton.innerHTML = `Next <i class="fas fa-arrow-right"></i>`;
        nextButton.classList.add('pagination-btn', 'next-btn');
        nextButton.disabled = state.currentPage === totalPages;
        nextButton.dataset.action = 'next';
        paginationContainer.appendChild(nextButton);
    }
    
    function handlePaginationClick(e) {
        const target = e.target.closest('button');
        if (!target) return;

        const action = target.dataset.action;
        const totalPages = Math.ceil(state.filteredPosts.length / state.postsPerPage);

        if (action === 'prev' && state.currentPage > 1) {
            state.currentPage--;
        } else if (action === 'next' && state.currentPage < totalPages) {
            state.currentPage++;
        }
        applyFiltersAndRender();
    }

    function updateNoResultsMessage() {
        noResultsMessage.style.display = state.filteredPosts.length === 0 ? 'block' : 'none';
    }

    init();
});