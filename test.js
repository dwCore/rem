const tape = require('tape')
const dwrem = require('./')

tape('dwREM Tests: dPack File Write/Read', function (t) {
  const dPackFile = dwrem()

  dPackFile.dPackWrite(0, Buffer.from('hello'), function (err) {
    t.error(err, 'dwREM Test Failed! ')
    dPackFile.dPackRead(0, 5, function (err, buf) {
      t.error(err, 'dwREM Test Failed! ')
      t.same(buf, Buffer.from('hello'))
      t.end()
    })
  })
})

tape('dwREM Tests: dPack File Read Empty', function (t) {
  const dPackFile = dwrem()

  dPackFile.dPackRead(0, 0, function (err, buf) {
    t.error(err, 'dwREM Test Failed! ')
    t.same(buf, Buffer.alloc(0), 'empty buffer')
    t.end()
  })
})

tape('dwREM Tests: dPack File Read Range > dPack File', function (t) {
  const dPackFile = dwrem()

  dPackFile.dPackRead(0, 5, function (err, buf) {
    t.ok(err, 'dwREM Test Failed! Did Not Pass Quality Requirement!')
    t.end()
  })
})

tape('dwREM Tests: dPack File Random Entry Write/Read', function (t) {
  const dPackFile = dwrem()

  dPackFile.dPackWrite(10, Buffer.from('hi'), function (err) {
    t.error(err, 'dwREM Test Failed! ')
    dPackFile.dPackWrite(0, Buffer.from('hello'), function (err) {
      t.error(err, 'dwREM Test Failed! ')
      dPackFile.dPackRead(10, 2, function (err, buf) {
        t.error(err, 'dwREM Test Failed! ')
        t.same(buf, Buffer.from('hi'))
        dPackFile.dPackRead(0, 5, function (err, buf) {
          t.error(err, 'dwREM Test Failed! ')
          t.same(buf, Buffer.from('hello'))
          dPackFile.dPackRead(5, 5, function (err, buf) {
            t.error(err, 'dwREM Test Failed! ')
            t.same(buf, Buffer.from([0, 0, 0, 0, 0]))
            t.end()
          })
        })
      })
    })
  })
})

tape('dwREM Tests: dPack File Buffer Constructor', function (t) {
  const dPackFile = dwrem(Buffer.from('contents'))

  dPackFile.dPackRead(0, 7, function (err, buf) {
    t.error(err)
    t.deepEqual(buf, Buffer.from('content'))
    t.end()
  })
})
