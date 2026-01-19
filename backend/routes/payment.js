const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const User = require('../models/User');

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

module.exports = router;
