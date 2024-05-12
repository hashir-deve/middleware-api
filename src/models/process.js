const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const processSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  sourceUrl: {
    type: String,
    required: true
  },
  processes: {
    type: Array,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('process', processSchema);