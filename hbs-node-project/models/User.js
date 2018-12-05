const mongoose = require('mongoose')

const User = mongoose.model('users', new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    registerDate: {
        type: Date,
        default: Date.now,
    },
}, {
    versionKey: false,
}))

module.exports = User