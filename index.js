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
const User = require("./models/user");

const app = express();
const port = 3000;

const MemoryStore = require("memorystore")(session);
const bcrypt = require("bcrypt");

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

//router contact
app.use("/contact", require("./routes/contact"));

app.get("/auth/register", (req, res) => {
  res.render("auth/register", {
    layout: "layouts/main-layout",
    title: "Register",
    errors: req.flash("errors"),
    msg: req.flash("msg"),
  });
});

//PROSERS REGISTER
app.post(
  "/auth/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Email tidak valid").isEmail(),
    check("password", "Password minimal 5 karakter").isLength({ min: 5 }),
  ],
  check("nohp", "Nomor Handphone tidak valid").isMobilePhone("id-ID"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(req.body);
      res.render("auth/register", {
        layout: "layouts/main-layout",
        title: "Register",
        errors: errors.array(),
      });
    } else {
      const { name, email, password, nohp } = req.body;
      const hash = bcrypt.hashSync(password, 10);
      const user = new User({
        name,
        email,
        nohp,
        password: hash,
      });
      const duplikat = await User.findOne({ email });
      console.log(duplikat);
      if (duplikat) {
        req.flash("msg", "Register gagal , Email sudah terdaftar");
        res.redirect("/auth/register");
      } else {
        try {
          await user.save();
          req.flash("msg", "Register Berhasil silahkan login");
          res.redirect("/auth/login");
        } catch (error) {
          req.flash("errors", error.message);
          res.redirect("/auth/register");
        }
      }
    }
  }
);

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
