(function() {
  var Rebl, Resource;
  var __extends = function(child, parent) {
    var ctor = function(){};
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
    child.prototype.constructor = child;
    if (typeof parent.extended === "function") parent.extended(child);
    child.__super__ = parent.prototype;
  }, __slice = Array.prototype.slice;
  Resource = function() {};
  Resource.prototype.dispatch = function() {
    return this.call({});
  };
  Resource.prototype.call = function(env) {};
  Rebl = function() {
    return Resource.apply(this, arguments);
  };
  __extends(Rebl, Resource);
  Rebl.prototype.call = function(env) {
    return "Welcome to rebl! For help, run $.rebl('help').";
  };
  $.Rebl = new Rebl();
  $.rebl = function() {
    var args;
    args = __slice.call(arguments, 0);
    return $.Rebl.dispatch.apply($.Rebl, args);
  };
  $.prototype.rebl = function() {
    var args;
    args = __slice.call(arguments, 0);
    return $.Rebl.dispatch.apply($.Rebl, args.concat([{
      selector: this
    }]));
  };
}).call(this);