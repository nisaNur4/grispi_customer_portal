/**
 * Bu dosya destek talebi ile ilgili tüm API endpointlerinin iş mantığını içerir. 
 * Her fonksiyon bir HTTP isteğini işler ve uygun yanıt döndürür.
 */

const Ticket = require('../models/ticketModel'); 

/**
 * Veri tabanındaki tüm destek taleplerini getirir.
 * Talepler oluşturulma tarihine göre yeniden eskiye sıralanır.
 * @route GET /api/ticket
 * @access Private 
 * @returns {Array} Talepler listesi
 */
const getTickets = async (req, res) => {
  try {
    // Sadece giriş yapmış kullanıcının taleplerini getir
    const tickets = await Ticket.find({ kullaniciId: req.user._id }).sort({ createdAt: -1 }); // -1= azalan sıra
        res.json({
      success: true,
      count: tickets.length,
      data: tickets
    });
    
  } catch (error) {
    console.error('getTickets Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Talepler yüklenirken hata oluştu',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * ID'si verilen talebin detaylarını getirir.
 * Talep bulunamazsa 404 hatası döndürür.
 * @route GET /api/ticket/:id
 * @access Private 
 * @param {string} id - Talep ID'si
 * @returns {Object} Talep detayları
 */
const getTicketById = async (req, res) => {
  try {
    // URL'den ID'yi al
    const {id}= req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz talep ID formatı'
      });
    }
    const ticket = await Ticket.findOne({ _id: id, kullaniciId: req.user._id });
    
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Talep bulunamadı'
      });
    }
    
    res.json({
      success: true,
      data: ticket
    });
    
  } catch (error) {
    console.error('getTicketById Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Talep detayları yüklenirken hata oluştu',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Yeni Talep Oluştur
 * Kullanıcıdan gelen verilerle yeni bir destek talebi oluşturur.
 * Talep numarası otomatik olarak oluşturulur.
 * 
 * @route POST /api/ticket
 * @access Private
 * @body {string} baslik - Talep başlığı
 * @body {string} aciklama - Talep açıklaması
 * @body {string} kategori - Talep kategorisi
 * @body {string} oncelik - Öncelik seviyesi 
 * @returns {Object} Oluşturulan talep
 */
const createTicket = async (req, res) => {
  try {
    const { baslik, aciklama, kategori, oncelik } = req.body;
    
    if (!baslik || !aciklama || !kategori) {
      return res.status(400).json({
        success: false,
        message: 'Başlık, açıklama ve kategori alanları zorunludur'
      });
    }
    
    // Talep numarası oluştur
    // Son talebi bul ve numarasını al
    const lastTicket = await Ticket.findOne().sort({ talepNumarasi: -1 });
    const lastNumber = lastTicket ? parseInt(lastTicket.talepNumarasi.slice(1)) : 1000;
    const talepNumarasi = 'T' + (lastNumber + 1);
    
    const newTicket = new Ticket({
      talepNumarasi,
      baslik: baslik.trim(),
      aciklama: aciklama.trim(),
      kategori,
      oncelik: oncelik || 'Normal',
      kullaniciId: req.user._id,
      kullaniciAdi: `${req.user.firstName} ${req.user.lastName}`,
      kullaniciEmail: req.user.email
    });
    
    const savedTicket = await newTicket.save();
    
    res.status(201).json({
      success: true,
      message: 'Talep başarıyla oluşturuldu',
      data: savedTicket
    });
    
  } catch (error) {
    console.error('createTicket Error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Veri doğrulama hatası',
        errors: messages
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Bu talep numarası zaten kullanılıyor'
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Talep oluşturulurken hata oluştu',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Talebe Mesaj Ekle
 * Mevcut bir talebe yeni mesaj ekler.
 * Mesaj eklendikten sonra talep güncellenir.
 * @route POST /api/ticket/:id/message
 * @access Private 
 * @param {string} id - Talep ID'si
 * @body {string} gonderen - Mesajı gönderen 
 * @body {string} mesaj - Mesaj içeriği
 * @returns {Object} Güncellenmiş talep
 */
const addMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { mesaj } = req.body;
    
    if (!mesaj||mesaj.trim().length=== 0) {
      return res.status(400).json({
        success: false,
        message: 'Mesaj içeriği zorunludur'
      });
    }
    
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz talep ID formatı'
      });
    }
    
    const ticket = await Ticket.findOne({ _id: id, kullaniciId: req.user._id });
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Talep bulunamadı'
      });
    }
    
    const newMessage = {
      gonderen: `${req.user.firstName} ${req.user.lastName}`, 
      mesaj: mesaj.trim(),
      gondermeTarihi: new Date()
    };
    
    ticket.mesajlar.push(newMessage);
    ticket.sonGuncelleme = new Date();
    const updatedTicket = await ticket.save();
    
    res.status(201).json({
      success: true,
      message: 'Mesaj başarıyla eklendi',
      data: updatedTicket
    });
    
  } catch (error) {
    console.error('addMessage Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Mesaj eklenirken hata oluştu',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  getTickets,      // Tüm talepleri getir
  getTicketById,   // Tek talebi getir
  createTicket,    // Yeni talep oluştur
  addMessage       // Mesaj ekle
}; 