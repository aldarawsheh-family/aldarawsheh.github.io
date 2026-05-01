// js/manager.js - نظام المدير والصلاحيات
var TreeManager = (function() {
  var currentUser = null;
  var managerMode = false;

  // كلمات السر (مخزنة في localStorage أو افتراضية)
  var passwords = JSON.parse(localStorage.getItem('treePasswords')) || {
    manager: '1234',
    guest: 'زائر',
    branches: {
      خليف: 'خليفات',
      علوش: 'علوش',
      محيميد: 'محيميد',
      حميدو: 'حميدو'
    }
  };

  function savePasswords() {
    localStorage.setItem('treePasswords', JSON.stringify(passwords));
  }

  function login(password) {
    if (password === passwords.manager) {
      currentUser = { type: 'manager', name: 'المدير', branch: 'عام' };
      applyMode();
      return true;
    } else if (password === passwords.guest) {
      currentUser = { type: 'guest', name: 'زائر', branch: 'عام' };
      applyMode();
      return true;
    } else {
      for (var branch in passwords.branches) {
        if (password === passwords.branches[branch]) {
          currentUser = { type: 'branch', name: branch, branch: branch };
          applyMode();
          return true;
        }
      }
    }
    return false;
  }

  function applyMode() {
    if (currentUser.type === 'manager') {
      managerMode = true;
      document.body.classList.add('show-manager');
      document.getElementById('toggleManager').textContent = '🔓';
      document.getElementById('toggleManager').classList.add('active-manager');
    } else {
      managerMode = false;
      document.body.classList.remove('show-manager');
      document.getElementById('toggleManager').textContent = '🔐';
      document.getElementById('toggleManager').classList.remove('active-manager');
    }
    showWelcome();
  }

  function showWelcome() {
    var welcomeDiv = document.getElementById('welcomeOverlay');
    var welcomeMsg = document.getElementById('welcomeMessage');
    if (!welcomeDiv || !welcomeMsg) return;

    if (currentUser.type === 'manager') {
      welcomeMsg.innerHTML = '<div class="welcome-icon">👑</div><h2>موثق نسب أبناء درويش</h2><div class="welcome-text">حامل أمانة نسب الدراوشة<br><strong>من عشيرة العليان - بني خالد</strong></div>';
    } else if (currentUser.type === 'branch') {
      welcomeMsg.innerHTML = '<div class="welcome-icon">🌴</div><h2>أهلاً بك في فخذ ' + currentUser.branch + '</h2><div class="welcome-text">مرحباً بك يا ابن ' + currentUser.branch + '<br>حفظ الله نسبكم وبارك ذريتكم</div>';
    } else if (currentUser.type === 'guest') {
      welcomeMsg.innerHTML = '<div class="welcome-icon">🌴</div><h2>مرحباً بكم في شجرة الدرواشة</h2><div class="welcome-text">مؤسس هذه الشجرة<br><strong>درويش العلياني</strong></div>';
    }
    welcomeDiv.classList.add('active');
  }

  function logout() {
    currentUser = null;
    managerMode = false;
    document.body.classList.remove('show-manager');
    document.getElementById('toggleManager').textContent = '🔐';
    document.getElementById('toggleManager').classList.remove('active-manager');
    document.getElementById('welcomeOverlay').classList.remove('active');
  }

  function changePassword(type, newPass) {
    if (type === 'manager') passwords.manager = newPass;
    else if (type === 'guest') passwords.guest = newPass;
    else passwords.branches[type] = newPass;
    savePasswords();
  }

  function init() {
    document.getElementById('toggleManager').addEventListener('click', function() {
      if (currentUser) { logout(); }
      else { document.getElementById('loginModal').classList.add('active'); }
    });

    document.getElementById('confirmLogin').addEventListener('click', function() {
      var pass = document.getElementById('loginPassword').value;
      if (login(pass)) { document.getElementById('loginModal').classList.remove('active'); }
      else { alert('❌ كلمة مرور خاطئة'); }
    });

    document.getElementById('cancelLogin').addEventListener('click', function() {
      document.getElementById('loginModal').classList.remove('active');
    });

    document.getElementById('closeWelcomeBtn').addEventListener('click', function() {
      document.getElementById('welcomeOverlay').classList.remove('active');
    });

    console.log('✅ نظام المدير جاهز');
  }

  return {
    init: init,
    isManager: function() { return managerMode; },
    getCurrentUser: function() { return currentUser; },
    changePassword: changePassword,
    getPasswords: function() { return passwords; }
  };
})();.