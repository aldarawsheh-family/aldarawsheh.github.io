// js/plugins/mini-map.js - خريطة مصغرة للشجرة
(function() {
  function init() {
    var container = document.getElementById('treeContainer');
    var miniMap = document.getElementById('miniMap');
    if (!container || !miniMap) return;

    // زر التبديل في الهيدر
    var headerButtons = document.getElementById('headerButtons');
    if (headerButtons) {
      var btn = document.createElement('button');
      btn.className = 'btn-icon';
      btn.id = 'btnMiniMap';
      btn.title = 'خريطة مصغرة';
      btn.textContent = '🗺️';
      headerButtons.insertBefore(btn, document.getElementById('toggleManager'));

      btn.addEventListener('click', function() {
        if (miniMap.style.display === 'none') {
          miniMap.style.display = 'block';
          updateMiniMap();
        } else {
          miniMap.style.display = 'none';
        }
      });
    }

    function updateMiniMap() {
      var tree = document.getElementById('familyTree');
      if (!tree) return;
      var clone = tree.cloneNode(true);
      clone.style.transform = 'scale(0.15)';
      clone.style.transformOrigin = '0 0';
      clone.style.width = (tree.offsetWidth * 0.15) + 'px';
      clone.style.height = (tree.offsetHeight * 0.15) + 'px';
      miniMap.innerHTML = '';
      miniMap.appendChild(clone);
    }

    // تحديث كل ثانية
    setInterval(updateMiniMap, 1000);
    console.log('✅ الخريطة المصغرة جاهزة');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();