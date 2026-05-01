// js/plugins/reset.js – إعادة تعيين كامل
(function () {
  function init() {
    var headerButtons = document.getElementById('headerButtons');
    if (!headerButtons) return;

    var btn = document.createElement('button');
    btn.className = 'btn-icon';
    btn.id = 'btnReset';
    btn.title = 'إعادة تعيين';
    btn.textContent = '🔄';

    // يظهر الزر فقط في وضع المدير
    if (document.body.classList.contains('show-manager')) {
      btn.style.display = 'inline-flex';
    } else {
      btn.style.display = 'none';
    }

    headerButtons.insertBefore(btn, document.getElementById('toggleManager'));

    btn.addEventListener('click', function () {
      if (!TreeManager || !TreeManager.isManager()) return;

      if (confirm('⚠️ تحذير: سيتم مسح جميع البيانات والعودة إلى الوضع الافتراضي.\n\nهل أنت متأكد تماماً؟')) {
        // مسح كل البيانات المخزنة
        localStorage.removeItem('familyTreeData');
        localStorage.removeItem('idCounters');
        localStorage.removeItem('shuraCouncilData');
        localStorage.removeItem('treePasswords');

        alert('✅ تمت إعادة التعيين بنجاح. سيتم تحديث الصفحة.');
        location.reload();
      }
    });

    // مراقب التغييرات على وضع المدير
    var observer = new MutationObserver(function () {
      if (document.body.classList.contains('show-manager')) {
        btn.style.display = 'inline-flex';
      } else {
        btn.style.display = 'none';
      }
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    console.log('✅ إعادة تعيين جاهز');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();