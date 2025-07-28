const express = require('express');        // Web framework
const cors = require('cors');              
const dotenv = require('dotenv');          
const connectDB = require('./config/db');  
const ticketRoutes = require('./routes/ticketRoutes'); 
const userRoutes = require('./routes/userRoutes');
const Ticket = require('./models/ticketModel');       

dotenv.config();
connectDB();
const app = express();

// Middleware
app.use(cors());                    
app.use(express.json());    

app.use('/api/ticket', ticketRoutes);
app.use('/api/users', userRoutes);

/**
 * Health Check Endpoint
 * Sunucunun çalışıp çalışmadığını kontrol etmek için kullanılır
 * GET /api/health
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

/**
 * Seed Endpoint(Sadece development ortamında)
 * Veritabanını örnek verilerle doldurmak için kullanılır
 * POST /api/seed
 * Bu endpoint sadece NODE_ENV=development olduğunda çalışır
 * Production ortamında güvenlik için devre dış bırakılır
 */
if (process.env.NODE_ENV === 'development') {
  app.post('/api/seed', async (req, res) => {
    try {
      const sampleTickets = [
        {
          talepNumarasi: 'T1001',
          baslik: 'Giriş yapamıyorum',
          aciklama: 'Sisteme giriş yaparken hata alıyorum. Lütfen yardımcı olur musunuz?',
          kategori: 'Teknik Destek',
          oncelik: 'Yüksek',
          durum: 'Açık',
          mesajlar: [
            {
              gonderen: 'Kullanıcı',
              mesaj: 'Sisteme giriş yapamıyorum.',
              gondermeTarihi: new Date('2024-07-01T10:00:00Z')
            },
            {
              gonderen: 'Destek',
              mesaj: 'Hatanın ekran görüntüsünü paylaşabilir misiniz?',
              gondermeTarihi: new Date('2024-07-01T10:05:00Z')
            }
          ]
        },
        {
          talepNumarasi: 'T1002',
          baslik: 'Fatura bilgim yanlış',
          aciklama: 'Son faturamda yanlışlık var. Kontrol edebilir misiniz?',
          kategori: 'Fatura',
          oncelik: 'Normal',
          durum: 'Beklemede',
          mesajlar: [
            {
              gonderen: 'Kullanıcı',
              mesaj: 'Faturamda yanlışlık var.',
              gondermeTarihi: new Date('2024-06-28T14:30:00Z')
            }
          ]
        },
        {
          talepNumarasi: 'T1003',
          baslik: 'Yeni özellik talebi',
          aciklama: 'Raporlama ekranına filtre eklenmesini istiyorum.',
          kategori: 'Özellik Talebi',
          oncelik: 'Düşük',
          durum: 'Çözüldü',
          mesajlar: [
            {
              gonderen: 'Kullanıcı',
              mesaj: 'Raporlama ekranına filtre eklenebilir mi?',
              gondermeTarihi: new Date('2024-06-20T08:00:00Z')
            },
            {
              gonderen: 'Destek',
              mesaj: 'Talebiniz değerlendirildi ve eklendi.',
              gondermeTarihi: new Date('2024-06-22T15:00:00Z')
            }
          ]
        }
      ];

      //verileri temizle 
      await Ticket.deleteMany({});
      
      // Yeni örnek verileri veri tabanına ekle
      await Ticket.insertMany(sampleTickets);
      
      res.json({ message: 'Database seeded successfully!', count: sampleTickets.length });
    } catch (error) {
      console.error('Error seeding database:', error);
      res.status(500).json({ error: 'Error seeding database' });
    }
  });
}

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});


app.all('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
