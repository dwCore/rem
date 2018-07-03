const tape = require('tape')
const dwrem = require('./')

tape('dwREM Tests: dWeb File Write/Read', function (t) {
  const dWebFile = dwrem()

  dWebFile.dWebWrite(0, Buffer.from('hello'), function (err) {
    t.error(err, 'dwREM Test Failed! ')
    dWebFile.dWebRead(0, 5, function (err, buf) {
      t.error(err, 'dwREM Test Failed! ')
      t.same(buf, Buffer.from('hello'))
      t.end()
    })
  })
})

tape('dwREM Tests: dWeb File Read Empty', function (t) {
  const dWebFile = dwrem()

  dWebFile.dWebRead(0, 0, function (err, buf) {
    t.error(err, 'dwREM Test Failed! ')
    t.same(buf, Buffer.alloc(0), 'empty buffer')
    t.end()
  })
})

tape('dwREM Tests: dWeb File Read Range > dWeb File', function (t) {
  const dWebFile = dwrem()

  dWebFile.dWebRead(0, 5, function (err, buf) {
    t.ok(err, 'dwREM Test Failed! Did Not Pass Quality Requirement!')
    t.end()
  })
})

tape('dwREM Tests: dWeb File Random Entry Write/Read', function (t) {
  const dWebFile = dwrem()

  dWebFile.dWebWrite(10, Buffer.from('hi'), function (err) {
    t.error(err, 'dwREM Test Failed! ')
    dWebFile.dWebWrite(0, Buffer.from('hello'), function (err) {
      t.error(err, 'dwREM Test Failed! ')
      dWebFile.dWebRead(10, 2, function (err, buf) {
        t.error(err, 'dwREM Test Failed! ')
        t.same(buf, Buffer.from('hi'))
        dWebFile.dWebRead(0, 5, function (err, buf) {
          t.error(err, 'dwREM Test Failed! ')
          t.same(buf, Buffer.from('hello'))
          dWebFile.dWebRead(5, 5, function (err, buf) {
            t.error(err, 'dwREM Test Failed! ')
            t.same(buf, Buffer.from([0, 0, 0, 0, 0]))
            t.end()
          })
        })
      })
    })
  })
})

tape('dwREM Tests: dWeb File Buffer Constructor', function (t) {
  const dWebFile = dwrem(Buffer.from('contents'))

  dWebFile.dWebRead(0, 7, function (err, buf) {
    t.error(err)
    t.deepEqual(buf, Buffer.from('content'))
    t.end()
  })
})
