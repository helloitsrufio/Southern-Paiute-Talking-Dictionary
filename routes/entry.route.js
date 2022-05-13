const express = require('express')
const router = express.Router()
const entryController = require('../controllers/entry.controller.js')

router.get('/searchResults', entryController.getSearchResults)

router.get('/word/:id', entryController.getID)

router.post('/updateEntry/:id', entryController.updateEntry)

router.get('/input', entryController.getInputPage)

router.get('/update-word/:id', entryController.updateInputPage)

router.post("/addEntry", entryController.addEntry)

router.get('/entryAdded', entryController.entryAdded)

//TODO: Need to make this delete, can do so successfully if you incorporate ajax/axios and fetch
router.post('/delete/:id', entryController.deleteEntry)

module.exports = router