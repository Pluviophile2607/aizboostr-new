const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  productDetails: {
    type: Array,
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
  },
  paymentId: {
    type: String, // Razorpay Payment ID
  },
  status: {
    type: String,
    default: 'success',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const dotenv = require('dotenv');
dotenv.config();

// Create a separate connection for Payment Records
const paymentDB = mongoose.createConnection(process.env.MONGODB_URI, {
    dbName: 'Payment-Records'
});

paymentDB.on('connected', () => {
    console.log('Connected to Payment-Records database');
});

module.exports = paymentDB.model('Payment', paymentSchema);
