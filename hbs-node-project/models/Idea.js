const mongoose = require('mongoose')

const Idea = mongoose.model('ideas', new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    detail: {
        type: String,
        required: true,
    },
    createDate: {
        type: Date,
        default: Date.now,
    },
}, {
    versionKey: false,
}))

module.exports = Idea