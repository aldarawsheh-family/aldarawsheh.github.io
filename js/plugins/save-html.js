// js/plugins/save-html.js - حفظ الصفحة كملف HTML مستقل
(function() {
  function init() {
    // إنشاء زر الحفظ وإضافته للهيدر
    var headerButtons = document.getElementById('headerButtons');
    if (!headerButtons) return;

    var btn = document.createElement('button');
    btn.className = 'btn-icon';
    btn.id = 'btnSaveHTML';
    btn.title = 'حفظ الصفحة كملف HTML';
    btn.textContent = '📄';
    headerButtons.insertBefore(btn, document.getElementById('toggleManager'));

    // حدث الضغط
    btn.addEventListener('click', function() {
      try {
        // نحصل على البيانات الحالية
        var currentData = TreeCore.getRootData();
        var dataScript = '<script>var LOCAL_DATA = ' + JSON.stringify(currentData, null, 2) + ';<\/script>';

        // نأخذ HTML الصفحة الحالية ونضيف البيانات قبل </head>
        var html = document.documentElement.outerHTML;
        html = html.replace('</head>', dataScript + '\n</head>');

        // تحويل إلى ملف وتنزيله
        var blob = new Blob([html], { type: 'text/html' });
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'شجرة_الدرواشة.html';
        a.click();

        setTimeout(function() {
          window.URL.revokeObjectURL(url);
        }, 200);
        alert('✅ تم حفظ الصفحة بنجاح');
      } catch (e) {
        alert('❌ فشل في حفظ الملف');
      }
    });

    console.log('✅ زر حفظ HTML جاهز');
  }

  // تشغيل التهيئة بعد تحميل الصفحة
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();