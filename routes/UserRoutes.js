module.exports = app => {
  // rutas hacia  pantallas Home Usuarios Y el formulario para agregar usuarios

  app.get("/", (req, res) => {
    res.render("index", {
      titulo: "Home"
    });
  });

  app.get("/charts", (req, res) => {
    res.render("charts.ejs", {
      titulo: "Home"
    });
  });

  app.get("/Usuarios", (req, res) => {
    res.render("Usuarios", {
      titulo: "Users"
    });
  });

  app.get("/Usuarios_add", (req, res) => {
    res.render("Usuarios_add", {
      titulo: "Users"
    });
  });

  // app.get("/Censo", (req, res) => {
  //   res.render("Usuarios_Update", {
  //     titulo: "Users"
  //   });
  // });

  //fin de las  vistas de la panatalla
};