const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  id: String,
  data: Object,
  ttl: Number,
  created: Date
});

const Session = mongoose.model('Session', SessionSchema);

module.exports = Session;
