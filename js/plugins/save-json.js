// js/plugins/save-json.js – حفظ نسخة احتياطية JSON
(function () {
  function init() {
    var headerButtons = document.getElementById('headerButtons');
    if (!headerButtons) return;

    var btn = document.createElement('button');
    btn.className = 'btn-icon';
    btn.id = 'btnSaveJSON';
    btn.title = 'حفظ نسخة JSON';
    btn.textContent = '💾';
    headerButtons.insertBefore(btn, document.getElementById('toggleManager'));

    btn.addEventListener('click', function () {
      try {
        // نجمع البيانات من كل المكونات
        var shura = window._shuraData;
        if (!shura) {
          // إن لم تكن محفوظة في window نجرب localStorage
          var saved = localStorage.getItem('shuraCouncilData');
          shura = saved ? JSON.parse(saved) : {};
        }

        var backup = {
          familyTreeData: TreeCore.getRootData(),
          shuraData: shura,
          passwords: TreeManager.getPasswords(),
          exportDate: new Date().toISOString(),
          version: '1.0'
        };

        var jsonStr = JSON.stringify(backup, null, 2);
        var blob = new Blob([jsonStr], { type: 'application/json' });
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'شجرة_الدرواشة_نسخة_احتياطية.json';
        a.click();

        setTimeout(function () {
          window.URL.revokeObjectURL(url);
        }, 200);

        alert('✅ تم حفظ النسخة الاحتياطية');
      } catch (e) {
        alert('❌ فشل في حفظ النسخة');
      }
    });

    console.log('✅ زر حفظ JSON جاهز');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();