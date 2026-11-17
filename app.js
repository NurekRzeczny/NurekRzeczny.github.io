// Obsługa przełączania gwiazdki ulubionych
function toggleFavorite(event, btn) {
    event.stopPropagation(); // Zapobiega kliknięciu w cały kafelek
    btn.classList.toggle('active');
}

// Prosta wyszukiwarka map
const searchInput = document.getElementById('searchInput');
const mapsGrid = document.getElementById('mapsGrid');
const cards = mapsGrid.getElementsByClassName('map-card');

searchInput.addEventListener('input', function(e) {
    const term = e.target.value.toLowerCase();
    Array.from(cards).forEach(card => {
        const name = card.getAttribute('data-name');
        if (name.includes(term)) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    });
});
