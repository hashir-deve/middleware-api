const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerInfoSchema = new Schema({
  customerId: {
    type: String,
    required: true
  },
  customerNumber: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('customerInfo', customerInfoSchema);