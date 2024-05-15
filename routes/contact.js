const express = require("express");
const router = express.Router();
const { body, validationResult, check } = require("express-validator");
const Contact = require("../models/contact");

//Halaman Contact
router.get("/", async (req, res) => {
  const contacts = await Contact.find();
  res.render("contact", {
    layout: "layouts/main-layout",
    title: "Contact List",
    contacts,
    msg: req.flash("msg"),
  });
});

//Halaman form tambah data contact
router.get("/add", (req, res) => {
  res.render("add-contact", {
    layout: "layouts/main-layout",
    title: "Add Contact",
  });
});

//proses add data contact
router.post(
  "/",
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
router.delete("/", (req, res) => {
  Contact.deleteOne({ _id: req.body.id }).then((result) => {
    req.flash("msg", "Data contact berhasil dihapus");
    res.redirect("/contact");
  });
});

//halaman form ubah data contact
router.get("/edit/:id", async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  res.render("edit-contact", {
    layout: "layouts/main-layout",
    title: "Edit Contact",
    contact,
  });
});

//proses ubah data contact
router.put(
  "/",
  [
    body("nama").custom(async (value, { req }) => {
      const duplikat = await Contact.findOne({ nama: value });
      if (value !== req.body.oldNama && duplikat) {
        throw new Error(`Contact ${value} sudah terdaftar`);
      }
      return true;
    }),
    check("email", "Email tidak valid").isEmail(),
    check("nohp", "Nomor Handphone tidak valid").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("edit-contact", {
        layout: "layouts/main-layout",
        title: "Edit Contact",
        errors: errors.array(),
        contact: req.body,
      });
    } else {
      Contact.updateOne(
        { _id: req.body.id },
        {
          $set: {
            nama: req.body.nama,
            email: req.body.email,
            nohp: req.body.nohp,
          },
        }
      ).then((result) => {
        req.flash("msg", "Data contact berhasil diubah");
        res.redirect("/contact");
      });
    }
  }
);

//Halaman Detail Contact
router.get("/:id", async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  res.render("detail", {
    layout: "layouts/main-layout",
    title: "Contact Detail",
    contact,
  });
});

module.exports = router;
