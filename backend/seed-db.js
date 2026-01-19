const mongoose = require('mongoose');
const Payment = require('./models/Payment');

async function seed() {
    console.log('Waiting for connection...');
    // Give it a moment to connect since the model setup initiates connection
    setTimeout(async () => {
        try {
            console.log('Inserting test record...');
            await Payment.create({
                 name: "System Check",
                 mobileNumber: "0000000000",
                 email: "admin@system.com",
                 amount: 100, 
                 productDetails: [{ name: "Database Initialization" }],
                 transactionId: "init_" + Date.now(),
                 paymentId: "init_" + Date.now(),
                 status: "success"
            });
            console.log('Success! "Payment-Records" database created.');
            process.exit(0);
        } catch(err) {
            console.error('Error:', err);
            process.exit(1);
        }
    }, 2000);
}

seed();
