const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home.controller");
const contactController = require("../controllers/contact.controller");
const alphabetController = require("../controllers/alphabet.controller");
const aboutController = require("../controllers/about.controller");
const formController = require("../controllers/form.controller");
const glossaryController = require("../controllers/glossary.controller");
// const authController = require("../controllers/auth.controller");

router.get("/", homeController.getHomePage);
router.get("/contact", contactController.contact);
router.get("/alphabet", alphabetController.alphabet);
router.get("/about", aboutController.about);
router.post("/send", formController.sendForm);
router.get("/send", formController.getForm);
router.get("/glossary", glossaryController.getGlossary);

module.exports = router;
