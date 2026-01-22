const mongoose = require('mongoose');

const qrPaymentSchema = new mongoose.Schema({
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
  totalAmount: {
    type: Number,
    required: false, // Total amount of the order (for advance payments)
  },
  amountPaid: {
    type: Number,
    required: true, // Amount actually paid in this transaction
  },
  productDetails: {
    type: Array,
    required: true,
  },
  receiptUrl: {
    type: String,
    required: false, // Keep for backward compatibility
  },
  receiptImage: {
    data: String, // Base64 encoded image
    contentType: String, // image/jpeg, image/png, etc.
  },
  paymentType: {
    type: String,
    enum: ['full', 'advance', 'clearance'],
    default: 'full',
  },
  paymentStatus: {
    type: String,
    enum: ['Full Payment', '50% Advance Payment', 'Clearance Payment'],
    default: 'Full Payment',
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const dotenv = require('dotenv');
dotenv.config();

// Create a separate connection for QR Code Payments
const qrPaymentDB = mongoose.createConnection(process.env.MONGODB_URI, {
    dbName: 'QR-Code-Payment'
});

qrPaymentDB.on('connected', () => {
    console.log('Connected to QR-Code-Payment database');
});

qrPaymentDB.on('error', (err) => {
    console.error('QR-Code-Payment database connection error:', err);
});

module.exports = qrPaymentDB.model('QRPayment', qrPaymentSchema);
