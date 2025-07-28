const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');

// Kayıt ol
router.post('/register', userController.register);
// Giriş yap
router.post('/login', userController.login);

// Profil görüntüleme
router.get('/profile', userController.verifyToken, userController.getProfile);
// Profil güncelleme
router.put('/profile', userController.verifyToken, userController.updateProfile);
// Şifre değiştirme 
router.put('/change-password', userController.verifyToken, userController.changePassword);

module.exports = router; 