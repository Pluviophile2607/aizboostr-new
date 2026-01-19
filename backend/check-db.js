const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const checkDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const users = await User.find({});
    console.log('--- Registered Users ---');
    if (users.length === 0) {
        console.log('No users found.');
    } else {
        users.forEach(user => {
            console.log(`Name: ${user.name}`);
            console.log(`Email: ${user.email}`);
            console.log(`Mobile: ${user.mobileNumber}`);
            console.log(`Google ID: ${user.googleId}`);
            console.log(`Created: ${user.createdAt}`);
            console.log('------------------------');
        });
    }

    mongoose.disconnect();
  } catch (error) {
    console.error('Error checking database:', error);
    process.exit(1);
  }
};

checkDb();
