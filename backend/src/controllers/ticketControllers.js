const asyncHandler = require("express-async-handler");
const Ticket = require("../models/ticketModel");
const User = require("../models/userModel");

const getTickets = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Kullanıcı bulunamadı");
  }

  const tickets = await Ticket.find({ owner: req.user._id }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    data: tickets,
  });
});

const getTicketById = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Kullanıcı bulunamadı");
  }

  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    res.status(404);
    throw new Error("Talep bulunamadı");
  }

  if (ticket.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Bu talebi görüntüleme yetkiniz yok");
  }

  res.status(200).json({
    success: true,
    data: ticket,
  });
});

const createTicket = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Kullanıcı bulunamadı");
  }

  const { talepTuru, konu, aciklama } = req.body;
  const files = req.files || [];

  if (!talepTuru || !konu || !aciklama) {
    res.status(400);
    throw new Error("Lütfen tüm gerekli alanları doldurun.");
  }

  const fileUrls = files.map((file) => ({
    name: file.originalname,
    url: `/uploads/${file.filename}`,
  }));

  const ticket = await Ticket.create({
    owner: req.user._id,
    kategori: talepTuru,
    baslik: konu,
    aciklama: aciklama,
    dosyalar: fileUrls,
    durum: "Açık",
    oncelik: "Normal",
    mesajlar: [
      {
        sender: "customer",
        name: `${req.user.ad} ${req.user.soyad}`,
        mesaj: aciklama,
      },
    ],
  });

  res.status(201).json({
    success: true,
    message: "Talep başarıyla oluşturuldu.",
    data: ticket,
  });
});

const addMessageToTicket = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Kullanıcı bulunamadı");
  }

  const { message: messageContent } = req.body;
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    res.status(404);
    throw new Error("Talep bulunamadı");
  }

  if (ticket.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Bu talebe mesaj gönderme yetkiniz yok");
  }

  const newMessage = {
    sender: "customer",
    name: `${req.user.ad} ${req.user.soyad}`,
    mesaj: messageContent,
  };

  ticket.mesajlar.push(newMessage);
  ticket.guncellemeTarihi = Date.now();
  await ticket.save();

  res.status(201).json({
    success: true,
    message: "Mesaj başarıyla eklendi.",
    data: newMessage,
  });
});

module.exports = {
  getTickets,
  getTicketById,
  createTicket,
  addMessageToTicket,
};
