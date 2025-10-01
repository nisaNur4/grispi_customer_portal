const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// POST /api/user/register
const registerUser = asyncHandler(async (req, res) => {
  if (!process.env.JWT_SECRET) {
    res.status(500);
    throw new Error("Sunucu yapılandırma hatası: JWT_SECRET tanımlı değil");
  }
  const { ad, soyad, email, telefon, password } = req.body;

  if (!ad || !soyad || !email || !password) {
    return res.status(400).json({ success: false, message: "Lütfen tüm gerekli alanları doldurun" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ success: false, message: "Bu e-posta ile kayıtlı kullanıcı zaten var" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({ ad, soyad, email, telefon, password: hashedPassword });
  const safeUser = {
    _id: user._id,
    ad: user.ad,
    soyad: user.soyad,
    email: user.email,
    telefon: user.telefon,
    adres: user.adres,
    ulke: user.ulke,
    sehir: user.sehir,
    postaKodu: user.postaKodu,
    webSitesi: user.webSitesi,
    role: user.role,
  };

  return res.status(201).json({
    success: true,
    message: "Kayıt başarılı",
    data: safeUser,
    token: generateToken(user._id),
  });
});

// POST /api/user/login
const loginUser = asyncHandler(async (req, res) => {
  console.log("Gelen body:", req.body);

  if (!process.env.JWT_SECRET) {
    res.status(500);
    throw new Error("Sunucu yapılandırma hatası: JWT_SECRET tanımlı değil");
  }
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ success: false, message: "Geçersiz kimlik bilgileri" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: "Geçersiz kimlik bilgileri" });
  }

  const safeUser = {
    _id: user._id,
    ad: user.ad,
    soyad: user.soyad,
    email: user.email,
    telefon: user.telefon,
    adres: user.adres,
    ulke: user.ulke,
    sehir: user.sehir,
    postaKodu: user.postaKodu,
    webSitesi: user.webSitesi,
    role: user.role,
  };

  return res.json({
    success: true,
    message: "Giriş başarılı",
    data: safeUser,
    token: generateToken(user._id),
  });
});

// GET /api/user/profile
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  if (!user) {
    return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı" });
  }

  return res.json({
    success: true,
    data: {
      id: user._id,
      ad: user.ad,
      soyad: user.soyad,
      email: user.email,
      role: user.role,
    },
  });
});

// PUT /api/user/profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı" });
  }
  user.ad = req.body.ad ?? user.ad;
  user.soyad = req.body.soyad ?? user.soyad;
  user.telefon = req.body.telefon ?? user.telefon;
  // user.email = req.body.email ?? user.email;

  user.adres = req.body.adres ?? user.adres;
  user.ulke = req.body.ulke ?? user.ulke;
  user.sehir = req.body.sehir ?? user.sehir;
  user.postaKodu = req.body.postaKodu ?? user.postaKodu;
  user.webSitesi = req.body.webSitesi ?? user.webSitesi;

  const updatedUser = await user.save();
  const safeUser = {
    _id: updatedUser._id,
    ad: updatedUser.ad,
    soyad: updatedUser.soyad,
    email: updatedUser.email,
    telefon: updatedUser.telefon,
    adres: updatedUser.adres,
    ulke: updatedUser.ulke,
    sehir: updatedUser.sehir,
    postaKodu: updatedUser.postaKodu,
    webSitesi: updatedUser.webSitesi,
    role: updatedUser.role,
  };

  return res.json({
    success: true,
    message: "Profil güncellendi",
    data: safeUser,
  });
});

// PUT /api/user/change-password
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: "Lütfen mevcut ve yeni şifrenizi girin" });
  }
  if (String(newPassword).length < 8) {
    return res.status(400).json({ success: false, message: "Yeni şifre en az 8 karakter olmalıdır" });
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı" });
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: "Mevcut şifre yanlış" });
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  await user.save();

  return res.json({ success: true, message: "Şifre başarıyla güncellendi" });
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
};
