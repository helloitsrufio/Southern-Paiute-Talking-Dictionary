const express = require("express");
const router = express.Router();
const entryController = require("../controllers/entry.controller.js");
const { ensureAuth, ensureWhitelist } = require("../middleware/auth");

router.get("/word/:id", entryController.getID);

router.get("/word", entryController.getSearchResults);

router.post("/word", ensureAuth, ensureWhitelist, entryController.addEntry);

// TODO: use PATCH /word/:id
router.post(
  "/word/:id/update",
  ensureAuth,
  ensureWhitelist,
  entryController.updateEntry
);

// TODO: use DELETE /word/:id
//TODO: Need to make this delete, can do so successfully if you incorporate ajax/axios and fetch
router.post(
  "/word/:id/delete",
  ensureAuth,
  ensureWhitelist,
  entryController.deleteEntry
);

//different pages. not related to the db
router.get(
  "/word/:id/edit",
  ensureAuth,
  ensureWhitelist,
  entryController.updateInputPage
);

router.get("/input", ensureAuth, ensureWhitelist, entryController.getInputPage);

router.get("/entryAdded", entryController.entryAdded);

module.exports = router;
