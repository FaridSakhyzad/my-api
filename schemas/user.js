const mongoose = require('mongoose');

const newUserSchema = new mongoose.Schema({
  login: String,
  password: String,
});

const User = mongoose.model('User', newUserSchema);

module.exports = User;
