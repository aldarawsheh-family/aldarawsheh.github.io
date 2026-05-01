// js/core.js - النواة الأساسية
var TreeCore = (function () {
  var rootData = {};
  var treeContainer, treeElement;
  var scale = 1, posX = 0, posY = 0;

  // --- دوال مساعدة داخلية ---

  // البحث عن الأب في الشجرة
  function findParent(obj, targetId) {
    if (obj.children) {
      for (var i = 0; i < obj.children.length; i++) {
        if (obj.children[i]._id === targetId) return obj;
        var found = findParent(obj.children[i], targetId);
        if (found) return found;
      }
    }
    return null;
  }

  // جمع كل الذرية
  function getAllDescendants(person) {
    var list = [];
    if (person.children) {
      person.children.forEach(function (child) {
        list.push(child);
        list = list.concat(getAllDescendants(child));
      });
    }
    return list;
  }

  // الحصول على الكنية
  function getNickname(person) {
    if (!person.children || person.children.length === 0) return '';
    var first = person.children[0].name.split(' ')[0];
    return 'أبو ' + first;
  }

  // الحصول على الإخوة
  function getSiblings(person, parent) {
    if (!parent || !parent.children) return [];
    return parent.children
      .filter(function (c) {
        return c._id !== person._id;
      })
      .map(function (c) {
        return c.name.split(' ')[0];
      });
  }

  // حساب الجيل
  function getGeneration(person) {
    var gen = 1;
    (function find(obj, target, depth) {
      if (obj._id === target._id) {
        gen = depth;
        return true;
      }
      if (obj.children) {
        for (var i = 0; i < obj.children.length; i++) {
          if (find(obj.children[i], target, depth + 1)) return true;
        }
      }
      return false;
    })(rootData, person, 1);
    return gen;
  }

  // النسب الكامل
  function getFullLineage(person) {
    var ancestors = [];
    (function collect(obj, target, path) {
      if (obj._id === target._id) {
        ancestors = path.slice();
        return true;
      }
      if (obj.children) {
        for (var i = 0; i < obj.children.length; i++) {
          path.push(obj);
          if (collect(obj.children[i], target, path)) return true;
          path.pop();
        }
      }
      return false;
    })(rootData, person, []);
    var lineage = person.name.split(' ')[0];
    for (var i = ancestors.length - 1; i >= 0; i--) {
      lineage += ' بن ' + ancestors[i].name.split(' ')[0];
    }
    return lineage;
  }

  // --- بناء الشجرة ---

  function buildTree(data, parentData, parentColor) {
    var branch = document.createElement('div');
    branch.className = 'branch';
    if (data.children && data.children.length) {
      branch.classList.add('has-children');
    }

    // لون الفرع
    var colorClass = data.color || parentColor;
    if (colorClass) branch.classList.add(colorClass);

    // إنشاء البطاقة
    var card = document.createElement('div');
    card.className = 'card';
    if (data.isRoot) card.classList.add('card-root-special');
    if (data.customShape && data.customShape !== 'default') card.classList.add('card-shape-' + data.customShape);
    if (data.familyColor) {
      card.style.borderColor = data.familyColor;
      card.style.boxShadow = '0 6px 25px ' + data.familyColor + '40';
    }

    var displayName = data.displayName || data.name;
    var nickname = getNickname(data);
    var nicknameHTML = nickname
      ? '<div style="font-size:0.7em;opacity:0.7;margin-top:2px;">' + nickname + '</div>'
      : '';

    card.innerHTML =
      '<div class="id-badge">' + (data._id || '') + '</div>' +
      '<div class="name">' + displayName + '</div>' +
      nicknameHTML +
      '<div class="status-badge">' + (data.status || '') + '</div>' +
      '<div class="manager-actions">' +
      '<button class="add-son">➕ ابن</button>' +
      '<button class="edit-card">✏️ تعديل</button>' +
      '<button class="btn-shape change-shape">🎨 شكل</button>' +
      '<button class="btn-family-color color-family">🌈 تلوين</button>' +
      '<button class="btn-delete delete-card">🗑️ حذف</button>' +
      '</div>';

    // بيانات مخزنة في الذاكرة
    card.dataset.name = data.name;
    card.dataset.birth = data.birth || '';
    card.dataset.status = data.status || '';
    card.dataset.id = data._id;

    // أحداث البطاقة
    card.querySelector('.name').addEventListener('click', function (e) {
      e.stopPropagation();
      if (!TreeManager || !TreeManager.isManager()) {
        showCard(data);
      }
    });

    card.querySelector('.add-son').addEventListener('click', function (e) {
      e.stopPropagation();
      if (TreeManager && TreeManager.isManager()) openAddForm(branch, data, colorClass);
    });
    card.querySelector('.edit-card').addEventListener('click', function (e) {
      e.stopPropagation();
      if (TreeManager && TreeManager.isManager()) openEditForm(card, data);
    });
    card.querySelector('.change-shape').addEventListener('click', function (e) {
      e.stopPropagation();
      if (TreeManager && TreeManager.isManager()) openShapeModal(card, data);
    });
    card.querySelector('.color-family').addEventListener('click', function (e) {
      e.stopPropagation();
      if (TreeManager && TreeManager.isManager()) openFamilyColorModal(card, data);
    });
    card.querySelector('.delete-card').addEventListener('click', function (e) {
      e.stopPropagation();
      if (TreeManager && TreeManager.isManager()) deletePerson(branch, data);
    });

    branch.appendChild(card);

    // الأبناء
    if (data.children && data.children.length) {
      var childrenDiv = document.createElement('div');
      childrenDiv.className = 'children';
      data.children.forEach(function (child) {
        childrenDiv.appendChild(buildTree(child, data, colorClass));
      });
      branch.appendChild(childrenDiv);
    }

    return branch;
  }

  // --- عرض بطاقة الهوية ---
  function showCard(data) {
    document.getElementById('cardIdNumber').textContent = '⭐ ' + (data._id || '---') + ' ⭐';
    document.getElementById('cardName').textContent = data.name;
    document.getElementById('cardNickname').textContent = getNickname(data) || 'لا يوجد';
    document.getElementById('cardBirth').textContent = data.birth || 'غير مسجل';

    var age = 'غير معروف';
    if (data.birth) {
      var m = data.birth.match(/(\d{4})/);
      if (m) {
        var by = parseInt(m[1]),
          cy = new Date().getFullYear();
        if (by > 1000 && by <= cy) age = cy - by + ' سنة';
        else if (by > 1300) age = cy - by + ' سنة (هـ)';
      }
    }
    document.getElementById('cardAge').textContent =
      data.status.indexOf('متوف') !== -1 ? 'متوفي' : age;
    document.getElementById('cardStatus').textContent = data.status;

    var parent = findParent(rootData, data._id);
    var sib = getSiblings(data, parent);
    document.getElementById('cardSiblings').textContent = sib.length ? sib.join('، ') : 'لا يوجد';
    document.getElementById('cardLineage').textContent = '📜 النسب: ' + getFullLineage(data);
    document.getElementById('cardGeneration').textContent = 'الجيل: ' + getGeneration(data) + ' من درويش';
    document.getElementById('cardModal').classList.add('active');
  }

  // --- إضافة / تعديل ---
  function openAddForm(branchDiv, parentData, parentColor) {
    document.getElementById('formTitle').textContent = 'إضافة ابن / بنت';
    document.getElementById('formName').value = '';
    document.getElementById('formBirth').value = '';
    document.getElementById('formStatus').value = 'حي أطال الله بعمره';
    document.getElementById('formModal').classList.add('active');
    window._formContext = { type: 'add', branch: branchDiv, parent: parentData, color: parentColor };
  }

  function openEditForm(card, data) {
    document.getElementById('formTitle').textContent = 'تعديل بيانات';
    document.getElementById('formName').value = data.name || '';
    document.getElementById('formBirth').value = data.birth || '';
    document.getElementById('formStatus').value = data.status || 'حي أطال الله بعمره';
    document.getElementById('formModal').classList.add('active');
    window._formContext = { type: 'edit', card: card, data: data };
  }

  document.getElementById('formSubmit').addEventListener('click', function () {
    var ctx = window._formContext;
    if (!ctx) return;
    var name = document.getElementById('formName').value.trim();
    if (!name) { alert('أدخل الاسم'); return; }
    var birth = document.getElementById('formBirth').value.trim();
    var status = document.getElementById('formStatus').value;

    if (ctx.type === 'add') {
      var newPerson = {
        name: name,
        displayName: name.split(' ')[0],
        birth: birth,
        status: status,
        children: [],
        branchCode: ctx.parent.branchCode || 'D',
        _id: 'D-H ' + Math.random().toString(36).substr(2, 5),
        customShape: 'default',
        familyColor: ''
      };
      if (!ctx.parent.children) ctx.parent.children = [];
      ctx.parent.children.push(newPerson);
      saveData();
      var nb = buildTree(newPerson, ctx.parent, ctx.color);
      var cd = ctx.branch.querySelector(':scope > .children');
      if (!cd) {
        cd = document.createElement('div');
        cd.className = 'children';
        ctx.branch.appendChild(cd);
        ctx.branch.classList.add('has-children');
      }
      cd.appendChild(nb);
    } else {
      ctx.data.name = name;
      ctx.data.displayName = name.split(' ')[0];
      ctx.data.birth = birth;
      ctx.data.status = status;
      ctx.card.querySelector('.name').textContent = name;
      ctx.card.dataset.name = name;
      ctx.card.dataset.birth = birth;
      ctx.card.dataset.status = status;
      ctx.card.querySelector('.status-badge').textContent = status;
      saveData();
    }
    document.getElementById('formModal').classList.remove('active');
    window._formContext = null;
  });

  document.getElementById('formCancel').addEventListener('click', function () {
    document.getElementById('formModal').classList.remove('active');
    window._formContext = null;
  });

  // --- حذف ---
  function deletePerson(branchDiv, data) {
    if (!TreeManager || !TreeManager.isManager()) return;
    var hasChilds = data.children && data.children.length;
    var isRoot = data.isRoot;

    if (hasChilds) {
      if (confirm('⚠️ "' + data.name + '" لديه أبناء.\nموافق = حذف الشخص فقط (ينتقل أبناؤه للأعلى)\nإلغاء = سيتم سؤالك عن الحذف الكامل.')) {
        if (isRoot) {
          if (confirm('⚠️ حذف المؤسس! سيصبح أكبر أبنائه المؤسس الجديد.')) {
            var eldest = data.children[0];
            for (var i = 1; i < data.children.length; i++) eldest.children.push(data.children[i]);
            eldest.isRoot = true;
            eldest.color = 'color-root';
            rootData = eldest;
            saveData();
            rebuildTree();
          }
        } else {
          var parent = findParent(rootData, data._id);
          if (parent) {
            data.children.forEach(function (c) { parent.children.push(c); });
            parent.children = parent.children.filter(function (c) { return c._id !== data._id; });
            saveData();
            rebuildTree();
            alert('✅ تم حذف الشخص فقط.');
          }
        }
      } else {
        if (confirm('🗑️ حذف "' + data.name + '" وكل ذريته؟')) {
          if (isRoot) {
            if (confirm('⚠️ حذف المؤسس وكل ذريته! ستفرغ الشجرة.')) {
              rootData = { name: "شجرة فارغة", isRoot: true, children: [], _id: 'empty' };
              saveData();
              rebuildTree();
            }
          } else {
            var p = findParent(rootData, data._id);
            p.children = p.children.filter(function (c) { return c._id !== data._id; });
            saveData();
            rebuildTree();
            alert('✅ تم حذف الشخص وكل ذريته.');
          }
        }
      }
    } else {
      if (isRoot) {
        if (confirm('⚠️ حذف المؤسس؟ لا يوجد أبناء.')) {
          rootData = { name: "شجرة فارغة", isRoot: true, children: [], _id: 'empty' };
          saveData();
          rebuildTree();
        }
      } else {
        if (confirm('🗑️ حذف "' + data.name + '"؟')) {
          var par = findParent(rootData, data._id);
          par.children = par.children.filter(function (c) { return c._id !== data._id; });
          saveData();
          rebuildTree();
          alert('✅ تم الحذف.');
        }
      }
    }
  }

  // --- الشكل واللون ---
  function openShapeModal(card, data) {
    document.getElementById('shapeTargetName').textContent = 'تغيير شكل: ' + data.name;
    document.getElementById('shapeSelect').value = data.customShape || 'default';
    document.getElementById('shapeModal').classList.add('active');
    window._shapeCard = card;
    window._shapeData = data;
  }

  document.getElementById('saveShapeBtn').addEventListener('click', function () {
    var shape = document.getElementById('shapeSelect').value;
    var card = window._shapeCard;
    card.classList.remove('card-shape-gold', 'card-shape-jewel', 'card-shape-papyrus', 'card-shape-hexagon', 'card-shape-knight');
    if (shape !== 'default') card.classList.add('card-shape-' + shape);
    window._shapeData.customShape = shape;
    saveData();
    document.getElementById('shapeModal').classList.remove('active');
  });

  document.getElementById('cancelShapeBtn').addEventListener('click', function () {
    document.getElementById('shapeModal').classList.remove('active');
  });

  function openFamilyColorModal(card, data) {
    document.getElementById('familyColorTargetName').textContent = 'تلوين: ' + data.name;
    document.getElementById('familyColorPicker').value = data.familyColor || '#b7950b';
    document.getElementById('familyColorModal').classList.add('active');
    window._familyData = data;
  }

  document.getElementById('saveFamilyColorBtn').addEventListener('click', function () {
    var color = document.getElementById('familyColorPicker').value;
    var person = window._familyData;
    person.familyColor = color;
    getAllDescendants(person).forEach(function (d) { d.familyColor = color; });
    saveData();
    rebuildTree();
    document.getElementById('familyColorModal').classList.remove('active');
  });

  document.getElementById('cancelFamilyColorBtn').addEventListener('click', function () {
    document.getElementById('familyColorModal').classList.remove('active');
  });

  // --- إعادة رسم الشجرة ---
  function rebuildTree() {
    treeElement.innerHTML = '';
    treeElement.appendChild(buildTree(rootData, null, null));
  }

  // --- التخزين ---
  function saveData() {
    localStorage.setItem('familyTreeData', JSON.stringify(rootData));
  }

  // --- التكبير والتحريك (Pinch + Drag) ---
  function setTransform() {
    treeElement.style.transform = 'translate(' + posX + 'px, ' + posY + 'px) scale(' + scale + ')';
  }

  function autoCenter() {
    var cr = treeContainer.getBoundingClientRect();
    var tr = treeElement.getBoundingClientRect();
    posX = cr.width / 2 - tr.width / 2;
    posY = cr.height / 2 - tr.height / 2;
    scale = window.innerWidth < 768 ? 0.7 : 1;
    setTransform();
  }

  // --- الواجهة العامة ---
  return {
    init: function (containerId, treeId) {
      treeContainer = document.getElementById(containerId);
      treeElement = document.getElementById(treeId);

      if (typeof LOCAL_DATA !== 'undefined') {
        rootData = LOCAL_DATA;
      } else {
        var saved = localStorage.getItem('familyTreeData');
        rootData = saved ? JSON.parse(saved) : { name: "درويش العلياني", isRoot: true, children: [] };
      }

      rebuildTree();

      // أحداث اللمس
      var initDist = 0, initScale = 1, dragging = false, sx, sy, spx, spy;
      treeContainer.addEventListener('touchstart', function (e) {
        if (e.touches.length === 2) {
          e.preventDefault();
          initDist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
          initScale = scale;
        } else if (e.touches.length === 1 && !e.target.closest('.card, button')) {
          dragging = true;
          sx = e.touches[0].clientX;
          sy = e.touches[0].clientY;
          spx = posX;
          spy = posY;
        }
      }, { passive: false });

      treeContainer.addEventListener('touchmove', function (e) {
        if (e.touches.length === 2) {
          e.preventDefault();
          var d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
          if (initDist > 0) {
            var ns = Math.min(3, Math.max(0.3, initScale * (d / initDist)));
            var r = treeContainer.getBoundingClientRect();
            var mx = (e.touches[0].clientX + e.touches[1].clientX) / 2 - r.left;
            var my = (e.touches[0].clientY + e.touches[1].clientY) / 2 - r.top;
            var f = ns / scale;
            posX = mx - (mx - posX) * f;
            posY = my - (my - posY) * f;
            scale = ns;
            setTransform();
          }
        } else if (dragging) {
          posX = spx + e.touches[0].clientX - sx;
          posY = spy + e.touches[0].clientY - sy;
          setTransform();
        }
      }, { passive: false });

      treeContainer.addEventListener('touchend', function () {
        initDist = 0;
        dragging = false;
      });

      treeContainer.addEventListener('mousedown', function (e) {
        if (e.target.closest('.card, button')) return;
        dragging = true;
        sx = e.clientX;
        sy = e.clientY;
        spx = posX;
        spy = posY;
        treeContainer.style.cursor = 'grabbing';
      });
      window.addEventListener('mousemove', function (e) {
        if (!dragging) return;
        posX = spx + e.clientX - sx;
        posY = spy + e.clientY - sy;
        setTransform();
      });
      window.addEventListener('mouseup', function () {
        dragging = false;
        treeContainer.style.cursor = 'grab';
      });

      setTimeout(autoCenter, 400);
    },
    getRootData: function () { return rootData; },
    saveData: saveData,
    rebuildTree: rebuildTree,
    findParent: findParent,
    getAllDescendants: getAllDescendants,
    openAddForm: openAddForm,
    openEditForm: openEditForm,
    deletePerson: deletePerson
  };
})();