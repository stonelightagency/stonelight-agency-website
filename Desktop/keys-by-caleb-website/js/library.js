// library.js
document.addEventListener('DOMContentLoaded', function() {
    const songs = {
        cinematic: [
            // Real Cinematic Songs (7)
            { title: "A Thousand Years", artist: "Christina Perri", src: "assets/audio/samples/Cinematic/Thousand_Years_Improv.mp3", genre: "Pop", mood: "Romantic" },
            { title: "Perfect", artist: "Ed Sheeran", src: "assets/audio/samples/Cinematic/Perfect_Improv.mp3", genre: "Pop", mood: "Romantic" },
            { title: "It Would Be You", artist: "Ben Rector", src: "assets/audio/samples/Cinematic/It_Would_Be_You_Improv.mp3", genre: "Pop", mood: "Uplifting" },
            { title: "River Flows In You", artist: "Yiruma", src: "assets/audio/samples/Cinematic/River_Flows_Improv.mp3", genre: "Classical", mood: "Calm" },
            { title: "A Thousand Miles", artist: "Vanessa Carlton", src: "assets/audio/samples/Cinematic/Thousand_Miles_Improv.mp3", genre: "Pop", mood: "Uplifting" },
            { title: "Gratitude", artist: "Brandon Lake", src: "assets/audio/samples/Cinematic/Gratitude_Improv.mp3", genre: "Worship", mood: "Uplifting" },
            { title: "Star Wars Theme", artist: "John Williams", src: "assets/audio/samples/Cinematic/Star_Wars_Improv.mp3", genre: "Soundtrack", mood: "Dramatic" },

            // Cinematic Placeholders (Total of 36 songs, 18 per page)
            { title: "Band of Gold", artist: "The Gray Havens", isPlaceholder: true, genre: "Folk", mood: "Reflective" },
            { title: "Gold", artist: "The National Parks", isPlaceholder: true, genre: "Folk", mood: "Uplifting" },
            { title: "Sky Full of Song", artist: "Florence + The Machine", isPlaceholder: true, genre: "Pop", mood: "Uplifting" },
            { title: "Northern Wind", artist: "City and Colour", isPlaceholder: true, genre: "Folk", mood: "Calm" },
            { title: "Turning Page", artist: "Sleeping at Last", isPlaceholder: true, genre: "Soundtrack", mood: "Romantic" },
            { title: "Clair de Lune", artist: "Debussy", isPlaceholder: true, genre: "Classical", mood: "Calm" },
            { title: "A Million Dreams", artist: "The Greatest Showman", isPlaceholder: true, genre: "Soundtrack", mood: "Uplifting" },
            { title: "Concerning Hobbits", artist: "Howard Shore", isPlaceholder: true, genre: "Soundtrack", mood: "Calm" },
            { title: "Experience", artist: "Ludovico Einaudi", isPlaceholder: true, genre: "Classical", mood: "Reflective" },
            { title: "Shallow", artist: "Lady Gaga & Bradley Cooper", isPlaceholder: true, genre: "Pop", mood: "Romantic" },
            { title: "Happier", artist: "Olivia Rodrigo", isPlaceholder: true, genre: "Pop", mood: "Reflective" },
            
            // Page 2 Cinematic Placeholders
            { title: "Time", artist: "Hans Zimmer", isPlaceholder: true, genre: "Soundtrack", mood: "Dramatic" },
            { title: "Tenerife Sea", artist: "Ed Sheeran", isPlaceholder: true, genre: "Pop", mood: "Romantic" },
            { title: "Into the Unknown", artist: "Frozen II", isPlaceholder: true, genre: "Soundtrack", mood: "Uplifting" },
            { title: "Oceans (Where Feet May Fail)", artist: "Hillsong UNITED", isPlaceholder: true, genre: "Worship", mood: "Reflective" },
            { title: "Rewrite", artist: "Silent Sanctuary", isPlaceholder: true, genre: "Pop", mood: "Romantic" },
            { title: "Photograph", artist: "Ed Sheeran", isPlaceholder: true, genre: "Pop", mood: "Romantic" },
            { title: "The Swan", artist: "Camille Saint-Saëns", isPlaceholder: true, genre: "Classical", mood: "Calm" },
            { title: "Yellow", artist: "Coldplay", isPlaceholder: true, genre: "Pop", mood: "Uplifting" },
            { title: "For Good", artist: "Wicked Soundtrack", isPlaceholder: true, genre: "Soundtrack", mood: "Uplifting" },
            { title: "Comptine d’un autre été", artist: "Yann Tiersen", isPlaceholder: true, genre: "Classical", mood: "Calm" },
            { title: "Speechless", artist: "Aladdin (2019)", isPlaceholder: true, genre: "Soundtrack", mood: "Celebratory" },
            { title: "The Sound of Silence", artist: "Disturbed (Cover)", isPlaceholder: true, genre: "Rock", mood: "Dramatic" },
            { title: "So Will I (100 Billion X)", artist: "Hillsong UNITED", isPlaceholder: true, genre: "Worship", mood: "Uplifting" },
            { title: "Love Story", artist: "Taylor Swift", isPlaceholder: true, genre: "Country", mood: "Romantic" },
            { title: "Fields of Gold", artist: "Sting / Eva Cassidy", isPlaceholder: true, genre: "Folk", mood: "Romantic" },
            { title: "Requiem for a Dream", artist: "Clint Mansell", isPlaceholder: true, genre: "Soundtrack", mood: "Dramatic" },
            { title: "Fireflies", artist: "Owl City", isPlaceholder: true, genre: "Pop", mood: "Uplifting" },
            { title: "Never Enough", artist: "The Greatest Showman", isPlaceholder: true, genre: "Soundtrack", mood: "Dramatic" }
        ],
        traditional: [
            // Real Traditional Songs (6)
            { title: "Can't Help Falling in Love", artist: "Elvis Presley", src: "assets/audio/samples/Traditional/Cant_Help_Falling_Improv.mp3", genre: "Pop", mood: "Romantic" },
            { title: "Rewrite the Stars", artist: "The Greatest Showman", src: "assets/audio/samples/Traditional/Rewrite_the_Stars_Improv.mp3", genre: "Soundtrack", mood: "Romantic" },
            { title: "A Million Dreams", artist: "The Greatest Showman", src: "assets/audio/samples/Traditional/Million_Dreams_Improv.mp3", genre: "Soundtrack", mood: "Uplifting" },
            { title: "Marry You", artist: "Bruno Mars", src: "assets/audio/samples/Traditional/Marry_You_Improv.mp3", genre: "Pop", mood: "Celebratory" },
            { title: "Goodness of God", artist: "Bethel Music", src: "assets/audio/samples/Traditional/Goodness_of_God_Improv.mp3", genre: "Worship", mood: "Uplifting" },
            { title: "Living Hope", artist: "Phil Wickham", src: "assets/audio/samples/Traditional/Living_Hope_Improv.mp3", genre: "Worship", mood: "Uplifting" },
            
            // Traditional Placeholders (Total of 35 songs, to ensure no Page 3)
            { title: "You Are the Reason", artist: "Calum Scott", isPlaceholder: true, genre: "Pop", mood: "Romantic" },
            { title: "The Prayer", artist: "Andrea Bocelli & Celine Dion", isPlaceholder: true, genre: "Classical", mood: "Romantic" },
            { title: "To Make You Feel My Love", artist: "Bob Dylan / Adele", isPlaceholder: true, genre: "Pop", mood: "Romantic" },
            { title: "Canon in D", artist: "Pachelbel", isPlaceholder: true, genre: "Classical", mood: "Calm" },
            { title: "Marry Me", artist: "Train", isPlaceholder: true, genre: "Pop", mood: "Celebratory" },
            { title: "Come Thou Fount", artist: "Traditional Hymn", isPlaceholder: true, genre: "Worship", mood: "Reflective" },
            { title: "When I Say I Do", artist: "Matthew West", isPlaceholder: true, genre: "Worship", mood: "Romantic" },
            { title: "All of Me", artist: "John Legend", isPlaceholder: true, genre: "Pop", mood: "Romantic" },
            { title: "Hallelujah", artist: "Leonard Cohen", isPlaceholder: true, genre: "Folk", mood: "Reflective" },
            { title: "I Won’t Give Up", artist: "Jason Mraz", isPlaceholder: true, genre: "Pop", mood: "Uplifting" },
            { title: "Great Is Thy Faithfulness", artist: "Traditional Hymn", isPlaceholder: true, genre: "Worship", mood: "Reflective" },
            { title: "When God Made You", artist: "Newsong & Natalie Grant", isPlaceholder: true, genre: "Worship", mood: "Romantic" },
            { title: "Come Away With Me", artist: "Norah Jones", isPlaceholder: true, genre: "Jazz", mood: "Calm" }, 

            // Page 2 Traditional Placeholders
            { title: "Always Remember Us This Way", artist: "Lady Gaga", isPlaceholder: true, genre: "Pop", mood: "Romantic" },
            { title: "Bless the Broken Road", artist: "Rascal Flatts", isPlaceholder: true, genre: "Country", mood: "Romantic" },
            { title: "You Raise Me Up", artist: "Josh Groban", isPlaceholder: true, genre: "Classical", mood: "Uplifting" },
            { title: "Amazed", artist: "Lonestar", isPlaceholder: true, genre: "Country", mood: "Romantic" },
            { title: "Forever Like That", artist: "Ben Rector", isPlaceholder: true, genre: "Pop", mood: "Romantic" },
            { title: "Be Thou My Vision", artist: "Traditional Hymn", isPlaceholder: true, genre: "Worship", mood: "Reflective" },
            { title: "Love Never Fails", artist: "Brandon Heath", isPlaceholder: true, genre: "Worship", mood: "Uplifting" },
            { title: "I Choose You", artist: "Sara Bareilles", isPlaceholder: true, genre: "Pop", mood: "Romantic" },
            { title: "This I Promise You", artist: "*NSYNC", isPlaceholder: true, genre: "Pop", mood: "Romantic" },
            { title: "Because You Loved Me", artist: "Celine Dion", isPlaceholder: true, genre: "Pop", mood: "Romantic" },
            { title: "Heavenly Day", artist: "Patty Griffin", isPlaceholder: true, genre: "Folk", mood: "Calm" },
            { title: "The Luckiest", artist: "Ben Folds", isPlaceholder: true, genre: "Pop", mood: "Romantic" },
            { title: "I Get to Love You", artist: "Ruelle", isPlaceholder: true, genre: "Pop", mood: "Romantic" },
            { title: "Only Hope", artist: "Mandy Moore", isPlaceholder: true, genre: "Pop", mood: "Reflective" },
            { title: "In Christ Alone", artist: "Keith Getty & Stuart Townend", isPlaceholder: true, genre: "Worship", mood: "Reflective" },
            { title: "I See the Light", artist: "Tangled Soundtrack", isPlaceholder: true, genre: "Soundtrack", mood: "Uplifting" },
            { title: "A Thousand Miles", artist: "Vanessa Carlton", isPlaceholder: true, genre: "Pop", mood: "Uplifting" }
        ]
    };

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

    // --- DOM Elements ---
    const libraryType = document.body.dataset.library;
    const songGrid = document.getElementById('song-grid');
    const searchBar = document.getElementById('search-bar');
    const paginationControls = document.getElementById('pagination-controls');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const pageNumberBtnsContainer = paginationControls ? paginationControls.querySelector('.page-numbers') : null;
    const filterToggleButton = document.getElementById('filter-toggle-btn');
    const filterPanel = document.getElementById('filter-panel');
    const filterOverlay = document.getElementById('filter-modal-overlay');
    const genreFilterOptionsGrid = document.getElementById('genre-filter-tags');
    const moodFilterOptionsGrid = document.getElementById('mood-filter-tags');
    const applyFiltersBtn = document.getElementById('apply-filters-btn');
    const clearFiltersBtn = document.getElementById('clear-filters-btn');

    // --- State Variables ---
    const allGenres = ['Pop', 'Classical', 'Country', 'Folk', 'Jazz', 'Soundtrack', 'Worship', 'Rock'];
    const allMoods = ['Calm', 'Celebratory', 'Reflective', 'Romantic', 'Uplifting', 'Dramatic'];
    const songsPerPage = 18;
    let currentPage = 1;
    let totalPages = 1;
    let currentlyPlayingAudio = null;
    let activeGenreFilters = ['all'];
    let activeMoodFilters = ['all'];
    let initialFiltersOnModalOpen = { genres: [], moods: [] };
    let currentFilteredSongs = [];

    // --- Audio Player Functions ---
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function handlePlayPause(e) {
        const card = e.target.closest('.song-card');
        if (!card || card.classList.contains('placeholder-card')) return;
        const audio = card.querySelector('.audio-element');
        if (currentlyPlayingAudio && currentlyPlayingAudio !== audio) {
            currentlyPlayingAudio.pause();
        }
        if (audio.paused) {
            audio.play().catch(err => console.error("Audio play failed:", err));
            currentlyPlayingAudio = audio;
        } else {
            audio.pause();
            currentlyPlayingAudio = null;
        }
    }

    function updateAudioPlayerUI(e) {
        const playingAudio = e ? e.target : null;
        songGrid.querySelectorAll('.song-card:not(.placeholder-card)').forEach(card => {
            const audio = card.querySelector('.audio-element');
            if (audio) {
                const isPlaying = audio === playingAudio && !audio.paused;
                card.classList.toggle('is-playing', isPlaying);
            }
        });
    }
    
    function updateProgress(e) {
        const { duration, currentTime } = e.srcElement;
        const card = e.srcElement.closest('.song-card');
        if (!card || !isFinite(duration)) return;
        card.querySelector('.progress-bar-seek').style.width = `${(currentTime / duration) * 100}%`;
        card.querySelector('.time-container').textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
    }
    
    function setProgress(e) {
        const card = e.target.closest('.song-card');
        if (!card || card.classList.contains('placeholder-card')) return;
        const audio = card.querySelector('.audio-element');
        if (!isFinite(audio.duration)) return;
        const progressBarContainer = card.querySelector('.progress-bar-container');
        const rect = progressBarContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        audio.currentTime = (clickX / progressBarContainer.clientWidth) * audio.duration;
    }

    function attachAudioListeners() {
        songGrid.querySelectorAll('.song-card:not(.placeholder-card)').forEach(card => {
            const audio = card.querySelector('.audio-element');
            const playPauseBtn = card.querySelector('.play-pause-btn');
            const progressBarContainer = card.querySelector('.progress-bar-container');
            
            if (audio) {
                audio.onloadedmetadata = () => card.querySelector('.time-container').textContent = `0:00 / ${formatTime(audio.duration)}`;
                audio.ontimeupdate = updateProgress;
                audio.onplay = updateAudioPlayerUI;
                audio.onpause = updateAudioPlayerUI;
                audio.onended = () => {
                    card.classList.remove('is-playing');
                    audio.currentTime = 0;
                    currentlyPlayingAudio = null;
                };
            }
            if (playPauseBtn) playPauseBtn.onclick = handlePlayPause;
            if (progressBarContainer) progressBarContainer.onclick = setProgress;
        });
    }

    // --- Core Display & Filtering Logic ---
    function renderSongs(songsToRender) {
        songGrid.innerHTML = '';
        const fragment = document.createDocumentFragment();
        songsToRender.forEach(song => {
            const card = document.createElement('div');
            card.className = 'song-card';
            if (song.isPlaceholder) {
                card.classList.add('placeholder-card');
                card.innerHTML = `<span class="placeholder-label">Coming Soon</span><button class="play-pause-btn" aria-label="Audio coming soon" disabled></button><div class="track-info"><div class="title-artist"><div class="track-title">${song.title}</div><div class="track-artist">${song.artist}</div></div><div class="progress-bar-container"><div class="progress-bar-seek"></div></div></div><div class="time-container">--:-- / --:--</div>`;
            } else {
                card.innerHTML = `<button class="play-pause-btn" aria-label="Play ${song.title}"><i class="fas fa-play"></i><i class="fas fa-pause"></i></button><div class="track-info"><div class="title-artist"><div class="track-title">${song.title}</div><div class="track-artist">${song.artist}</div></div><div class="progress-bar-container"><div class="progress-bar-seek"></div></div></div><div class="time-container">0:00 / 0:00</div><audio class="audio-element" src="${song.src}" preload="metadata"></audio>`;
            }
            fragment.appendChild(card);
        });
        songGrid.appendChild(fragment);
        attachAudioListeners();
    }
    
    function displayPage(page) {
        currentPage = page;
        const startIndex = (page - 1) * songsPerPage;
        const endIndex = startIndex + songsPerPage;
        const songsForPage = currentFilteredSongs.slice(startIndex, endIndex);
        renderSongs(songsForPage);
        updatePaginationControls();
    }
    
    function applyFiltersAndSearch() {
        if (currentlyPlayingAudio) currentlyPlayingAudio.pause();
        const searchTerm = searchBar.value.toLowerCase().trim();
        
        currentFilteredSongs = songs[libraryType].filter(song => {
            const matchesSearch = searchTerm === '' || song.title.toLowerCase().includes(searchTerm) || song.artist.toLowerCase().includes(searchTerm);
            const matchesGenre = activeGenreFilters.includes('all') || (song.genre && activeGenreFilters.includes(song.genre.toLowerCase()));
            const matchesMood = activeMoodFilters.includes('all') || (song.mood && activeMoodFilters.includes(song.mood.toLowerCase()));
            return matchesSearch && matchesGenre && matchesMood;
        });
        
        totalPages = Math.ceil(currentFilteredSongs.length / songsPerPage);
        displayPage(1);
    }

    // --- UI Handlers & Controls ---
    function updatePaginationControls() {
        if (!paginationControls) return;
        pageNumberBtnsContainer.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = 'pagination-btn page-number';
            pageBtn.dataset.page = i;
            pageBtn.textContent = i;
            if (i === currentPage) pageBtn.classList.add('active');
            pageNumberBtnsContainer.appendChild(pageBtn);
        }
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
        paginationControls.style.display = totalPages <= 1 ? 'none' : 'flex';
    }

    function renderFilterOptions() {
        const populate = (container, options, name) => {
            container.innerHTML = `<div class="filter-option-checkbox"><input type="checkbox" id="${name}-all" name="${name}" value="all" checked><label for="${name}-all">All ${name.charAt(0).toUpperCase() + name.slice(1)}s</label></div>`;
            options.forEach(option => {
                const optionId = `${name}-${option.toLowerCase().replace(/\s+/g, '-')}`;
                container.innerHTML += `<div class="filter-option-checkbox"><input type="checkbox" id="${optionId}" name="${name}" value="${option.toLowerCase()}"><label for="${optionId}">${option}</label></div>`;
            });
        };
        populate(genreFilterOptionsGrid, allGenres, 'genre');
        populate(moodFilterOptionsGrid, allMoods, 'mood');
    }
    
    function toggleFilterModal(show) {
        if (show) {
            initialFiltersOnModalOpen = {
                genres: [...activeGenreFilters].sort(),
                moods: [...activeMoodFilters].sort()
            };
            applyFiltersBtn.textContent = 'Close';
        }
        filterOverlay.classList.toggle('active', show);
        filterPanel.classList.toggle('active', show);
        document.body.classList.toggle('filter-modal-open', show);
    }
    
    function handleCheckboxChange(e) {
        const target = e.target;
        if (!target.matches('input[type="checkbox"]')) return;
        const container = target.closest('.filter-options-grid');
        const allCheckbox = container.querySelector('input[value="all"]');
        const otherCheckboxes = Array.from(container.querySelectorAll('input:not([value="all"])'));
        if (target.value === 'all' && target.checked) {
            otherCheckboxes.forEach(cb => cb.checked = false);
        } else if (target.value !== 'all' && target.checked) {
            allCheckbox.checked = false;
        }
        if (!otherCheckboxes.some(cb => cb.checked)) {
            allCheckbox.checked = true;
        }
        updateApplyButtonText();
    }

    function updateApplyButtonText() {
        const currentGenres = Array.from(genreFilterOptionsGrid.querySelectorAll('input:checked')).map(cb => cb.value).sort();
        const currentMoods = Array.from(moodFilterOptionsGrid.querySelectorAll('input:checked')).map(cb => cb.value).sort();
        const genresChanged = JSON.stringify(currentGenres) !== JSON.stringify(initialFiltersOnModalOpen.genres);
        const moodsChanged = JSON.stringify(currentMoods) !== JSON.stringify(initialFiltersOnModalOpen.moods);
        applyFiltersBtn.textContent = (genresChanged || moodsChanged) ? 'Apply Filters' : 'Close';
    }

    function handlePaginationClick(e) {
        const target = e.target.closest('button');
        if (!target) return;
        if (target.id === 'prev-page' && currentPage > 1) {
            displayPage(currentPage - 1);
        } else if (target.id === 'next-page' && currentPage < totalPages) {
            displayPage(currentPage + 1);
        } else if (target.classList.contains('page-number')) {
            const page = parseInt(target.dataset.page);
            if (page !== currentPage) displayPage(page);
        }
    }

    // --- Main Execution ---
    if (libraryType && songs[libraryType]) {
        renderFilterOptions();
        applyFiltersAndSearch(); // Initial render
        
        // Attach all non-dynamic listeners once
        filterToggleButton.addEventListener('click', () => toggleFilterModal(true));
        filterOverlay.addEventListener('click', () => toggleFilterModal(false));
        searchBar.addEventListener('input', debounce(applyFiltersAndSearch, 300));
        paginationControls.addEventListener('click', handlePaginationClick);
        [genreFilterOptionsGrid, moodFilterOptionsGrid].forEach(grid => grid.addEventListener('change', handleCheckboxChange));

        applyFiltersBtn.addEventListener('click', () => {
            if (applyFiltersBtn.textContent === 'Apply Filters') {
                activeGenreFilters = Array.from(genreFilterOptionsGrid.querySelectorAll('input:checked')).map(cb => cb.value);
                activeMoodFilters = Array.from(moodFilterOptionsGrid.querySelectorAll('input:checked')).map(cb => cb.value);
                applyFiltersAndSearch();
            }
            toggleFilterModal(false);
        });

        clearFiltersBtn.addEventListener('click', () => {
            genreFilterOptionsGrid.querySelectorAll('input').forEach(cb => cb.checked = cb.value === 'all');
            moodFilterOptionsGrid.querySelectorAll('input').forEach(cb => cb.checked = cb.value === 'all');
            updateApplyButtonText();
        });
    }
});