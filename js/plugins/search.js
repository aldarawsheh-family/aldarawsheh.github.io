// js/plugins/search.js – البحث عن فرد
(function () {
  function init() {
    var body = document.body;
    var searchBox = document.createElement('div');
    searchBox.className = 'search-box';
    searchBox.innerHTML =
      '<input type="text" id="searchInput" placeholder="ابحث عن فرد...">' +
      '<button id="searchBtn">🔍</button>';
    body.appendChild(searchBox);

    document.getElementById('searchBtn').addEventListener('click', function () {
      var query = document.getElementById('searchInput').value.trim();
      if (!query) return;

      var allCards = document.querySelectorAll('.card .name');
      var found = false;

      allCards.forEach(function (card) {
        if (card.textContent.indexOf(query) !== -1) {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          card.style.background = '#ffeb3b';
          setTimeout(function () {
            card.style.background = '';
          }, 2000);
          found = true;
        }
      });

      if (!found) {
        alert('❌ لم يتم العثور على ' + query);
      }
    });

    console.log('✅ البحث عن فرد جاهز');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();