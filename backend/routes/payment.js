const express = require('express');
const router = express.Router();
const multer = require('multer');
const Payment = require('../models/Payment');
const QRPayment = require('../models/QRPayment');
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

    res.json(savedPayment);
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

    const newQRPayment = new QRPayment({
      name,
      mobileNumber,
      email,
      amount: amountPaid, // Keep for backward compatibility
      totalAmount: totalAmount,
      amountPaid: amountPaid,
      productDetails: JSON.parse(productDetails), // Parse JSON string
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
                productDetails: JSON.parse(productDetails)
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

    res.json({
      success: true,
      payment: {
        ...savedQRPayment.toObject(),
        receiptImage: { contentType: savedQRPayment.receiptImage.contentType } // Don't send Base64 back
      },
      message: 'QR payment submitted successfully. Payment is pending verification.'
    });
  } catch (err) {
    console.error('QR Payment Error:', err.message);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

module.exports = router;
