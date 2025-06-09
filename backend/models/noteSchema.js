const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    owner: {type: String, required: true},
    category: {type: String, required: false},
    createdAt: {type: Date, default: Date.now}
})

module.exports = mongoose.model('Note', noteSchema)