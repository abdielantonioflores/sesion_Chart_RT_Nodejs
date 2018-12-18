/*
###################### Constantes del programa definicion de librerias  #####################
*/
require('./config/configPort');
const express = require('express');
const app = express();
const server = app.listen(port);
const io = require('socket.io').listen(server);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('flash');
const compression = require('compression');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const _ = require('underscore')
const morgan = require('morgan')
const session = require('express-session')
const {
    url
} = require('./config/configDB');


/*
###################### Configuracion de los Middleware #####################
*/
app.use(compression());
app.use(bodyParser.json())
app.use(morgan('dev'));
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}))
app.use(bodyParser.urlencoded({
    extended: false
}))

/*
###################### conexion a mongodb usando mongoose #####################
*/

mongoose.connect(url, {
    useNewUrlParser: true
}, (err) => {
    if (err) throw err;
    console.log('La base de datos esta ONLINE ')
})

mongoose.set('useCreateIndex', true)
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    app.locals.signinMessage = req.flash('signinMessage');
    app.locals.signupMessage = req.flash('signupMessage');
    app.locals.user = req.user;
    // console.log(app.locals)
    next();
});
/*
###################### proxi y rutas Carpetas #####################
*/
app.set('trust proxy', 1)
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(__dirname + '/bower_components'))
require('./routes/UserRoutes')(app, passport, LocalStrategy)
require('./session/users')(passport)
require('./service/serviceGetUsers')(app)

/*
###################### socket comunicacion con los usuarios #####################
*/

io.on('connection', function (socket) {
    socket.on('dataUsers', function (message) {
        socket.broadcast.emit('ChangeRT', {
            message: message
        });
    });
});