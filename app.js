// Stan ulubionych map zapisywany w localStorage
let favorites = JSON.parse(localStorage.getItem('game_favorites')) || [];
let showFavoritesOnly = false;

// Inicjalizacja stanu gwiazdek przy ładowaniu strony
window.addEventListener('DOMContentLoaded', () => {
    favorites.forEach(mapId => {
        const icon = document.getElementById(`fav-icon-${mapId}`);
        if (icon) {
            icon.classList.remove('fa-regular');
            icon.classList.add('fa-solid', 'text-amber-400');
        }
    });
});

// Funkcja filtrowania map przez duży pasek wyszukiwania
function filterMaps() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    const cards = document.querySelectorAll('.map-card');
    let visibleCount = 0;

    cards.forEach(card => {
        const mapName = card.getAttribute('data-name').toLowerCase();
        const mapId = card.getAttribute('data-id');
        const isFav = favorites.includes(mapId);

        const matchesQuery = mapName.includes(query);
        const matchesFavFilter = !showFavoritesOnly || isFav;

        if (matchesQuery && matchesFavFilter) {
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

// Obsługa kliknięcia w gwiazdkę ulubionych
function toggleFavorite(event, mapId) {
    event.stopPropagation(); // Zapobiega uruchomieniu otwarcia mapy przy kliknięciu w gwiazdkę
    const icon = document.getElementById(`fav-icon-${mapId}`);
    
    const index = favorites.indexOf(mapId);
    if (index > -1) {
        favorites.splice(index, 1);
        icon.classList.remove('fa-solid', 'text-amber-400');
        icon.classList.add('fa-regular');
        showToast("Usunięto z ulubionych", "fa-star text-slate-400");
    } else {
        favorites.push(mapId);
        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid', 'text-amber-400');
        showToast("Dodano do ulubionych", "fa-star text-amber-400");
    }

    localStorage.setItem('game_favorites', JSON.stringify(favorites));
    if (showFavoritesOnly) filterMaps();
}

// Przełącznik widoku samych ulubionych
function toggleFavoritesFilter() {
    showFavoritesOnly = !showFavoritesOnly;
    const btn = document.getElementById('favFilterBtn');
    if (showFavoritesOnly) {
        btn.classList.add('bg-indigo-600', 'border-indigo-500', 'text-white');
        btn.classList.remove('bg-slate-800', 'border-slate-700', 'text-slate-300');
    } else {
        btn.classList.remove('bg-indigo-600', 'border-indigo-500', 'text-white');
        btn.classList.add('bg-slate-800', 'border-slate-700', 'text-slate-300');
    }
    filterMaps();
}

// Uruchomienie wybranej mapy (przejście do gry z parametrem)
function launchMap(mapId) {
    showToast(`Ładowanie ${mapId === 'map-1' ? 'Mapy 1' : 'Mapy 2'}...`, "fa-gamepad text-indigo-400");
    setTimeout(() => {
        // Tutaj w przyszłości podepniesz przekierowanie np. do play.html?map=map-1
        // window.location.href = `play.html?map=${mapId}&edition=original`;
    }, 800);
}

// Otwarcie ustawień (ikona zębatki)
function openSettings() {
    showToast("Panel ustawień w budowie", "fa-gear text-indigo-400");
}

// Nowoczesne powiadomienie (zastąpienie natywnego alertu)
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
