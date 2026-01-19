const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  mobileNumber: {
    type: String,
  },
  googleId: {
    type: String,
  },
  pendingPayment: {
    amount: {
      type: Number,
      default: 0
    },
    isPending: {
      type: Boolean,
      default: false
    },
    originalPaymentId: {
      type: String
    },
    productDetails: {
      type: Array
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
