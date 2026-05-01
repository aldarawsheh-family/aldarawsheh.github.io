// manager.js - نظام المدير والصلاحيات
var TreeManager = (function() {
  var managerMode = false;
  var currentUser = null; // { type: 'manager' | 'branch' | 'guest', name: '', branch: '' }

  // كلمات السر (يمكن تغييرها لاحقاً)
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

  // ---- دوال عامة ----

  // تسجيل الدخول
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

  // تطبيق الصلاحيات
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

    // رسالة ترحيب
    showWelcome();
  }

  // عرض رسالة ترحيب
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

  // تغيير كلمة المرور
  function changePassword(type, newPass) {
    if (type === 'manager') {
      passwords.manager = newPass;
    } else if (type === 'guest') {
      passwords.guest = newPass;
    } else {
      passwords.branches[type] = newPass;
    }
    savePasswords();
  }

  // تسجيل الخروج
  function logout() {
    currentUser = null;
    managerMode = false;
    document.body.classList.remove('show-manager');
    document.getElementById('toggleManager').textContent = '🔐';
    document.getElementById('toggleManager').classList.remove('active-manager');
    document.getElementById('welcomeOverlay').classList.remove('active');
  }

  // ---- واجهة تسجيل الدخول ----
  function showLoginModal() {
    var modal = document.getElementById('loginModal');
    document.getElementById('loginPassword').value = '';
    modal.classList.add('active');
  }

  // ---- تهيئة الأزرار ----
  function init() {
    // زر المدير
    document.getElementById('toggleManager').addEventListener('click', function() {
      if (currentUser) {
        logout();
      } else {
        showLoginModal();
      }
    });

    // تأكيد تسجيل الدخول
    document.getElementById('confirmLogin').addEventListener('click', function() {
      var pass = document.getElementById('loginPassword').value;
      if (login(pass)) {
        document.getElementById('loginModal').classList.remove('active');
      } else {
        alert('❌ كلمة مرور خاطئة');
      }
    });

    // إلغاء تسجيل الدخول
    document.getElementById('cancelLogin').addEventListener('click', function() {
      document.getElementById('loginModal').classList.remove('active');
    });

    // إغلاق رسالة الترحيب
    document.getElementById('closeWelcomeBtn').addEventListener('click', function() {
      document.getElementById('welcomeOverlay').classList.remove('active');
      setTimeout(autoCenter, 300);
    });

    console.log('✅ نظام المدير جاهز');
  }

  // الدوال العامة
  return {
    init: init,
    isManager: function() { return managerMode; },
    getCurrentUser: function() { return currentUser; },
    login: login,
    logout: logout,
    changePassword: changePassword,
    getPasswords: function() { return passwords; }
  };
})();