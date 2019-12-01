# patchql-over-stdio-example

> Talk to patchql over stdio via json-rpc. It's like native bindings but easier.


## Usage

```js
const CreatePatchql = require('patchql-over-stdio-example')
const patchql = CreatePatchql() //TODO opts

// Our graphql query
const cursorQuery = '{dbCursor}'

patchql.query(cursorQuery, console.log)

```


with an empty db it will log something like:
```
{ data: { dbCursor: null } }
```

## API

```js
var CreatePatchql = require('patchql-over-stdio-example')
const patchql = CreatePatchql() //TODO opts
```

See [api_formatting.md](api_formatting.md) for tips.

## Install

With [npm](https://npmjs.org/) installed, run

```
$ npm install patchql-over-stdio-example
```

## Acknowledgments

patchql-over-stdio-example was inspired by..

## See Also

- [`noffle/common-readme`](https://github.com/noffle/common-readme)
- ...

## License

AGPL-3.0

