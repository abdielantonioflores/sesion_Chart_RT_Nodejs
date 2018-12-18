module.exports = (app, passport, LocalStrategy) => {
  // rutas hacia  pantallas Home Usuarios Y el formulario para agregar usuarios
  app.post("/Login", passport.authenticate("local-signin", {
    successRedirect: "/charts",
    failureRedirect: "/",
    failureFlash: true
  }));

  app.get("/", (req, res) => {
    res.render("index", {
      titulo: "Inicio de sesion Charts"
    });
  });

  app.post("/Signup", passport.authenticate("local-signup", {
    successRedirect: "/charts",
    failureRedirect: "/Signup",
    failureFlash: true
  }));
  app.get("/Signup", (req, res) => {
    res.render("Login", {
      titulo: "signup",
      message: req.flash("Signupmessage ")
    });
  });

  app.get('/charts', isAuthenticated, (req, res, next) => {
    res.render('charts.ejs', {
      titulo: "Graficos"
    });

  });

  app.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
  });

  function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/')
  }

  //fin de las  vistas de la panatalla
};