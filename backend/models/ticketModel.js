const mongoose = require('mongoose'); // MongoDB ODM

const messageSchema = new mongoose.Schema({
  // Mesajı gönderen kişi (Kullanıcı veya Destek)
  gonderen: {
    type: String,
    required: [true, 'Gönderen alanı zorunludur'],
    trim: true, // Başındaki ve sonundaki boşlukları temizle.
    maxlength: [50, 'Gönderen adı 50 karakterden uzun olamaz']
  },
  mesaj: {
    type: String,
    required: [true, 'Mesaj içeriği zorunludur'],
    trim: true,
    maxlength: [1000, 'Mesaj 1000 karakterden uzun olamaz']
  },
  gondermeTarihi: {
    type: Date,
    default: Date.now, 
    required: true
  }
}, {
  timestamps: false 
});

/**
 * Ticket Schema (Ana Şema)
 */
const ticketSchema = new mongoose.Schema({
  // Kullanıcı bilgileri
  kullaniciId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Kullanıcı ID zorunludur']
  },
  kullaniciAdi: {
    type: String,
    required: [true, 'Kullanıcı adı zorunludur'],
    trim: true
  },
  kullaniciEmail: {
    type: String,
    required: [true, 'Kullanıcı email zorunludur'],
    trim: true
  },
  // Talep numarası (T1001, T1002, ...)
  talepNumarasi: {
    type: String,
    required: [true, 'Talep numarası zorunludur'],
    unique: true, // Veri tabanında benzersiz olmalı
    trim: true,
    match: [/^T\d{4,}$/, 'Talep numarası T ile başlamalı ve en az 4 rakam içermelidir']
  },
  baslik: {
    type: String,
    required: [true, 'Talep başlığı zorunludur'],
    trim: true,
    minlength: [5, 'Başlık en az 5 karakter olmalıdır'],
    maxlength: [200, 'Başlık 200 karakterden uzun olamaz']
  },
  aciklama: {
    type: String,
    required: [true, 'Talep açıklaması zorunludur'],
    trim: true,
    minlength: [20, 'Açıklama en az 20 karakter olmalıdır'],
    maxlength: [2000, 'Açıklama 2000 karakterden uzun olamaz']
  },
  kategori: {
    type: String,
    required: [true, 'Kategori seçimi zorunludur'],
    enum: {
      values: ['Teknik Destek', 'Fatura', 'Genel', 'Özellik Talebi', 'Hata Bildirimi'],
      message: 'Geçersiz kategori seçimi'
    }
  },
  oncelik: {
    type: String,
    required: [true, 'Öncelik seviyesi zorunludur'],
    enum: {
      values: ['Düşük', 'Normal', 'Yüksek', 'Acil'],
      message: 'Geçersiz öncelik seviyesi'
    },
    default: 'Normal' 
  },
  durum: {
    type: String,
    required: [true, 'Durum bilgisi zorunludur'],
    enum: {
      values: ['Açık', 'İşlemde', 'Beklemede', 'Çözüldü', 'Kapalı'],
      message: 'Geçersiz durum'
    },
    default: 'Açık' 
  },
  mesajlar: [messageSchema],
  sonGuncelleme: {
    type: Date,
    default: Date.now,
    required: true
  }
}, {
  timestamps: true, // createdAt ve updatedAt alanlarını otomatik ekle
  // Collection adını belirt 
  collection: 'tickets'
});

/**
 * Middleware: Kaydetmeden önce sonGuncelleme alanını güncelle
 */
ticketSchema.pre('save', function(next) {
  this.sonGuncelleme = new Date();
  next();
});


ticketSchema.virtual('yas').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

/**
 * Instance Method: Talebe mesaj ekle
 * @param {string} gonderen - Mesajı gönderen
 * @param {string} mesaj - Mesaj içeriği
 */
ticketSchema.methods.mesajEkle = function(gonderen, mesaj) {
  this.mesajlar.push({
    gonderen,
    mesaj,
    gondermeTarihi: new Date()
  });
  this.sonGuncelleme = new Date();
  return this.save();
};

/**
 * Static Method: Kategoriye göre talepleri getir
 * @param {string} kategori- Kategori adı
 */
ticketSchema.statics.kategoriyeGoreGetir = function(kategori) {
  return this.find({ kategori }).sort({ createdAt: -1 });
};
module.exports = mongoose.model('Ticket', ticketSchema); 