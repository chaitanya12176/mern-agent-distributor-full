const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./config/db');
const User = require('./models/User');   // ✅ FIXED PATH

(async () => {
  try {
    await connectDB();

    const email = (process.env.ADMIN_EMAIL || 'admin@example.com').toLowerCase();

    let admin = await User.findOne({ email });
    if (admin) {
      console.log('✅ Admin already exists:', admin.email);
      process.exit(0);
    }

    admin = await User.create({
      name: process.env.ADMIN_NAME || 'Admin',
      email,
      mobile: '',
      password: process.env.ADMIN_PASSWORD || 'Admin@123',
      role: 'admin'
    });

    console.log('🎉 Admin created:', admin.email);
    process.exit(0);
  } catch (e) {
    console.error('❌ Error seeding admin:', e);
    process.exit(1);
  }
})();
