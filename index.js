/**
 * Simple modern template engine.
 *
 * Boom.Lee <boom11235.gg@gmail.com>
 */
(function (root, factory) {
  /**
   * Simple Adapter to CMD, AMD, global
   */
  if (typeof define === 'function') {
    define(factory)
  } else if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory()
  } else {
    root.jayce = factory()
  }
})(this, function () {
  /**
   * Render function cache.
   */
  var _cache = {}
  var _filters = {}
  
  /**
   * Traverse each element in array.
   *
   * @param {Array} array Which will be traversed.
   * @param {Function} callback Do with each element.
   * @returns {String} Source array.
   */
  function forEach(array, callback) {
    var i = 0, len = array.length
    while(i < len) {
      callback(array[i], i++)
    }
    return array
  }
  
  /**
   * Remove all space.
   *
   * @param {String} str
   * @returns {String} String without space.
   */
  function trimAll(str) {
    return str.replace(/\s/g, '')
  }
  
  /**
   * Transferred `", \, \r, \n`.
   *
   * @param {String} code Template code.
   * @returns {String} code
   */
  function stringify(code) {
    return String(code).replace(/("|\\)/g, '\\$1')
      .replace(/\r/g, '\\r')
      .replace(/\n/g, '\\n')
  }

  /**
   * Basic Html Entities encode.
   * Reference: https://github.com/aui/artTemplate/blob/master/src/utils.js
   *
   * @param {String} code Html string.
   * @returns {String} Html string encoded.
   */
  var _escapeMap = {
    '<': '&#60;',
    '>': '&#62;',
    '"': '&#34;',
    "'": '&#39;',
    '&': '&#38;'
  }
  function _escapeFn(str) {
    return _escapeMap[str]
  }
  function _escapeHTML(html) {
    return String(html).replace(/&(?![\w#]+;)|[<>"']/g, _escapeFn)
  }
  
  /**
   * Different template logic type support and pick variables.
   *
   * @param item
   * @param vars
   * @returns
   */
  var RE_VAR = /\.?(?!\d)[\d\w_$]+/g // To get variable name from the expression.
  function typeParse(codes, vars) {
    /**
     * Output string join. Using `_out` as variable.
     *
     * @param {String} code
     * @returns {String}
     */
    function _join(exp) {
      return '_out+=' + exp + ';'
    }
    
    /**
     * `While` code join to traverse.
     *
     * @param {String} exp Expression in template.
     * @returns {String} Final code.
     */
    function _traverse(exp) {
      var arr = exp.split(',')
      var target = arr[0]
      vars.push(target)
      var elem = arr[1]
      var index = arr[2]
      return 'var i=0;len=' + target +
        '.length;while(i<len){var ' + elem +
        '=' + target +
        '[i];' + (index ? 'var ' + index + '=i;' : '')
    }
    
    /**
     * Parse `{v | f1 | f2}` to `_$$.f2(_$$.f1(v))`
     *
     * @param {String} exp
     * @param {Array} vars To save variable name.
     * @returns {String} Expression wrapped with filters.
     */
    function _filter(exp) {
      var exps = exp.split(/\|+/)
      var code
      forEach(exps, function (exp, index) {
        if (index === 0) {
          code = exp
          vars.push(exp.split('.')[0])
        } else {
          code = '_$$.' + exp + '(' + code + ')'
        }
      })
      return code
    }
    
    if (codes.length === 3) {
      var code = ''
      var exp = trimAll(codes[0])
      var sign = codes[1]
      var str = codes[2]
    
      switch (sign) {
        case '$':
          // Normal variables.
          if (exp.charAt(0) === '#') {
            // No escape.
            exp = exp.substr(1)
            code = _join(_filter(exp))
          } else {
            code = _join('_$(' + _filter(exp) + ')')
          }
          break
        case '?':
          // Condition.
          forEach(exp.match(RE_VAR), function (item) {
            // When `obj.key`, `key` not a variable.
            if (!/\./.test(item)) {
              vars.push(item)
            }
          })
          code = 'if(' + exp + '){'
          break
        case ':?':
          // Else.
          code = exp ? '}else if(' + exp +'){' : '}else{'
          break
        case '/?':
          code = '}'
          break
        case '@':
          // Traverse.
          code = _traverse(exp)
          break
        case '/@':
          code = 'i++;}'
          break
        default:
      }
      code += _join('"' + str + '"')
      return code
    }
    return _join('"' + codes[0] + '"')
  }
  
  
  /**
   * Wrap function to inject escape function and filters.
   *
   * @param {Function} fn Render function.
   * @returns {Function} Render to users.
   */
  function Wrap(fn) {
    return function (data) {
      return fn(data, _escapeHTML, _filters)
    }
  }
  /**
   * Compile template string to render function.
   *
   * @param {String} tmpl Template string.
   * @returns {Function} render function.
   */
  var RE_LEFT = /\{/g
  var RE_RIGHT = /((?:\/|:)?[$?!@-])\}/g
  function compile(tmpl) {
    
    // Cache First.
    if (_cache[tmpl]) {
      return _cache[tmpl]
    }
    
    // Parse template syntax and pick up variables in template.
    tmpl = stringify(tmpl)
    var code = ''
    var vars = []
    forEach(tmpl.split(RE_LEFT), function (codes) {
      codes = codes.split(RE_RIGHT)
      code += typeParse(codes, vars)
    })
    
    // Variables assignment.
    var header = 'var _out="";'
    forEach(vars, function (item) {
      header += 'var ' + item + '=data.' + item + ';'
    })
    code = header + code + 'return _out;'
    
    // Create render function and write cache.
    var render = new Function('data', '_$', '_$$', code)
    return (_cache[tmpl] = Wrap(render))
  }
  
  /**
   * Description of what this does.
   *
   * @param
   * @returns
   */
  function render(tmpl, data) {
    return compile(tmpl)(data)
  }
  
  /**
   * Register a filter function.
   *
   * @param {String} name Filter name.
   * @param {Function} fn Filter function to call.
   * @returns {Object} Jayce Object.
   */
  function filter(name, fn) {
    _filters[name] = fn
    return this
  }
  
  return {
    compile: compile,
    render: render,
    filter: filter
  }
})
