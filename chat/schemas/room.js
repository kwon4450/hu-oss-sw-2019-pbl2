const mongoose = require('mongoose');

const { Schema } = mongoose;
const { Types: { ObjectId } } = Schema;

const max_number = 5;

const roomSchema = new Schema({
    title: {
    type: String,
    required: true,
    },
    max: {
        type: Number,
        required: true,
        default: max_number,
        min: 2,
    },
    master: {
        type: String,
        required: true,
    },
    password: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Room', roomSchema);