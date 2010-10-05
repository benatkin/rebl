class Resource
  dispatch: (args...) ->
    @call {}
  call: (env) ->

class Rebl extends Resource
  call: (env) ->
    "Welcome to rebl! For help, run $.rebl('help')."

$.Rebl = new Rebl

$.rebl = (args...) ->
  $.Rebl.dispatch(args...)

$::rebl = (args...) ->
  $.Rebl.dispatch(args..., {selector: this})
