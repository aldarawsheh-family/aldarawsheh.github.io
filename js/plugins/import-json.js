// js/plugins/import-json.js – استيراد نسخة احتياطية
(function() {
  function init() {
    var headerButtons = document.getElementById('headerButtons');
    if (!headerButtons) return;

    var btn = document.createElement('button');
    btn.className = 'btn-icon';
    btn.id = 'btnImportJSON';
    btn.title = 'استيراد نسخة JSON';
    btn.textContent = '📂';
    headerButtons.insertBefore(btn, document.getElementById('toggleManager'));

    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'importFileInput';
    fileInput.accept = '.json,application/json';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    btn.addEventListener('click', function() {
      fileInput.click();
    });

    fileInput.addEventListener('change', function(e) {
      var file = e.target.files[0];
      if (!file) return;

      var reader = new FileReader();
      reader.onload = function(event) {
        try {
          var data = JSON.parse(event.target.result);
          
          if (!data.familyTreeData) {
            throw new Error('بيانات غير صالحة');
          }

          if (confirm('سيتم استبدال جميع البيانات الحالية بالنسخة المستوردة. هل أنت متأكد؟')) {
            localStorage.setItem('familyTreeData', JSON.stringify(data.familyTreeData));
            
            if (data.passwords) {
              localStorage.setItem('treePasswords', JSON.stringify(data.passwords));
            }
            
            if (data.shuraData) {
              localStorage.setItem('shuraCouncilData', JSON.stringify(data.shuraData));
              window._shuraData = data.shuraData;
            }

            alert('✅ تم استيراد النسخة بنجاح. سيتم إعادة تحميل الصفحة.');
            location.reload();
          }
        } catch (error) {
          alert('❌ فشل قراءة الملف. تأكد من أنه ملف JSON صحيح.');
        }
      };
      reader.readAsText(file);
      fileInput.value = '';
    });

    console.log('✅ استيراد JSON جاهز');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();