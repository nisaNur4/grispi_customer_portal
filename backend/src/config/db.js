const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoDB = process.env.MONGODB || process.env.MONGODB_URI || 'mongodb://localhost:27017/grispi_portal';
    const conn = await mongoose.connect(mongoDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Bağlı: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Bağlantı hatası: ${error.message}`);
    console.error('MongoDB çalıştığından emin olun.');
    process.exit(1);
  }
};
module.exports = connectDB;