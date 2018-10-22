const mongoose = require('mongoose')
var uniquevalidate = require('mongoose-unique-validator')
let Schema = mongoose.Schema;
let saveSchema = new Schema({
  name: {
    type: String,
    require: true
    },
  type: {
    type: String,

  },
  data: {
    type: String,
    
  }
})
saveSchema.plugin(uniquevalidate, {
  message: '{PATH} debe ser unico '
})

module.exports = mongoose.model('Save', saveSchema);