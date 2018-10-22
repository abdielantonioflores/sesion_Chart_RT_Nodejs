const mongoose = require('mongoose')
var uniquevalidate = require('mongoose-unique-validator')

let Schema = mongoose.Schema;
let typeSchema = new Schema({
  type: {
    type: String,
    require: true,
    unique:true
  }
})
typeSchema.plugin(uniquevalidate, {
  message: '{PATH} debe ser unico '
})

module.exports = mongoose.model('Type ', typeSchema);