const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: String,
        enum: ['customer', 'support'],
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    mesaj: {
        type: String,
        required: true,
    },
    tarih: {
        type: Date,
        default: Date.now,
    },
});

const ticketSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User', 
        },
        baslik: {
            type: String,
            required: [true, 'Lütfen talep başlığı girin'],
            trim: true,
        },
        aciklama: {
            type: String,
            required: [true, 'Lütfen talep açıklaması girin'],
        },
        durum: {
            type: String,
            enum: ['Açık', 'İşlemde', 'Beklemede', 'Çözüldü', 'Kapandı'],
            default: 'Açık',
        },
        oncelik: {
            type: String,
            enum: ['Düşük', 'Normal', 'Yüksek', 'Acil'],
            default: 'Normal',
        },
        kategori: {
            type: String,
            required: [true, 'Lütfen bir kategori seçin'],
        },
        assignee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        mesajlar: [messageSchema],
        dosyalar: [
            {
                name: String,
                url: String,
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Ticket', ticketSchema);