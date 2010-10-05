class Dispatcher
  constructor: (root) ->
    @current = @root = root

  call: (env) ->
    if env.action and env.action.path
      @current = @navigate(@current, env.action.path)
    if not @current
      return

    new_env = @current.call(env)
    if new_env and new_env.next
      new_env.action = new_env.next
      delete new_env['next']
      @call(new_env)
    new_env

  navigate: (handler, path) ->
    if path.length == 0 or not handler
      return handler
    name = path[0]
    if name == '..'
      @navigate handler.parent, path.slice(1)
    else
      @navigate handler[name], path.slice(1)

class Base
  constructor: (parent) ->
    @parent = parent

  call: (env) ->
    if env.action && env.action.method and _.isFunction(this[env.action.method])
      this[env.action.method](env)

  next: (env, action) ->
    env.next = action
    env

class Widget extends Base
  build: (env) ->
    $('<textarea>').appendTo(env.selector)

class Rebl extends Base
  constructor: () ->
    @widget = new Widget(this)
    super

  call: (env) ->
    if env.selector
      @next(env, {'path': ['widget'], 'method': 'build'})
    else if _.size(env.args) == 0
      "Welcome to rebl! For help, run $.rebl({help: true})."

$.Rebl = new Rebl

$.rebl = (args...) ->
  new Dispatcher($.Rebl).call({args: args})

$::rebl = (args...) ->
  new Dispatcher($.Rebl).call({selector: this, args: args})
