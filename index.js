/**
 * Simple modern template engine.
 *
 * Boom.Lee <boom11235.gg@gmail.com>
 */
(function (root, factory) {
  if (typeof define === 'function') {
    define(factory)
  } else if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory()
  } else {
    root.jayce = factory()
  }
})(this, function () {
  
  /**
   * Description of what this does.
   *
   * @param
   * @returns
   */
  function compile() {
    
  }
  
  /**
   * Description of what this does.
   *
   * @param
   * @returns
   */
  function render() {
    
  }
  
  /**
   * Description of what this does.
   *
   * @param
   * @returns
   */
  function filter() {
    
  }
  
  return {
    compile: compile,
    render: render,
    filter: filter
  }
})
