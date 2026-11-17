document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('map-search-input');
  const mapCards = Array.from(document.querySelectorAll('.map-card'));
  const emptyState = document.getElementById('empty-state');
  const favFilterBtn = document.getElementById('fav-filter-btn');
  const settingsBtn = document.getElementById('settings-btn');
  const settingsModal = document.getElementById('settings-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');

  // Wczytanie ulubionych z localStorage
  let favorites = JSON.parse(localStorage.getItem('sbs_favorites') || '[]');
  let showOnlyFavorites = false;

  function updateStarIcons() {
    document.querySelectorAll('.star-btn').forEach(btn => {
      const mapId = btn.dataset.fav;
      btn.classList.toggle('is-favorite', favorites.includes(mapId));
    });
  }

  function filterMaps() {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    mapCards.forEach(card => {
      const name = card.dataset.name.toLowerCase();
      const id = card.dataset.id;
      const matchesSearch = name.includes(query);
      const matchesFav = !showOnlyFavorites || favorites.includes(id);

      if (matchesSearch && matchesFav) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
  }

  // Obsługa wyszukiwarki
  searchInput.addEventListener('input', filterMaps);

  // Przełącznik "Ulubione"
  favFilterBtn.addEventListener('click', () => {
    showOnlyFavorites = !showOnlyFavorites;
    favFilterBtn.classList.toggle('active', showOnlyFavorites);
    filterMaps();
  });

  // Kliknięcie gwiazdki na kafelku
  document.querySelectorAll('.star-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // Nie otwieraj mapy przy klikaniu gwiazdki
      const mapId = btn.dataset.fav;

      if (favorites.includes(mapId)) {
        favorites = favorites.filter(item => item !== mapId);
      } else {
        favorites.push(mapId);
      }

      localStorage.setItem('sbs_favorites', JSON.stringify(favorites));
      updateStarIcons();
      filterMaps();
    });
  });

  // Kliknięcie w kafelek mapy (przejście do gry z parametrem URL)
  mapCards.forEach(card => {
    card.addEventListener('click', () => {
      const mapId = card.dataset.id;
      // W przyszłości przekieruje do odtwarzacza Unity, np.:
      // window.location.href = `games/subway-surfers/index.html?map=${encodeURIComponent(mapId)}`;
      console.log(`Wybrano mapę: ${mapId}`);
      alert(`Uruchamianie: ${card.dataset.name} (parametr: ?map=${mapId})`);
    });
  });

  // Obsługa okna ustawień (zębatka)
  settingsBtn.addEventListener('click', () => {
    settingsModal.style.display = 'flex';
  });

  closeModalBtn.addEventListener('click', () => {
    settingsModal.style.display = 'none';
  });

  settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
      settingsModal.style.display = 'none';
    }
  });

  // Inicjalizacja stanu początkowego
  updateStarIcons();
});
