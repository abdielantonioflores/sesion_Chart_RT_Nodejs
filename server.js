require('./config/configPort');
const express = require('express');
const app = express();
var compression = require('compression');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const _ = require('underscore')
var morgan = require('morgan')
// const flash = require('flash')
var session = require('express-session')
const flash = require ('express-flash-notification') ;
const {
    url
} = require('./config/configDB');
app.set('trust proxy', 1) // trust first proxy

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}))
app.use(flash(app, {
    sessionName: 'flash',
    utilityName: 'flash',
    localsName: 'flash',
    viewName: 'flash',
    beforeSingleRender: function(item, callback){ callback(null, item) },
    afterAllRender: function(htmlFragments, callback){ callback(null, htmlFragments.join('\n')) }
  }));
// app.use(flash());

app.use(compression());
app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(morgan('dev'));

mongoose.set('useCreateIndex', true)
mongoose.connect(url, {
    useNewUrlParser: true
}, (err) => {
    if (err) throw err;
    console.log('La base de datos esta ONLINE ')
})
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

require('./routes/UserRoutes')(app)
require('./service/serviceGetUsers')(app, bcrypt)
// require('./config/configDB')(mongoose)
app.use(express.static(path.join(__dirname, 'public')));
// parse application/json
app.use(bodyParser.json())

app.listen(port, () => {
    console.log(` Escuchando por el puerto :${port}`);
});