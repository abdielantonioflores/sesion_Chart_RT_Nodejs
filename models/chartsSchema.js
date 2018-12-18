const mongoose = require('mongoose')
let Schema = mongoose.Schema;
let chartSchema = new Schema({
  level: {
    type: String
  },
  value: {
    type: String

  },
  name: {
    type: String
  }
})

module.exports = mongoose.model('Chart', chartSchema);