const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  pinCode: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },  // Added the type for 'country'
});

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
