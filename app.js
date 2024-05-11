const express = require("express");
const expressLayouts = require("express-ejs-layouts");

const app = express();
const port = 3000;

//Set up View Engine
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

//Halaman Home
app.get("/", (req, res) => {
  res.render("index", {
    layout: "layouts/main-layout",
    title: "Home",
  });
});

//Halaman About
app.get("/about", (req, res) => {
  res.render("about", {
    layout: "layouts/main-layout",
    title: "About",
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
