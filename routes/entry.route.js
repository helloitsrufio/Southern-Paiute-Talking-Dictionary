const express = require('express')
const router = express.Router()
const entryController = require('../controllers/entry.controller.js')

router.get('/searchResults', entryController.getSearchResults)

router.get('/word/:id', entryController.getID)

router.put('/updateEntry', entryController.updateEntry)

router.get('/input', entryController.getInputPage)

router.get('/update', entryController.updateInputPage)

router.post("/addEntry", entryController.addEntry)

router.get('/entryAdded', entryController.entryAdded)

module.exports = router