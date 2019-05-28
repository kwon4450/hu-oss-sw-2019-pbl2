const mongoose = require('mongoose');

const { Schema } = mongoose;
const userSchema = new Schema({
  nick: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model('User', userSchema);