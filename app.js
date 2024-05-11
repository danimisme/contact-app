const express = require("express");
const expressLayouts = require("express-ejs-layouts");

const { body, validationResult, check } = require("express-validator");
const methodOverride = require("method-override");

const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

require("./utils/db");
const Contact = require("./models/contact");
const { ObjectID } = require("mongodb");

const app = express();
const port = 3000;

//setup method override
app.use(methodOverride("_method"));

//Set up View Engine
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

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

//Halaman Contact
app.get("/contact", async (req, res) => {
  const contacts = await Contact.find();
  res.render("contact", {
    layout: "layouts/main-layout",
    title: "Contact List",
    contacts,
    msg: req.flash("msg"),
  });
});

//Halaman form tambah data contact
app.get("/contact/add", (req, res) => {
  res.render("add-contact", {
    layout: "layouts/main-layout",
    title: "Add Contact",
  });
});

//proses add data contact
app.post(
  "/contact",
  [
    body("nama").custom(async (value) => {
      const duplikat = await Contact.findOne({ nama: value });
      if (duplikat) {
        throw new Error("Contact sudah terdaftar");
      }
      return true;
    }),
    check("email", "Email tidak valid").isEmail(),
    check("nohp", "Nomor Handphone tidak valid").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("add-contact", {
        layout: "layouts/main-layout",
        title: "Add Contact",
        errors: errors.array(),
      });
    } else {
      Contact.insertMany(req.body, (error, result) => {
        req.flash("msg", "Data contact berhasil ditambahkan");
        res.redirect("/contact");
      });
    }
  }
);

//proses delete contact
app.delete("/contact", (req, res) => {
  Contact.deleteOne({ _id: req.body.id }).then((result) => {
    req.flash("msg", "Data contact berhasil dihapus");
    res.redirect("/contact");
  });
});

//halaman form ubah data contact
app.get("/contact/edit/:id", async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  res.render("edit-contact", {
    layout: "layouts/main-layout",
    title: "Edit Contact",
    contact,
  });
});

//Halaman Detail Contact
app.get("/contact/:id", async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  res.render("detail", {
    layout: "layouts/main-layout",
    title: "Contact Detail",
    contact,
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
