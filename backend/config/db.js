const mongoose = require('mongoose'); 

/**
 * Bağlantı başarısız olursa uygulamayı sonlandırır.
 * @returns {Promise<void>} Bağlantı promise'i
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/grispi_portal';
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    
  } catch (error) {
    // Bağlantı hatası durumunda
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('Lütfen MongoDB servisinin çalıştığından emin olun');
    console.error('.env dosyasında MONGO_URI değişkenini kontrol edin');
    // Uygulamayı sonlandır (1 = hata kodu)
    process.exit(1);
  }
};

module.exports = connectDB;

