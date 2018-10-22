const mongoose = require('mongoose')
var uniquevalidate = require('mongoose-unique-validator')
let Schema = mongoose.Schema;
let chartSchema = new Schema({
  level: {
    type: String
   
  },
  value: {
    type: String
    
  },
  name: {
    type: String,
    unique: true
  }
})
chartSchema.plugin(uniquevalidate, {
  message: '{PATH} debe ser unico '
})
module.exports = mongoose.model('Chart', chartSchema);