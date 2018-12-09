const mongoose = require('mongoose');

const {Schema} = mongoose;

const locationSchema = new Schema({
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point',
    required: true
  },
  coordinates: {
    type: [Number],
    index: '2dsphere', //index on coords for faster searches
    required: true
  }
});

const shopSchema = new Schema({ 
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  po: { type: String, required: true },
  location: {type: locationSchema, required: true },
  withdrawalLimit: { type: Number, required: true }
});

const Shop = mongoose.model('Shop', shopSchema);

module.exports = Shop;