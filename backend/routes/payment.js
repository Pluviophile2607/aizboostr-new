const express = require('express');
const router = express.Router();
const multer = require('multer');
const Payment = require('../models/Payment');
const QRPayment = require('../models/QRPayment');
const Invoice = require('../models/Invoice');
const User = require('../models/User');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

const axios = require('axios');

// Google Sheet Web App URL
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxFqO7XzYR1GmlP08wvsBUbXrb1n8cv7VwYTdlTYvssd5ww4YbAFbjPLujDzlS1bVm6ww/exec';

// Helper function to send data to Google Sheet
const sendToGoogleSheet = async (data) => {
    try {
        console.log("=== GOOGLE SHEET UPDATE ===");
        console.log("Sending data:", JSON.stringify(data, null, 2));
        
        const response = await axios.post(GOOGLE_SHEET_URL, data, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 10000 // 10 second timeout
        }); 
        
        console.log("Response Status:", response.status);
        console.log("Response Data:", response.data);
        
        // Google often returns 200 OK with an HTML login page if permissions are wrong
        if (typeof response.data === 'string' && response.data.trim().startsWith('<')) {
            console.error("❌ Failed to update Google Sheet: Received HTML response (likely permission/auth error).");
            console.error("Ensure the Google Apps Script is deployed as 'Web App', Execute as: 'Me', Who has access: 'Anyone'.");
            return;
        }

        console.log("✅ Google Sheet updated successfully.");
        console.log("===========================");
    } catch (error) {
        console.error("❌ Failed to update Google Sheet:", error.message);
        if (error.response) {
            console.error("Error Response:", error.response.status, error.response.data);
        }
        console.log("===========================");
    }
};

// @route   POST api/payment/save
// @desc    Save payment details
// @access  Public (or Private depending on needs, currently handling basic save)
router.post('/save', async (req, res) => {
  const { name, mobileNumber, email, amount, productDetails, transactionId, paymentId, paymentType } = req.body;

  try {
    const newPayment = new Payment({
      name,
      mobileNumber,
      email,
      amount,
      productDetails,
      transactionId,
      paymentId,
      status: paymentType === 'advance' ? 'advance_paid' : (paymentType === 'clearance' ? 'clearance_paid' : 'success')
    });

    const savedPayment = await newPayment.save();

    // Determine payment status label
    let paymentStatusLabel = 'Full Payment';
    if (paymentType === 'advance') {
        paymentStatusLabel = '50% Advance';
    } else if (paymentType === 'clearance') {
        paymentStatusLabel = 'Clearance Payment';
    }

    // Calculate total amount for invoice
    let totalAmount = amount;
    if (paymentType === 'advance') {
        totalAmount = amount * 2; // 50% advance means total is double
    } else if (paymentType === 'clearance') {
        totalAmount = amount * 2; // Clearance is also 50%
    }

    // Generate Invoice
    const newInvoice = new Invoice({
        customerName: name,
        customerEmail: email,
        customerPhone: mobileNumber,
        productDetails: productDetails.map(p => ({
            name: p.name || p.productName || 'Product',
            price: p.price || 0,
            billingCycle: p.billingCycle || 'one-time'
        })),
        totalAmount: totalAmount,
        amountPaid: amount,
        paymentStatus: paymentStatusLabel,
        paymentMode: 'razorpay',
        paymentId: paymentId || transactionId
    });

    const savedInvoice = await newInvoice.save();

    // Update User Pending Payment Status
    if (paymentType === 'advance') {
        // Find user and update pending payment
        // We assume 50% paid, so remaining is same amount
        await User.findOneAndUpdate({ email }, {
            pendingPayment: {
                amount: amount, // The pending amount is equal to what was just paid (50%)
                isPending: true,
                originalPaymentId: paymentId,
                productDetails: productDetails
            }
        });
    } else if (paymentType === 'clearance') {
        // Clear pending payment
        await User.findOneAndUpdate({ email }, {
            pendingPayment: {
                amount: 0,
                isPending: false,
                originalPaymentId: null,
                productDetails: []
            }
        });
    } else {
        // Full payment - ensure no pending state just in case (optional, but safer)
        await User.findOneAndUpdate({ email }, {
             pendingPayment: {
                amount: 0,
                isPending: false,
                originalPaymentId: null,
                productDetails: []
            }
        });
    }
    
    // --- SEND TO GOOGLE SHEET ---
    const sheetData = {
        productName: productDetails.map(p => p.name || p.productName || 'Product').join(', '),
        paymentMode: 'Razorpay',
        paymentStatus: paymentStatusLabel,
        userName: name,
        userEmail: email
    };
    
    // Send asynchronously without awaiting to avoid blocking response
    sendToGoogleSheet(sheetData);
    // ---------------------------

    res.json({ ...savedPayment.toObject(), invoiceId: savedInvoice._id, invoiceNumber: savedInvoice.invoiceNumber });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/payment/history
// @desc    Get all payment history
// @access  Public (Should be private in production)
router.get('/history', async (req, res) => {
    try {
        const payments = await Payment.find().sort({ createdAt: -1 });
        res.json(payments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/payment/qr-payment
// @desc    Save QR code payment with receipt image
// @access  Public
router.post('/qr-payment', upload.single('receiptImage'), async (req, res) => {
  const { name, mobileNumber, email, amount, productDetails, paymentType } = req.body;

  try {
    // Validate required fields
    if (!req.file) {
      return res.status(400).json({ message: 'Receipt image is required for QR payments' });
    }

    // Convert image to Base64
    const receiptImageBase64 = req.file.buffer.toString('base64');
    
    console.log('Received QR payment request:', {
      name,
      email,
      amount,
      paymentType,
      imageSize: req.file.size,
      imageType: req.file.mimetype
    });

    // Calculate amounts based on payment type
    let totalAmount;
    let amountPaid = parseFloat(amount);
    let paymentStatus;

    if (paymentType === 'advance') {
      // For advance payment, the amount paid is 50% of total
      // So total = amount * 2
      totalAmount = amountPaid * 2;
      paymentStatus = '50% Advance Payment';
    } else if (paymentType === 'clearance') {
      // For clearance, amount paid is the remaining 50%
      totalAmount = amountPaid * 2; // Reconstructing total
      paymentStatus = 'Clearance Payment';
    } else {
      // Full payment
      totalAmount = amountPaid;
      paymentStatus = 'Full Payment';
    }

    const products = JSON.parse(productDetails);

    const newQRPayment = new QRPayment({
      name,
      mobileNumber,
      email,
      amount: amountPaid, // Keep for backward compatibility
      totalAmount: totalAmount,
      amountPaid: amountPaid,
      productDetails: products, // Parse JSON string
      receiptImage: {
        data: receiptImageBase64,
        contentType: req.file.mimetype
      },
      paymentType: paymentType || 'full',
      paymentStatus: paymentStatus,
      status: 'pending' // QR payments need manual verification
    });

    const savedQRPayment = await newQRPayment.save();

    // Update User Pending Payment Status (same logic as Razorpay)
    if (paymentType === 'advance') {
        await User.findOneAndUpdate({ email }, {
            pendingPayment: {
                amount: parseFloat(amount),
                isPending: true,
                originalPaymentId: savedQRPayment._id.toString(),
                productDetails: products
            }
        });
    } else if (paymentType === 'clearance') {
        await User.findOneAndUpdate({ email }, {
            pendingPayment: {
                amount: 0,
                isPending: false,
                originalPaymentId: null,
                productDetails: []
            }
        });
    } else {
        // Full payment - clear any pending state
        await User.findOneAndUpdate({ email }, {
             pendingPayment: {
                amount: 0,
                isPending: false,
                originalPaymentId: null,
                productDetails: []
            }
        });
    }

    // Determine payment status label for invoice
    let invoicePaymentStatus = 'Full Payment';
    if (paymentType === 'advance') {
        invoicePaymentStatus = '50% Advance';
    } else if (paymentType === 'clearance') {
        invoicePaymentStatus = 'Clearance Payment';
    }

    // Generate Invoice for QR Payment
    const newInvoice = new Invoice({
        customerName: name,
        customerEmail: email,
        customerPhone: mobileNumber,
        productDetails: products.map(p => ({
            name: p.name || p.productName || 'Product',
            price: p.price || 0,
            billingCycle: p.billingCycle || 'one-time'
        })),
        totalAmount: totalAmount,
        amountPaid: amountPaid,
        paymentStatus: invoicePaymentStatus,
        paymentMode: 'qrcode',
        paymentId: savedQRPayment._id.toString()
    });

    const savedInvoice = await newInvoice.save();

    // --- SEND TO GOOGLE SHEET ---
    const sheetData = {
        productName: products.map(p => p.name || p.productName || 'Product').join(', '),
        paymentMode: 'QR Code',
        paymentStatus: invoicePaymentStatus,
        userName: name,
        userEmail: email
    };
    
    // Send asynchronously 
    sendToGoogleSheet(sheetData);
    // ---------------------------

    res.json({
      success: true,
      payment: {
        ...savedQRPayment.toObject(),
        receiptImage: { contentType: savedQRPayment.receiptImage.contentType } // Don't send Base64 back
      },
      invoiceId: savedInvoice._id,
      invoiceNumber: savedInvoice.invoiceNumber,
      message: 'QR payment submitted successfully. Payment is pending verification.'
    });
  } catch (err) {
    console.error('QR Payment Error:', err.message);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// @route   POST api/payment/create-order
// @desc    Create Razorpay Order
// @access  Private (Registered users)
router.post('/create-order', async (req, res) => {
    try {
        const { amount, currency = "INR" } = req.body;

        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            return res.status(500).json({ message: "Razorpay keys not configured" });
        }

        const Razorpay = require('razorpay');
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        const options = {
            amount: amount, // Amount in lowest denomination (paise)
            currency: currency,
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        if (!order) {
            return res.status(500).send("Some error occurred");
        }

        res.json(order);
    } catch (error) {
        console.error("Razorpay Order Error:", error);
        res.status(500).send(error);
    }
});

// @route   POST api/payment/verify-payment
// @desc    Verify Razorpay Payment Signature
// @access  Public
router.post('/verify-payment', async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        if (!process.env.RAZORPAY_KEY_SECRET) {
             return res.status(500).json({ message: "Razorpay secret not configured" });
        }

        const crypto = require('crypto');
        const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
        
        hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
        const generated_signature = hmac.digest("hex");

        if (generated_signature === razorpay_signature) {
            // Payment is successful
            res.json({
                success: true,
                message: "Payment verified successfully",
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Invalid signature"
            });
        }
    } catch (error) {
         console.error("Payment Verification Error:", error);
         res.status(500).send("Internal Server Error");
    }
});

// @route   GET api/payment/invoice/:invoiceId
// @desc    Get invoice by ID
// @access  Public
router.get('/invoice/:invoiceId', async (req, res) => {
    try {
        const { invoiceId } = req.params;
        
        const invoice = await Invoice.findById(invoiceId);
        
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        
        res.json(invoice);
    } catch (error) {
        console.error('Invoice Fetch Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;
