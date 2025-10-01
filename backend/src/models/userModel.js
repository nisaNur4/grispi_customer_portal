const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    ad: { type: String, required: [true, 'Lütfen adınızı girin'] },
    soyad: { type: String, required: [true, 'Lütfen soyadınızı girin'] },
    email: {
      type: String,
      required: [true, 'Lütfen bir e-posta adresi girin'],
      unique: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/, 'Lütfen geçerli bir e-posta adresi girin'],
    },
    password: { type: String, required: [true, 'Lütfen bir parola girin'], minlength: [6, 'Parola en az 6 karakter olmalıdır'] },
    telefon: { type: String },
    adres: { type: String },
    ulke: { type: String },
    sehir: { type: String },
    postaKodu: { type: String },
    webSitesi: { type: String },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
