var jayce = require('../')
var expect = require('expect.js')

describe('Expression', function () {
  it('Variable - Empty', function () {
    var tmpl = '<ul><li>{$}</li></ul>'
    
    var html = jayce.render(tmpl)
    expect(html).to.be('<ul><li>{$}</li></ul>')
  })
  
  it('Variable - No escape Empty', function () {
    var tmpl = '<ul><li>{#$}</li></ul>'
    
    var html = jayce.render(tmpl)
    expect(html).to.be('<ul><li>{#$}</li></ul>')
  })
  
  it('Condition - Empty', function () {
    var tmpl = '{?}<div></div>{:?}'
    
    var html = jayce.render(tmpl)
    expect(html).to.be('{?}<div></div>{:?}')
  })
  
  it('Traverse - Empty', function () {
    var tmpl = '{@}<div></div>'
    
    var html = jayce.render(tmpl)
    expect(html).to.be('{@}<div></div>')
  })
})

describe('Data', function () {
  it('Source - undefined', function () {
    var tmpl = '<div>{h$}</div>'
    expect(jayce.render(tmpl)).to.be('<div>undefined</div>')
  })
  
  it('Variable - undefined', function () {
    var tmpl = '<div>{h$}</div>'
    expect(jayce.render(tmpl, {})).to.be('<div>undefined</div>')
  })
  
  it('Traverse - Empty', function () {
    var tmpl = '<ul>{list, item@}<li>{item$}</li>{/@}</ul>'
    var data = {
      list: []
    }
    
    expect(jayce.render(tmpl, data)).to.be('<ul></ul>')
    
    data.list = {}
    expect(jayce.render(tmpl, data)).to.be('<ul></ul>')
  })
})
