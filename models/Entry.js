const mongoose = require('mongoose');

const EntrySchema = new mongoose.Schema({
    wordInput: {
        type: String,
        required: true,
    },
    //what is the type on this?
    audioInput: {
        type: String,
        required: true,
    },
    phoneticInput: {
        type: String,
        required: true,
    },
    grammaticalInput: {
        type: String,
        required: true,
    },
    translationInput: {
        type: String,
        required: true,
    },
    exampleInput: {
        type: String,
        required: false,
    },
});

module.exports = mongoose.model('Entry', EntrySchema, 'Entry')
