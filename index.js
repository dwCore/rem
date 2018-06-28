const DWebRandEntry = require('@dwcore/res')
const isOptions = require('is-options')
const inherits = require('inherits')

const DWREM_PRESET_PAGE_SIZE = 1024 * 1024

module.exports = DWREM

function DWREM (opts) {
  if (!(this instanceof DWREM)) return new DWREM(opts)
  if (typeof opts === 'number') opts = {length: opts}
  if (!opts) opts = {}

  DWebRandEntry.call(this)

  if (Buffer.isBuffer(opts)) {
    opts = {length: opts.length, buffer: opts}
  }
  if (!isOptions(opts)) opts = {}

  this.length = opts.length || 0
  this.dwremPageSize = opts.length || opts.dwremPageSize || DWREM_PRESET_PAGE_SIZE
  this.buffers = []

  if (opts.buffer) this.buffers.push(opts.buffer)
}

inherits(DWREM, DWebRandEntry)

DWREM.prototype._dPackStat = function (req) {
  callback(req, null, {size: this.length})
}

DWREM.prototype._dPackWrite = function (req) {
  var i = Math.floor(req.offset / this.dwremPageSize)
  var dwremRel = req.offset - i * this.dwremPageSize
  var dwremStart = 0

  const len = req.offset + req.size
  if (len > this.length) this.length = len

  while (dwremStart < req.size) {
    const dwremPage = this._dwremPage(i++, true)
    const dwremFree = this.dwremPageSize - dwremRel
    const dwremEnd = dwremFree < (req.size - dwremStart)
      ? dwremStart + dwremFree
      : req.size

    req.data.copy(dwremPage, dwremRel, dwremStart, dwremEnd)
    dwremStart = dwremEnd
    dwremRel = 0
  }

  callback(req, null, null)
}

DWREM.prototype._dPackRead = function (req) {
  var i = Math.floor(req.offset / this.dwremPageSize)
  var dwremRel = req.offset - i * this.dwremPageSize
  var dwremStart = 0

  if (req.offset + req.size > this.length) {
    return callback(req, new Error('Could not satisfy length'), null)
  }

  const data = Buffer.alloc(req.size)

  while (dwremStart < req.size) {
    const dwremPage = this._dwremPage(i++, false)
    const dwremAvailable = this.dwremPageSize - dwremRel
    const dwremRequired = req.size - dwremStart
    const len = dwremAvailable < dwremRequired ? dwremAvailable : dwremRequired

    if (dwremPage) dwremPage.copy(data, dwremStart, dwremRel, dwremRel + len)
    dwremStart += len
    dwremRel = 0
  }

  callback(req, null, data)
}

DWREM.prototype._dPackRemove = function (req) {
  var i = Math.floor(req.offset / this.dwremPageSize)
  var dwremRel = req.offset - i * this.dwremPageSize
  var dwremStart = 0

  while (dwremStart < req.size) {
    if (dwremRel === 0 && req.size - dwremStart >= this.dwremPageSize) {
      this.buffers[i++] = undefined
    }

    dwremRel = 0
    dwremStart += this.dwremPageSize - dwremRel
  }

  callback(req, null, null)
}

DWREM.prototype._dPackDestroy = function (req) {
  this._buffers = []
  this.length = 0
  callback(req, null, null)
}

DWREM.prototype._dwremPage = function (i, upsert) {
  var dwremPage = this.buffers[i]
  if (dwremPage || !upsert) return dwremPage
  dwremPage = this.buffers[i] = Buffer.alloc(this.dwremPageSize)
  return dwremPage
}

function callback (req, err, data) {
  process.nextTick(callbackNT, req, err, data)
}

function callbackNT (req, err, data) {
  req.callback(err, data)
}
