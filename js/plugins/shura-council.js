// js/plugins/shura-council.js - مجلس شورى فخذ الدرواشة
(function () {
  // البيانات الافتراضية للمجلس
  var defaultShuraData = {
    positions: [
      { title: "رئيس مجلس الشورى", name: "" },
      { title: "نائب الرئيس", name: "" },
      { title: "منسق العلاقات العامة الخارجية", name: "" },
      { title: "منسق العلاقات العامة الداخلية", name: "" },
      { title: "أمين صندوق", name: "" },
      { title: "قاضي", name: "" },
      { title: "أمين سر", name: "" },
      { title: "مسؤول الحرب", name: "" },
      { title: "مسؤول السلم", name: "" }
    ],
    listeners: [],
    decisions: []
  };

  // تحميل البيانات من localStorage أو استخدام الافتراضية
  var shuraData = JSON.parse(localStorage.getItem('shuraCouncilData')) || defaultShuraData;

  function saveShuraData() {
    localStorage.setItem('shuraCouncilData', JSON.stringify(shuraData));
  }

  // ---- دوال العرض ----

  function renderPositions() {
    var container = document.getElementById('positionsContainer');
    if (!container) return;
    container.innerHTML = shuraData.positions.map(function (pos, i) {
      return '<div class="member-row">' +
        '<span><strong>' + pos.title + '</strong>: ' + (pos.name || '---') + '</span>' +
        '<button class="btn-save" onclick="window._shuraEditPosition(' + i + ')" style="padding:2px 10px;">✏️</button>' +
        '</div>';
    }).join('');
  }

  function renderListeners() {
    var container = document.getElementById('listenersContainer');
    if (!container) return;
    container.innerHTML = shuraData.listeners.map(function (name, i) {
      return '<div class="member-row">' +
        '<span>👤 ' + name + '</span>' +
        '<button class="btn-cancel" onclick="window._shuraRemoveListener(' + i + ')" style="padding:2px 10px;">🗑️</button>' +
        '</div>';
    }).join('');
  }

  function renderDecisions() {
    var container = document.getElementById('decisionsContainer');
    if (!container) return;
    container.innerHTML = shuraData.decisions.map(function (dec, i) {
      var isBinding = (dec.branch === 'خليف' || dec.branch === 'عام') && (dec.yesVotes / dec.totalVoters >= 2/3);
      var badge = isBinding ? '<span class="binding-badge">✅ ملزم</span>' : '';
      return '<div class="decision-item">' +
        '<div><strong>📌 ' + dec.text + '</strong></div>' +
        '<div>📅 ' + dec.date + ' | الفخذ: ' + dec.branch + '</div>' +
        '<div>🗳️ الموافقة: ' + dec.yesVotes + '/' + dec.totalVoters + ' ' + badge + '</div>' +
        '<button class="btn-cancel" onclick="window._shuraDeleteDecision(' + i + ')" style="margin-top:5px;">🗑️</button>' +
        '</div>';
    }).join('');
    // عرض زر التصويت فقط للمدير
    if (TreeManager && TreeManager.isManager()) {
      container.innerHTML += '<hr><button class="btn-save" id="openVoteBtn">🗳️ إدارة التصويت</button>';
      setTimeout(function () {
        var voteBtn = document.getElementById('openVoteBtn');
        if (voteBtn) {
          voteBtn.addEventListener('click', function () {
            alert('التصويت يتم عبر إضافة قرار وتحديد عدد المصوتين والموافقين.\nيمكن لأعضاء المجلس استخدام رابط التصويت الموجود في القرار.');
          });
        }
      }, 100);
    }
  }

  // ---- دوال التعديل (للمدير فقط) ----
  window._shuraEditPosition = function (index) {
    if (!TreeManager || !TreeManager.isManager()) return;
    var newName = prompt('أدخل اسم شاغل المنصب:', shuraData.positions[index].name);
    if (newName !== null) {
      shuraData.positions[index].name = newName.trim();
      saveShuraData();
      renderPositions();
    }
  };

  window._shuraRemoveListener = function (index) {
    if (!TreeManager || !TreeManager.isManager()) return;
    if (confirm('حذف هذا المستمع؟')) {
      shuraData.listeners.splice(index, 1);
      saveShuraData();
      renderListeners();
    }
  };

  window._shuraDeleteDecision = function (index) {
    if (!TreeManager || !TreeManager.isManager()) return;
    if (confirm('حذف هذا القرار؟')) {
      shuraData.decisions.splice(index, 1);
      saveShuraData();
      renderDecisions();
    }
  };

  // ---- تهيئة الأزرار ----
  function init() {
    // زر مجلس الشورى في الهيدر
    var headerButtons = document.getElementById('headerButtons');
    if (headerButtons) {
      var btn = document.createElement('button');
      btn.className = 'btn-icon';
      btn.id = 'btnShura';
      btn.title = 'مجلس الشورى';
      btn.textContent = '🏛️';
      headerButtons.insertBefore(btn, document.getElementById('toggleManager'));

      btn.addEventListener('click', function () {
        renderPositions();
        renderListeners();
        renderDecisions();
        document.getElementById('shuraModal').classList.add('active');
      });
    }

    // إضافة منصب
    document.getElementById('addPositionBtn').addEventListener('click', function () {
      if (!TreeManager || !TreeManager.isManager()) return;
      var title = prompt('اسم المنصب الجديد:');
      if (title) {
        shuraData.positions.push({ title: title, name: '' });
        saveShuraData();
        renderPositions();
      }
    });

    // إضافة مستمع
    document.getElementById('addListenerBtn').addEventListener('click', function () {
      if (!TreeManager || !TreeManager.isManager()) return;
      if (shuraData.listeners.length >= 3) {
        alert('الحد الأقصى 3 أعضاء مستمعين');
        return;
      }
      var name = prompt('اسم المستمع:');
      if (name) {
        shuraData.listeners.push(name.trim());
        saveShuraData();
        renderListeners();
      }
    });

    // إضافة قرار
    document.getElementById('addDecisionBtn').addEventListener('click', function () {
      if (!TreeManager || !TreeManager.isManager()) return;
      document.getElementById('decisionModal').classList.add('active');
    });

    document.getElementById('saveDecisionBtn').addEventListener('click', function () {
      var text = document.getElementById('decisionText').value.trim();
      if (!text) { alert('أدخل نص القرار'); return; }
      var branch = document.getElementById('decisionBranch').value;
      var total = parseInt(document.getElementById('totalVoters').value);
      var yes = parseInt(document.getElementById('yesVotes').value);
      if (yes > total) { alert('عدد الموافقين لا يمكن أن يكون أكبر من الإجمالي'); return; }

      var decision = {
        text: text,
        date: new Date().toLocaleDateString('ar-SA'),
        branch: branch,
        totalVoters: total,
        yesVotes: yes
      };

      shuraData.decisions.push(decision);
      saveShuraData();
      renderDecisions();
      document.getElementById('decisionModal').classList.remove('active');
      document.getElementById('decisionText').value = '';
    });

    console.log('✅ مجلس الشورى جاهز');
  }

  // ---- التصدير للكائن العام ----
  window._shuraData = shuraData;

  // ---- بدء التشغيل ----
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();