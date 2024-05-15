const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");

const { body, validationResult, check } = require("express-validator");
const methodOverride = require("method-override");

const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

require("./utils/db");
const Contact = require("./models/contact");

const app = express();
const port = 3000;

const MemoryStore = require("memorystore")(session);

app.use(
  session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    }),
    resave: false,
    secret: "keyboard cat",
  })
);

//setup method override
app.use(methodOverride("_method"));

//Set up View Engine
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.set("layout", path.join(__dirname, "views/layouts"));

//konfigurasi flash
app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

app.use("/contact", require("./routes/contact"));

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
