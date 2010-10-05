(function() {
  var Base, Dispatcher, Rebl, Widget;
  var __extends = function(child, parent) {
    var ctor = function(){};
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
    child.prototype.constructor = child;
    if (typeof parent.extended === "function") parent.extended(child);
    child.__super__ = parent.prototype;
  }, __slice = Array.prototype.slice;
  Dispatcher = function(root) {
    this.current = (this.root = root);
    return this;
  };
  Dispatcher.prototype.call = function(env) {
    var new_env;
    if (env.action && env.action.path) {
      this.current = this.navigate(this.current, env.action.path);
    }
    if (!this.current) {
      return null;
    }
    new_env = this.current.call(env);
    if (new_env && new_env.next) {
      new_env.action = new_env.next;
      delete new_env['next'];
      this.call(new_env);
    }
    return new_env;
  };
  Dispatcher.prototype.navigate = function(handler, path) {
    var name;
    if (path.length === 0 || !handler) {
      return handler;
    }
    name = path[0];
    return name === '..' ? this.navigate(handler.parent, path.slice(1)) : this.navigate(handler[name], path.slice(1));
  };
  Base = function(parent) {
    this.parent = parent;
    return this;
  };
  Base.prototype.call = function(env) {
    return env.action && env.action.method && _.isFunction(this[env.action.method]) ? this[env.action.method](env) : null;
  };
  Base.prototype.next = function(env, action) {
    env.next = action;
    return env;
  };
  Widget = function() {
    return Base.apply(this, arguments);
  };
  __extends(Widget, Base);
  Widget.prototype.build = function(env) {
    return $('<textarea>').appendTo(env.selector);
  };
  Rebl = function() {
    this.widget = new Widget(this);
    Rebl.__super__.constructor.apply(this, arguments);
    return this;
  };
  __extends(Rebl, Base);
  Rebl.prototype.call = function(env) {
    if (env.selector) {
      return this.next(env, {
        'path': ['widget'],
        'method': 'build'
      });
    } else if (_.size(env.args) === 0) {
      return "Welcome to rebl! For help, run $.rebl({help: true}).";
    }
  };
  $.Rebl = new Rebl();
  $.rebl = function() {
    var args;
    args = __slice.call(arguments, 0);
    return new Dispatcher($.Rebl).call({
      args: args
    });
  };
  $.prototype.rebl = function() {
    var args;
    args = __slice.call(arguments, 0);
    return new Dispatcher($.Rebl).call({
      selector: this,
      args: args
    });
  };
}).call(this);