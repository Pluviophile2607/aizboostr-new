const mongoose = require('mongoose');

// Function to generate unique invoice number
const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `INV-${year}${month}${day}-${random}`;
};

const invoiceSchema = new mongoose.Schema({
    invoiceNumber: {
        type: String,
        unique: true,
        default: generateInvoiceNumber
    },
    // Customer Details
    customerName: {
        type: String,
        required: true,
    },
    customerEmail: {
        type: String,
        required: true,
    },
    customerPhone: {
        type: String,
        required: true,
    },
    // Product Details
    productDetails: [{
        name: String,
        price: Number,
        billingCycle: String
    }],
    // Payment Information
    totalAmount: {
        type: Number,
        required: true,
    },
    amountPaid: {
        type: Number,
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ['Full Payment', '50% Advance', 'Clearance Payment'],
        required: true,
    },
    paymentMode: {
        type: String,
        enum: ['razorpay', 'qrcode'],
        required: true,
    },
    paymentId: {
        type: String,
        required: true,
    },
    // Metadata
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const dotenv = require('dotenv');
dotenv.config();

// Create a separate connection for Invoice Records
const invoiceDB = mongoose.createConnection(process.env.MONGODB_URI, {
    dbName: 'Invoices'
});

invoiceDB.on('connected', () => {
    console.log('Connected to Invoices database');
});

invoiceDB.on('error', (err) => {
    console.error('Invoices database connection error:', err);
});

module.exports = invoiceDB.model('Invoice', invoiceSchema);
