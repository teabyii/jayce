var Benchmark = require('benchmark')

/**
 * Compare with:
 *   - handlebars
 *   - dust
 *   - mustache
 *   - art-template
 *   - dot
 */
var jayce = require('../')
var handlebars = require('handlebars')
var mustache = require('mustache')
var art = require('art-template')
var dot = require('dot')

var template = {
  jayce: '<nav><ul>{nav, item@}<li><a href="{item.href$}">{item.text$}</a></li>{/@}</ul></nav><article><h2>Title - {article.year >= 2014 ?}Recently{article.year >= 1990 :?}After 1990{:?}Long since{/?}</h2><div class="content">{article.content$}</div></article><footer>Copyright by {author$}</footer>',
  handlebars: '<nav><ul>{{#each nav}}<li><a href={{href}}>{{text}}</a></li>{{/each}}</ul></nav><article><h2>Title - {{#if gte2014}} Recently {{/if}}{{#if gte1990}} After 1990 {{else}} Long since {{/if}}</h2><div class=content>{{article.content}}</div></article><footer>Copyright by {{author}}</footer>',
  mustache: '<nav><ul>{{#nav}}<li><a href={{href}}>{{text}}</a></li>{{/nav}}</ul></nav><article><h2>Title - {{#gte2014}} Recently {{/gte2014}}{{#gte1990}} After 1990 {{/gte1990}}{{^gte1990}} Long since {{/gte1990}}</h2><div class=content>{{article.content}}</div></article><footer>Copyright by {{author}}</footer>',
  art: '<nav><ul>{{each nav as item}}<li><a href={{item.href}}>{{item.text}}</a></li>{{/each}}</ul></nav><article><h2>Title - {{if article.year >= 2014}} Recently {{else if article.year >= 1990}} After 1990 {{else}} Long since {{/if}}</h2><div class=content>{{article.content}}</div></article><footer>Copyright by {{author}}</footer>',
  dot: '<nav><ul>{{~it.nav :item}}<li><a href={{=item.href}}>{{=item.text}}</a></li>{{~}}</ul></nav><article><h2>Title - {{? it.article.year >= 2014 }} Recently {{?? it.article.year >= 1990 }} After 1990 {{??}} Long since {{?}}</h2><div class=content>{{!it.article.content}}</div></article><footer>Copyright by {{=it.author}}</footer>'
}

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

data.gte2014 = data.article.year >= 2014
data.gte1990 = data.article.year < 2014 && data.article.year > 1990

var suite = new Benchmark.Suite()

suite
  .add('jayce', function () {
    jayce.render(template.jayce, data)
  })
  .add('handlebars', function () {
    handlebars.compile(template.handlebars)(data)
  })
  .add('mustache', function () {
    mustache.render(template.mustache, data)
  })
  .add('art', function () {
    art.compile(template.art)(data)
  })
  .add('dot', function () {
    dot.template(template.dot)(data)
  })
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').pluck('name'));
  })
  .run({ 'async': true });
