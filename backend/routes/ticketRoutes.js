/**
 * Express Router ile modüler route yapısı 
 * Route Yapısı:
 * - GET /api/ticket - Tüm talepleri listele
 * - GET /api/ticket/:id - Tek talebi getir
 * - POST /api/ticket - Yeni talep oluştur
 * - POST /api/ticket/:id/message- Talebe mesaj ekle
 */

const express = require('express'); 
const router = express.Router();    
const {
  getTickets,      // Tüm talepleri getiren fonksiyon
  getTicketById,   // Tek talebi getiren 
  createTicket,    // Yeni talep oluşturan 
  addMessage       // Mesaj ekleyen 
} = require('../controllers/ticketControllers');

const { verifyToken } = require('../controllers/userControllers');

/**
 * Response:
 * - 200: Başarılı- Talep detayları
 *  - 201: Başarılı - Oluşturulan talep
 * - 400: Geçersiz ID formatı
 * - 404: Talep bulunamadı
 * - 500: Sunucu hatası
 */
router.get('/', verifyToken, getTickets);
router.get('/:id', verifyToken, getTicketById);
/**
 * Request Body:
 * {
 *   "baslik": "Talep başlığı",
 *   "aciklama": "Talep açıklaması",
 *   "kategori": "Teknik Destek",
 *   "oncelik": "Normal" 
 * }
 */
router.post('/', verifyToken, createTicket);

/**
 * Request Body:
 * {
 *   "gonderen": "Kullanıcı adı",
 *   "mesaj": "Mesaj içeriği"
 * }
 */
router.post('/:id/message', verifyToken, addMessage);

module.exports = router; 