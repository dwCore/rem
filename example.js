const dwrem = require('./index')

const dPackMem = dwrem()

dPackMemStorage.dPackWrite(0, Buffer.from('Greetings, martian'), function () {
  dPackMemStorage.dPackRead(0, 11, (_, data) => console.log(data.toString()))
})
