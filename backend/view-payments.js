const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Connect to QR-Code-Payment database
const qrPaymentDB = mongoose.createConnection(process.env.MONGODB_URI, {
    dbName: 'QR-Code-Payment'
});

// Define schema (same as QRPayment model)
const qrPaymentSchema = new mongoose.Schema({
  name: String,
  mobileNumber: String,
  email: String,
  amount: Number,
  totalAmount: Number,
  amountPaid: Number,
  productDetails: Array,
  receiptImage: {
    data: String,
    contentType: String,
  },
  paymentType: String,
  paymentStatus: String,
  status: String,
  createdAt: Date,
});

const QRPayment = qrPaymentDB.model('QRPayment', qrPaymentSchema);

async function viewPayments() {
  try {
    console.log('🔍 Fetching payment records from QR-Code-Payment database...\n');
    
    const payments = await QRPayment.find().sort({ createdAt: -1 }).limit(10);
    
    if (payments.length === 0) {
      console.log('📭 No payment records found.\n');
      process.exit(0);
    }
    
    console.log(`📊 Found ${payments.length} payment record(s):\n`);
    console.log('='.repeat(80));
    
    payments.forEach((payment, index) => {
      console.log(`\n💳 Payment #${index + 1}`);
      console.log('-'.repeat(80));
      console.log(`📅 Date: ${payment.createdAt}`);
      console.log(`👤 Name: ${payment.name}`);
      console.log(`📧 Email: ${payment.email}`);
      console.log(`📱 Mobile: ${payment.mobileNumber}`);
      console.log(`💰 Amount Paid: ₹${payment.amountPaid || payment.amount}`);
      console.log(`💵 Total Amount: ₹${payment.totalAmount || payment.amount}`);
      console.log(`📊 Payment Status: ${payment.paymentStatus || 'N/A'}`);
      console.log(`🏷️  Payment Type: ${payment.paymentType}`);
      console.log(`✅ Verification Status: ${payment.status}`);
      console.log(`📦 Products: ${payment.productDetails.length} item(s)`);
      payment.productDetails.forEach((product, idx) => {
        console.log(`   ${idx + 1}. ${product.name || 'N/A'} - ₹${product.price || 'N/A'}`);
      });
      console.log(`🖼️  Receipt Image: ${payment.receiptImage?.data ? `Stored (${payment.receiptImage.contentType})` : 'Not available'}`);
      if (payment.receiptImage?.data) {
        const sizeInKB = (Buffer.from(payment.receiptImage.data, 'base64').length / 1024).toFixed(2);
        console.log(`   Image Size: ${sizeInKB} KB`);
      }
      console.log('-'.repeat(80));
    });
    
    console.log('\n✨ Summary:');
    const fullPayments = payments.filter(p => p.paymentType === 'full').length;
    const advancePayments = payments.filter(p => p.paymentType === 'advance').length;
    const clearancePayments = payments.filter(p => p.paymentType === 'clearance').length;
    const pending = payments.filter(p => p.status === 'pending').length;
    const verified = payments.filter(p => p.status === 'verified').length;
    
    console.log(`   Full Payments: ${fullPayments}`);
    console.log(`   Advance Payments: ${advancePayments}`);
    console.log(`   Clearance Payments: ${clearancePayments}`);
    console.log(`   Pending Verification: ${pending}`);
    console.log(`   Verified: ${verified}`);
    console.log('='.repeat(80));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await qrPaymentDB.close();
    process.exit(0);
  }
}

// Run when database is connected
qrPaymentDB.once('open', () => {
  console.log('✅ Connected to QR-Code-Payment database\n');
  viewPayments();
});

qrPaymentDB.on('error', (err) => {
  console.error('❌ Database connection error:', err.message);
  process.exit(1);
});
