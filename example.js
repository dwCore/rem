const DWREM = require('./index')

const storage = DWREM()

storage.write(0, Buffer.from('Greetings, martian'), function () {
  storage.read(0, 11, (_, data) => console.log(data.toString()))
})
