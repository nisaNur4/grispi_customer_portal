const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || 'grispi-secret-key-2024';

// Örnek kullanıcı oluşturma fonksiyonu
const createSampleUser = async () => {
  try {
    const existingUser = await User.findOne();
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('123456', 10);
      const sampleUser = new User({
        firstName: 'Ahmet',
        lastName: 'Yılmaz',
        email: 'ahmet.yilmaz@example.com',
        phone: '+90 555 123 4567',
        address: 'İstanbul, Türkiye',
        password: hashedPassword,
        role: 'customer'
      });
      await sampleUser.save();
      console.log('Örnek kullanıcı oluşturuldu');
    }
  } catch (error) {
    console.error('Örnek kullanıcı oluşturma hatası:', error);
  }
};

// Kayıt ol fonksiyonu
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, address, password } = req.body;

    // Gerekli alanları kontrol et
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ 
        message: 'Ad, soyad, email ve şifre alanları zorunludur' 
      });
    }

    // Email formatını kontrol et
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: 'Geçerli bir email adresi giriniz' 
      });
    }

    // Şifre uzunluğunu kontrol et
    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'Şifre en az 6 karakter olmalıdır' 
      });
    }

    // Emailin daha önce kullanılıp kullanılmadığını kontrol et
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Bu email adresi zaten kullanılıyor' 
      });
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Yeni kullanıcı oluştur
    const newUser = new User({
      firstName,
      lastName,
      email,
      phone: phone || '',
      address: address || '',
      password: hashedPassword,
      role: 'customer'
    });

    await newUser.save();

    // JWT token oluştur
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Kullanıcı bilgilerini döndür
    const userResponse = {
      _id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      phone: newUser.phone,
      address: newUser.address,
      role: newUser.role
    };

    res.status(201).json({
      message: 'Kullanıcı başarıyla oluşturuldu',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Kayıt hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Giriş yap fonksiyonu
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Gerekli alanları kontrol et
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email ve şifre alanları zorunludur' 
      });
    }

    // Kullanıcıyı bul
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        message: 'Email veya şifre hatalı' 
      });
    }

    // Şifreyi kontrol et
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'Email veya şifre hatalı' 
      });
    }

    // JWT token oluştur
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Kullanıcı bilgilerini döndür 
    const userResponse = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role
    };

    res.json({
      message: 'Giriş başarılı',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Giriş hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Token doğrulama middleware'i
exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Token bulunamadı' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'Geçersiz token' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Geçersiz token' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı'});
    
    const userWithoutPassword = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role
    };
    
    res.json(userWithoutPassword);
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    const { firstName, lastName, email, phone, address } = req.body;
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.phone = phone;
    user.address = address;
    await user.save();
    
    const userWithoutPassword = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role
    };
    
    res.json({ message: 'Profil güncellendi', user: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    const { newPassword } = req.body;
    if (!newPassword) return res.status(400).json({ message: 'Yeni şifre gerekli' });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Şifre güncellendi'});
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
}; 