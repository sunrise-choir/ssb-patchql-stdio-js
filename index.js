const { spawn } = require('child_process')
const { Client } = require('jayson')
const { inherits } = require('util')
const pull = require('pull-stream')
const Push = require('pull-pushable')
const ndjson = require('pull-ndjson')
const stream2pull = require('stream-to-pull-stream')
const path = require('path')
const os = require('os')

const arch = os.arch()
const platform = os.platform()

const system = `${platform}-${arch}`

const builds = [
  'linux-x64',
  'linux-arm64',
  'android-arm64',
  'android-arm',
  'darwin-x64',
  'win32-x64',
  'win32-x32'
]

module.exports = function CreateClient (opts) {
  if (!builds.includes(system)) {
    console.error(`No sbot-patchql builds for your arch ${platform}-${arch}`)
    process.exit()
  }

  const execName = `json_rpc_stdio${platform === 'win32' ? '.exe' : ''}`
  const execPath = path.join(__dirname, 'bin', system, execName)
  const patchql = spawn(execPath, opts)

  const pendingRequest = {}
  const pushable = Push()

  pull(
    stream2pull(patchql.stdout),
    ndjson.parse(),
    pull.drain((response) => {
      pendingRequest[response.id](null, response)
      delete pendingRequest[response.id]
    })
  )

  pull(
    pushable,
    pull.map(JSON.stringify),
    pull.map(s => s + '\n'),
    stream2pull(patchql.stdin, () => {
    })
  )

  const ClientStdio = function (options) {
    if (!(this instanceof ClientStdio)) {
      return new ClientStdio(options)
    }
    Client.call(this, options)
  }

  inherits(ClientStdio, Client)

  ClientStdio.prototype._request = function (request, cb) {
    pendingRequest[request.id] = cb

    pushable.push(request, (err) => console.log('done writing to stdin.', err))
  }

  const client = new ClientStdio()

  function query ({ query, variables }, cb) {
    client.request('query', { query, variables }, cb)
  }
  function close () {
    patchql.kill()
  }

  return {
    query,
    close
  }
}
