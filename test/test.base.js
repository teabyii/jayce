var jayce = require('../')
var expect = require('expect.js')
var fs = require('fs')

describe('Variables', function () {
  it('Basic', function () {
    var tmpl = '<span class="label">{tip$}</span>'
    var data = { tip: 'new' }
    
    var html = jayce.render(tmpl, data)
    expect(html).to.be('<span class="label">new</span>')
  })
  
  it('Multi', function () {
    var tmpl = '<ul><li>{name$}</li><li>{mobile$}</li></ul>'
    var data = {
      name: 'Boom',
      mobile: '123456'
    }
    
    var html = jayce.render(tmpl, data)
    expect(html).to.be('<ul><li>Boom</li><li>123456</li></ul>')
  })
  
  it('HTML escape', function () {
    var tmpl = '<article>{content$}</article>'
    var data = {
      content: '<div>hello</div>'
    }
    
    var html = jayce.render(tmpl, data)
    expect(html).to.be('<article>&#60;div&#62;hello&#60;/div&#62;</article>')
  })
  
  it('Filter', function () {
    jayce.filter('format', function (str) {
      return new Date(str).getFullYear()
    })
    
    var tmpl = '<span class="time">{time | format$}</span>'
    var data = { time: '2015-1-1 06:00' }
    
    var html = jayce.render(tmpl, data)
    expect(html).to.be('<span class="time">2015</span>')
  })
})

describe('Condition', function () {
  it('Basic - true', function () {
    var tmpl = '{user?}<div>hello world</div>{/?}'
    var data = { user: true }
    
    var html = jayce.render(tmpl, data)
    expect(html).to.be('<div>hello world</div>')
  })
  
  it('Basic - false', function () {
    var tmpl = '<div>{user?}<div>hello world</div>{/?}</div>'
    var data = { user: false }
    
    var html = jayce.render(tmpl, data)
    expect(html).to.be('<div></div>')
  })
  
  it('Basic - else', function () {
    var tmpl = '<div>{user?}<h2>hello</h2>{:?}<p>no body</p>{/?}</div>'
    var data = { user: 0 }
    
    var html = jayce.render(tmpl, data)
    expect(html).to.be('<div><p>no body</p></div>')
  })
  
  it('Multi-condition', function () {
    var tmpl = '<p>{user < 0?}negative{user == 0:?}zero{:?}positive{/?}</p>'
    var data = { user: 0 }
    
    var html = jayce.render(tmpl, data)
    expect(html).to.be('<p>zero</p>')
  })
})

describe('Traverse', function () {
  it('Basic', function () {
    var tmpl = '<ul>{list, item, key@}<li>{key$}:{item$}</li>{/@}</ul>'
    var data = {
      list: ['a', 'b']
    }
    
    var html = jayce.render(tmpl, data)
    expect(html).to.be('<ul><li>0:a</li><li>1:b</li></ul>')
  })
  
  it('Basic - only item', function () {
    var tmpl = '<div class="{classes, item@}{item$} {/@}last"></div>'
    var data = {
      classes: ['label', 'label-error']
    }
    
    var html = jayce.render(tmpl, data)
    expect(html).to.be('<div class="label label-error last"></div>')
  })
})

describe('Compile', function () {
  it('Basic', function () {
    var tmpl = '<div class="{classes, item@}{item$} {/@}last">{user?}hello{:?}no body{/?}</div>'
    var render = jayce.compile(tmpl)
    expect(render).to.be.a('function')
    
    var data = {
      classes: ['label', 'label-success'],
      user: 0
    }
    var html = render(data)
    expect(html).to.be('<div class="label label-success last">no body</div>')
    
    data.classes = ['label']
    data.user = 1
    html = render(data)
    expect(html).to.be('<div class="label last">hello</div>')
  })
})

describe('Template file', function () {
  it('Complex template', function () {
    var tmpl = fs.readFileSync('./test/tmpl/base.jay')
    var data = {
      nav: [
        {
          text: 'index',
          href: '/index.html'
        },
        {
          text: 'about',
          href: '/about.html'
        }
      ],
      author: 'Boom Lee',
      article: {
        year: 2011,
        content: 'This is my code: `<div>hello world</div>`'
      }
    }
    
    var html = jayce.render(tmpl, data)
    expect(html).to.contain('<title>hello jayce</title>')
    expect(html).to.contain('<a href="/about.html">about</a>')
    expect(html).to.contain('After 1990')
    expect(html).to.contain('my code: `&#60;div&#62;hello world&#60;/div&#62;`')
    expect(html).to.contain('<footer>Copyright by Boom Lee')
  })
})
