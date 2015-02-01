# Jayce

Another simple template engine. Just a little different.

## Usage

```shell
npm install jayce
```

```js
var jayce = require('jayce')
var render = jayce.compile(fs.readFileSync('path/to/your/template'))
var data = { ... }
var html = render(data)
```

In browser, you can use `jayce.min.js`, support AMD, CMD, or global mode.

## Syntax

### Variable

Wrap with `{}`, and end with `$`.
  
```html
<div>{content$}</div>
```

### Filters

Make up your filter for variables like this:

```js
jayce.filter('format', function (str) {
  // Your code here
})
```

```html
<div>{content | format $}</div>
```

### Condition

Wrap with `{}` too. And more like this:
  
```html
<p>
  {user < 0?}
    negative
  {user == 0:?}
    zero
  {:?}
    positive
  {/?}
</p>
```

### Traverse

Really simple: (Also support object)

```html
<ul>
  {list, item, key@}
    <li>{key$}:{item$}</li>
  {/@}
</ul>
```

### Html Entities encode

Default, all html entities in variables will be encoded. You can cancel by `#`:

```html
<div>{#content$}</div>
```

## Develop

Now there are some simple test cases in `./test`. Run:

```shell
npm test
```

## TODO

- Easier to debug.
- Functional features.
- More test.
- Benchmark
