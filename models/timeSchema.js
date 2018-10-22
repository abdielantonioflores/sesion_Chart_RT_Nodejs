const mongoose = require('mongoose')


let Schema = mongoose.Schema;

let censoSchema = new Schema({

  level: {
    type: String,
    require: true
  },
  value: {
    type: String,
    require: true
  },
  name: {
    type: String,
    require: true
  }
})


module.exports = mongoose.model('Censo ', censoSchema);