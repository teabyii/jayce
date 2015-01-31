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

## Syntax

### Variable

Wrap with `{}`, and end with `$`.
  
```html
<div>{content$}</div>
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

Really simple:

```html
<ul>
  {list, item, key@}
    <li>{key$}:{item$}</li>
  {/@}
</ul>
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
