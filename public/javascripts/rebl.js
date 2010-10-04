(function() {
  var Doc, DocList, Input, Rebl, Toolbar;
  DocList = function() {};
  DocList.prototype.call = function(env) {
    var docwrap, input, sel, toolbar;
    sel = $(env.element);
    if ($('.doc.toolbar', sel).length === 0) {
      docwrap = $('<div>').addClass('docwrap');
      sel.append(docwrap);
      toolbar = $('<div>').addClass('doc toolbar fixed');
      docwrap.append(toolbar);
      toolbar.rebl();
      docwrap = $('<div>').addClass('docwrap');
      sel.append(docwrap);
      input = $('<div>').addClass('doc input fixed');
      docwrap.append(input);
      return input.rebl();
    }
  };
  Toolbar = function() {};
  Toolbar.prototype.call = function(env) {
    var _i, _len, _ref, _result, env2, link, sel;
    if (env.title && env.cls) {
      return this.addButton(env);
    }
    sel = $(env.element);
    if ($('a', sel).length === 0) {
      _result = []; _ref = [
        {
          'title': 'Help',
          'cls': 'help'
        }, {
          'title': 'About',
          'cls': 'about'
        }, {
          'title': 'Hide Input',
          'cls': 'showinput'
        }
      ];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        link = _ref[_i];
        _result.push((function() {
          env2 = {};
          $.extend(env2, env);
          $.extend(env2, link);
          return this.call(env2);
        }).call(this));
      }
      return _result;
    }
  };
  Toolbar.prototype.addButton = function(env) {
    var a, sel;
    sel = $(env.element);
    a = $('<a>').attr('href', 'javascript:void(0);').addClass(env.cls).addClass('oplink').text(env.title);
    return sel.append(a).append("\n");
  };
  Input = function() {};
  Input.prototype.call = function(env) {
    var a, center, input, left, right, sel, textarea, three;
    sel = $(env.element);
    if ($('textarea', sel).length === 0) {
      three = $('<div>').addClass('three');
      sel.append(three);
      left = $('<div>').addClass('left cue').text('enter text:');
      three.append(left);
      center = $('<div>').addClass('center tags');
      three.append(center);
      right = $('<div>').addClass('right links');
      a = $('<a>').addClass('oplink close').attr('href', 'javascript:void(0)').text('X');
      right.append(a);
      three.append(right);
      input = $('<div>').addClass('input');
      sel.append(input);
      textarea = $('<textarea>');
      return input.append(textarea);
    }
  };
  Doc = function() {};
  Doc.prototype.call = function(env) {
    var _i, _len, _ref, _result, cls, sel;
    sel = $(env.element);
    if (!this.toolbar) {
      this.toolbar = new Toolbar();
    }
    if (!this.input) {
      this.input = new Input();
    }
    _result = []; _ref = ['toolbar', 'input'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      cls = _ref[_i];
      _result.push(sel.hasClass(cls) ? this[cls].call(env) : null);
    }
    return _result;
  };
  Rebl = function() {};
  Rebl.prototype.call = function(env) {
    var _i, _len, _ref, cls, sel;
    sel = $(env.element);
    if (!this.doclist) {
      this.doclist = new DocList();
    }
    if (!this.doc) {
      this.doc = new Doc();
    }
    _ref = ['doclist', 'doc'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      cls = _ref[_i];
      if (sel.hasClass(cls)) {
        this[cls].call(env);
      }
    }
    return env;
  };
  $.fn.rebl = function(env) {
    if (!env) {
      env = {};
    }
    env.element = this;
    if (!$.rebl) {
      $.rebl = new Rebl();
    }
    $.rebl.call(env);
    return this;
  };
  $(document).ready(function() {
    $('.sample').remove();
    return $('.doclist').rebl({
      focus: true
    });
  });
}).call(this);