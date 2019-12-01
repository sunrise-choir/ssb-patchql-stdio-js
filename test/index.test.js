const test = require('tape')
const CreateClient = require('../')

const cursorQuery = '{dbCursor}'

test('start and stop is ok', function (t) {
  const client = CreateClient()
  client.close()
  t.ok(true)
  t.end()
})

test('send a graphql query', function (t) {
  const client = CreateClient()

  client.query({
    query: cursorQuery
  }, (err, result) => {
    t.error(err)
    t.ok(result.data)
    t.end()
    client.close()
  })
})
