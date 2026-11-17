// LocalStorage favorites state
let favorites = JSON.parse(localStorage.getItem('game_favorites')) || [];

// Sort cards automatically: favorites pinned to the top
function sortMaps() {
    const grid = document.getElementById('mapsGrid');
    const cards = Array.from(grid.querySelectorAll('.map-card'));

    cards.sort((a, b) => {
        const aFav = favorites.includes(a.getAttribute('data-id'));
        const bFav = favorites.includes(b.getAttribute('data-id'));

        if (aFav !== bFav) {
            return aFav ? -1 : 1;
        }
        return Number(a.getAttribute('data-order')) - Number(b.getAttribute('data-order'));
    });

    cards.forEach(card => grid.appendChild(card));
}

// Initialize stars and layout order on load
window.addEventListener('DOMContentLoaded', () => {
    favorites.forEach(mapId => {
        const icon = document.getElementById(`fav-icon-${mapId}`);
        if (icon) {
            icon.classList.remove('fa-regular');
            icon.classList.add('fa-solid', 'text-amber-400');
        }
    });
    sortMaps();
});

// Search filter logic
function filterMaps() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    const cards = document.querySelectorAll('.map-card');
    let visibleCount = 0;

    cards.forEach(card => {
        const mapName = card.getAttribute('data-name').toLowerCase();

        if (mapName.includes(query)) {
            card.style.display = 'flex';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    const noResultsEl = document.getElementById('noResults');
    if (visibleCount === 0) {
        noResultsEl.classList.remove('hidden');
        noResultsEl.classList.add('flex');
    } else {
        noResultsEl.classList.remove('flex');
        noResultsEl.classList.add('hidden');
    }
}

// Toggle favorite status
function toggleFavorite(event, mapId) {
    event.stopPropagation(); // Prevents triggering card click
    const icon = document.getElementById(`fav-icon-${mapId}`);
    
    const index = favorites.indexOf(mapId);
    if (index > -1) {
        favorites.splice(index, 1);
        icon.classList.remove('fa-solid', 'text-amber-400');
        icon.classList.add('fa-regular');
        showToast("Removed from favorites", "fa-star text-slate-400");
    } else {
        favorites.push(mapId);
        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid', 'text-amber-400');
        showToast("Pinned to top", "fa-star text-amber-400");
    }

    localStorage.setItem('game_favorites', JSON.stringify(favorites));
    sortMaps();
}

// Launch map handler
function launchMap(mapId) {
    const card = document.querySelector(`.map-card[data-id="${mapId}"]`);
    const mapTitle = card ? card.querySelector('h3').textContent : mapId;
    showToast(`Loading ${mapTitle}...`, "fa-gamepad text-indigo-400");
    setTimeout(() => {
        // Future game redirection, e.g.:
        // window.location.href = `play.html?map=${mapId}&edition=original`;
    }, 800);
}

// Settings button handler
function openSettings() {
    showToast("Settings panel under construction", "fa-gear text-indigo-400");
}

// Toast notification helper
function showToast(message, iconClass = "fa-circle-check text-indigo-400") {
    const toast = document.getElementById('toast');
    const msgEl = document.getElementById('toastMessage');
    const iconEl = document.getElementById('toastIcon');

    msgEl.textContent = message;
    iconEl.className = `fa-solid ${iconClass} text-lg`;

    toast.classList.remove('translate-y-24', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-24', 'opacity-0');
    }, 3000);
}
