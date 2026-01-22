const express = require('express');
const router = express.Router();
const QRPayment = require('../models/QRPayment');
const Payment = require('../models/Payment');

// Admin credentials (hardcoded as requested)
const ADMIN_EMAIL = 'aizadmin@aizboostr.com';
const ADMIN_PASSWORD = 'aizadmin';

// @route   POST api/admin/login
// @desc    Admin login
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  console.log('Admin login attempt:', { email, password, body: req.body });

  try {
    // Check credentials
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      res.json({
        success: true,
        message: 'Login successful',
        admin: {
          email: ADMIN_EMAIL,
          role: 'admin'
        }
      });
    } else {
      console.log('Invalid credentials - expected:', { email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/admin/stats
// @desc    Get payment statistics
// @access  Admin only (simplified - no token validation for now)
router.get('/stats', async (req, res) => {
  try {
    // Get all QR payments
    const qrPayments = await QRPayment.find();
    
    // Get all Razorpay payments (if any)
    const razorpayPayments = await Payment.find();

    // Calculate total earnings
    const qrEarnings = qrPayments.reduce((sum, payment) => {
      return sum + (payment.amountPaid || payment.amount || 0);
    }, 0);

    const razorpayEarnings = razorpayPayments.reduce((sum, payment) => {
      return sum + (payment.amount || 0);
    }, 0);

    const totalEarnings = qrEarnings + razorpayEarnings;

    // Get unique users (by email)
    const qrUsers = new Set(qrPayments.map(p => p.email));
    const razorpayUsers = new Set(razorpayPayments.map(p => p.email));
    const allUsers = new Set([...qrUsers, ...razorpayUsers]);
    const totalUsers = allUsers.size;

    // Payment breakdown
    const fullPayments = qrPayments.filter(p => p.paymentType === 'full').length;
    const advancePayments = qrPayments.filter(p => p.paymentType === 'advance').length;
    const clearancePayments = qrPayments.filter(p => p.paymentType === 'clearance').length;

    // Status breakdown
    const pendingPayments = qrPayments.filter(p => p.status === 'pending').length;
    const verifiedPayments = qrPayments.filter(p => p.status === 'verified').length;
    const rejectedPayments = qrPayments.filter(p => p.status === 'rejected').length;

    // Recent payments (last 5)
    const recentPayments = qrPayments
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(payment => ({
        id: payment._id,
        name: payment.name,
        email: payment.email,
        amount: payment.amountPaid || payment.amount,
        totalAmount: payment.totalAmount || payment.amount,
        paymentStatus: payment.paymentStatus,
        status: payment.status,
        createdAt: payment.createdAt
      }));

    res.json({
      success: true,
      stats: {
        totalEarnings,
        totalUsers,
        totalPayments: qrPayments.length + razorpayPayments.length,
        qrPayments: qrPayments.length,
        razorpayPayments: razorpayPayments.length,
        paymentBreakdown: {
          full: fullPayments,
          advance: advancePayments,
          clearance: clearancePayments
        },
        statusBreakdown: {
          pending: pendingPayments,
          verified: verifiedPayments,
          rejected: rejectedPayments
        },
        recentPayments
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/admin/payments
// @desc    Get all payments with details
// @access  Admin only
router.get('/payments', async (req, res) => {
  try {
    const payments = await QRPayment.find()
      .sort({ createdAt: -1 })
      .select('-receiptImage.data'); // Exclude image data for performance

    const paymentsWithImageInfo = payments.map(payment => ({
      ...payment.toObject(),
      hasReceipt: !!payment.receiptImage?.data,
      receiptType: payment.receiptImage?.contentType
    }));

    res.json({
      success: true,
      payments: paymentsWithImageInfo
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/admin/payment/:id/receipt
// @desc    Get payment receipt image
// @access  Admin only
router.get('/payment/:id/receipt', async (req, res) => {
  try {
    const payment = await QRPayment.findById(req.params.id);
    
    if (!payment || !payment.receiptImage || !payment.receiptImage.data) {
      return res.status(404).json({
        success: false,
        message: 'Receipt not found'
      });
    }

    res.json({
      success: true,
      receipt: payment.receiptImage.data,
      contentType: payment.receiptImage.contentType
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
