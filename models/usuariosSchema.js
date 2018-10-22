const mongoose = require('mongoose')
var uniquevalidate = require('mongoose-unique-validator')

let Schema = mongoose.Schema;

let rolesValidos = {
  values: ['ADMIN_ROL', 'USER_ROL'],
  message: '{VALUE} NO ES UN ROL VALIDO'
}

let usuarioSchema = new Schema({

  nombre: {
    type: String,
    require: true
  },
  email: {
    type: String,
    unique: true,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  img: {
    type: String,
    required: false

  },
  role: {
    type: String,
    default: "USER_ROL",
    enum: rolesValidos

  },
  estado: {
    type: Boolean,
    required: false,
    default: true

  },
  google: {
    type: Boolean,
    required: false,
    default: true


  },
  nivel: {
    type: Number,


  },
  mes: {
    type: String,

  },
  charts: {
    type: String,

  },
  anio: {
    type: Number,

  },
  poblacion: {
    type: String,

  }







})
usuarioSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.password;
  return obj;
}
usuarioSchema.plugin(uniquevalidate, {
  message: '{PATH} debe ser unico '
})

module.exports = mongoose.model('Usuario ', usuarioSchema);