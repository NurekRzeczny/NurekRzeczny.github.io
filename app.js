let favorites = JSON.parse(localStorage.getItem('game_favorites')) || [];

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

function toggleFavorite(event, mapId) {
    event.stopPropagation();
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

// System automatycznego sprawdzania aktualizacji przed startem gry
async function checkAndUpdateGame(mapId, targetUrl) {
    const folderPath = targetUrl.substring(0, targetUrl.lastIndexOf('/'));
    const versionFileUrl = `${folderPath}/version.json?t=${Date.now()}`;
    const localVersionKey = `game_ver_${mapId}`;
    const savedVersion = localStorage.getItem(localVersionKey) || "0.0.0";

    try {
        const response = await fetch(versionFileUrl);
        if (response.ok) {
            const data = await response.json();
            if (data.version && data.version !== savedVersion) {
                console.log(`New version detected for ${mapId}: ${data.version} (Local: ${savedVersion})`);
                localStorage.setItem(localVersionKey, data.version);
                
                // Czyszczenie pamięci podręcznej przeglądarki (Cache API) jeśli jest wspierana
                if ('caches' in window) {
                    const keys = await caches.keys();
                    for (const key of keys) {
                        if (key.includes(mapId)) await caches.delete(key);
                    }
                }
            }
        }
    } catch (e) {
        console.log("Skipping online version check (offline or file missing).");
    }
}

// Główna funkcja uruchamiająca mapę z loaderem i auto-update
async function launchMap(mapId, targetUrl) {
    const card = document.querySelector(`.map-card[data-id="${mapId}"]`);
    const mapTitle = card ? card.querySelector('h3').textContent : mapId;

    const loader = document.getElementById('gameLoader');
    const loaderText = document.getElementById('loaderText');
    loaderText.textContent = `Checking updates for ${mapTitle}...`;
    
    loader.classList.remove('opacity-0', 'pointer-events-none');
    loader.classList.add('opacity-100');

    // Sprawdzenie aktualizacji w tle
    await checkAndUpdateGame(mapId, targetUrl);

    loaderText.textContent = `Loading ${mapTitle}...`;

    // Przejście do gry po krótkiej chwili
    setTimeout(() => {
        window.location.href = targetUrl;
    }, 500);
}

function openSettings() {
    showToast("Settings panel under construction", "fa-gear text-indigo-400");
}

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
