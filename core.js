// core.js - نواة شجرة الدرواشة
var TreeCore = (function() {
  // ---- بيانات النواة ----
  var rootData = {};
  var treeContainer, treeElement;

  // ---- دوال خاصة ----
  function buildTree(data, parentData) {
    var branch = document.createElement('div');
    branch.className = 'branch';
    if (data.children && data.children.length) branch.classList.add('has-children');
    
    // إضافة لون الفرع
    if (data.color) branch.classList.add(data.color);
    
    // إنشاء بطاقة الشخص
    var card = document.createElement('div');
    card.className = 'card';
    if (data.isRoot) card.classList.add('card-root-special');
    if (data.customShape && data.customShape !== 'default') card.classList.add('card-shape-' + data.customShape);
    if (data.familyColor) {
      card.style.borderColor = data.familyColor;
      card.style.boxShadow = '0 6px 25px ' + data.familyColor + '40';
    }
    
    card.innerHTML = '<div class="name">' + data.name + '</div>' +
                     '<div class="status-badge">' + (data.status || '') + '</div>';
    
    branch.appendChild(card);
    
    // إنشاء الأبناء
    if (data.children && data.children.length) {
      var childrenDiv = document.createElement('div');
      childrenDiv.className = 'children';
      data.children.forEach(function(child) {
        childrenDiv.appendChild(buildTree(child, data));
      });
      branch.appendChild(childrenDiv);
    }
    
    return branch;
  }

  function rebuildTree() {
    if (!treeElement) return;
    treeElement.innerHTML = '';
    treeElement.appendChild(buildTree(rootData));
  }

  // ---- دوال عامة ----
  return {
    init: function(containerId, treeId) {
      // تحميل البيانات
      if (typeof LOCAL_DATA !== 'undefined') {
        rootData = LOCAL_DATA;
      } else {
        // لو ما فيه data.js، استخدم البيانات من localStorage
        var saved = localStorage.getItem('familyTreeData');
        rootData = saved ? JSON.parse(saved) : null;
      }
      
      // لو ما فيه بيانات أبداً، استخدم بيانات افتراضية صغيرة
      if (!rootData) {
        rootData = { name: "درويش العلياني", isRoot: true, children: [] };
      }
      
      treeContainer = document.getElementById(containerId);
      treeElement = document.getElementById(treeId);
      
      rebuildTree();
      
      console.log('✅ النواة جاهزة');
    },
    getRootData: function() { return rootData; },
    saveData: function() {
      localStorage.setItem('familyTreeData', JSON.stringify(rootData));
    },
    rebuildTree: function() { rebuildTree(); }
  };
})();