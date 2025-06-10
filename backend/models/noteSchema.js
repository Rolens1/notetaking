const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    owner: {type: String, required: true},
    category: {type: String, required: false},
    createdAt: {type: Date, default: Date.now},

    positionX: { type: String, default: null },
    positionY: { type: String, default: null },
})

module.exports = mongoose.model('Note', noteSchema)