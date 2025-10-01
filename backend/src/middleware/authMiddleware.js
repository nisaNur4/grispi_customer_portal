const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('_id ad soyad email role');
      if (!req.user) {
        res.status(401);
        throw new Error('Yetkisiz erişim: kullanıcı yok');
      }
      return next();
    } catch (err) {
      res.status(401);
      throw new Error('Yetkisiz erişim: token geçersiz');
    }
  }
  res.status(401);
  throw new Error('Yetkisiz erişim: token bulunamadı');
});

module.exports = { protect };
