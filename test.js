const tape = require('tape')
const DWREM = require('./')

tape('DWREM Tests: dWeb File Write/Read', function (t) {
  const file = DWREM()

  file.write(0, Buffer.from('hello'), function (err) {
    t.error(err, 'DWREM Test Failed! ')
    file.read(0, 5, function (err, buf) {
      t.error(err, 'DWREM Test Failed! ')
      t.same(buf, Buffer.from('hello'))
      t.end()
    })
  })
})

tape('DWREM Tests: dWeb File Read Empty', function (t) {
  const file = DWREM()

  file.read(0, 0, function (err, buf) {
    t.error(err, 'DWREM Test Failed! ')
    t.same(buf, Buffer.alloc(0), 'empty buffer')
    t.end()
  })
})

tape('DWREM Tests: dWeb File Read Range > dWeb File', function (t) {
  const file = DWREM()

  file.read(0, 5, function (err, buf) {
    t.ok(err, 'DWREM Test Failed! Did Not Pass Quality Requirement!')
    t.end()
  })
})

tape('DWREM Tests: dWeb File Random Entry Write/Read', function (t) {
  const file = DWREM()

  file.write(10, Buffer.from('hi'), function (err) {
    t.error(err, 'DWREM Test Failed! ')
    file.write(0, Buffer.from('hello'), function (err) {
      t.error(err, 'DWREM Test Failed! ')
      file.read(10, 2, function (err, buf) {
        t.error(err, 'DWREM Test Failed! ')
        t.same(buf, Buffer.from('hi'))
        file.read(0, 5, function (err, buf) {
          t.error(err, 'DWREM Test Failed! ')
          t.same(buf, Buffer.from('hello'))
          file.read(5, 5, function (err, buf) {
            t.error(err, 'DWREM Test Failed! ')
            t.same(buf, Buffer.from([0, 0, 0, 0, 0]))
            t.end()
          })
        })
      })
    })
  })
})

tape('DWREM Tests: dWeb File Buffer Constructor', function (t) {
  const file = DWREM(Buffer.from('contents'))

  file.read(0, 7, function (err, buf) {
    t.error(err)
    t.deepEqual(buf, Buffer.from('content'))
    t.end()
  })
})
