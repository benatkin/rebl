class DocList
  call: (env) ->
    sel = $(env.element)
    if $('.doc.toolbar', sel).length == 0
      docwrap = $('<div>').addClass('docwrap')
      sel.append(docwrap)
      toolbar = $('<div>').addClass('doc toolbar fixed')
      docwrap.append(toolbar)
      toolbar.rebl()

      docwrap = $('<div>').addClass('docwrap')
      sel.append(docwrap)
      input = $('<div>').addClass('doc input fixed')
      docwrap.append(input)
      input.rebl()

class Toolbar
  call: (env) ->
    if env.title and env.cls
      return this.addButton(env)

    sel = $(env.element)
    if $('a', sel).length == 0
      for link in [{'title': 'Help',       'cls': 'help'}, {'title': 'About',      'cls': 'about'}, {'title': 'Hide Input', 'cls': 'showinput'}]
        env2 = {}
        $.extend(env2, env)
        $.extend(env2, link)
        this.call(env2)

  addButton: (env) ->
    sel = $(env.element)
    a = $('<a>').attr('href', 'javascript:void(0);')
      .addClass(env.cls).addClass('oplink').text(env.title)
    sel.append(a).append("\n")

class Input
  call: (env) ->
    if env.event
      return this.handleEvent(env)

    sel = $(env.element)
    if $('textarea', sel).length == 0
      three = $('<div>').addClass('three')
      sel.append(three)
      left = $('<div>').addClass('left cue').text('enter text:')
      three.append(left)
      center = $('<div>').addClass('center tags')
      three.append(center)
      right = $('<div>').addClass('right links')
      close = $('<a>').addClass('oplink close').attr('href', 'javascript:void(0)').text('X')
      right.append(close)
      three.append(right)

      input = $('<div>').addClass('input')
      sel.append(input)
      textarea = $('<textarea>')
      input.append(textarea)

      $('.doc.input textarea').live 'keypress keyup', (e) =>
        this.call({'event': e})

  handleEvent: (env) ->
    env2 = {}
    if env.event.type == 'keypress' and env.event.keyCode == 13
      env.event.preventDefault()
      env2.enter = true
      env2.text = $('textarea').val()
    else if env.event.type == 'keyup'
      env2.text = $('textarea').val()
    else
      env2 = null

    if env2 and env2.enter
      sel = $(env.event.target).parents('.doclist').first()
      docwrap = $('<div>').addClass('docwrap')
      sel.append(docwrap)
      output = $('<div>').addClass('doc output')
      docwrap.append(output)
      output.rebl(env2)

class Output
  call: (env) ->
    sel = $(env.element)
    console.log(sel)
    body = $('<div>').addClass('body').text(env.text)
    sel.append(body)
    if env.date
      meta = $('<div>').addClass('meta')
      sel.append(meta)
      date = $('<span>').addClass('date').text(env.date)

class Doc
  call: (env) ->
    sel = $(env.element)

    if ! this.toolbar
      this.toolbar = new Toolbar()
    if ! this.input
      this.input = new Input()
    if ! this.output
      this.output = new Output()

    for cls in ['toolbar', 'input', 'output']
      if sel.hasClass(cls)
        this[cls].call(env)

class Rebl
  call: (env) ->
    sel = $(env.element)

    if ! this.doclist
      this.doclist = new DocList()
    if ! this.doc
      this.doc = new Doc()
    
    for cls in ['doclist', 'doc']
      if sel.hasClass(cls)
        this[cls].call(env)

    env

$.fn.rebl = (env) ->
  if ! env
    env = {}
  env.element = this
  if ! $.rebl
    $.rebl = new Rebl()
  $.rebl.call(env)
  this

$(document).ready () ->
  $('.sample').remove()
  $('.doclist').rebl({focus: true})
