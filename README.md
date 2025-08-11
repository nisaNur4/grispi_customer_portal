# Grispi Müşteri Portalı

Grispi Müşteri Portalı, müşteri destek süreçlerini dijitalleştirmek ve kolaylaştırmak amacıyla geliştirilmiş **full-stack web uygulamasıdır**. 
---
## Kullanılan Teknolojiler

### Frontend
- **React 19** - Modern UI framework
- **Ant Design 5** - UI component library
- **React Router 7** - Client-side routing
- **Axios** - HTTP client
- **Vite** - Build tool
- **Day.js** - Date manipulation

### Backend
- **Node.js 18+** - Runtime environment
- **Express 4** - Web framework
- **MongoDB 6+** - NoSQL database
- **Mongoose 7** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Development Tools
- **ESLint** - Code linting
- **Nodemon** - Development server
- **dotenv** - Environment variables
---
## Özellikler

### Authentication Sistemi
- **JWT Token** tabanlı güvenli authentication
- **Kayıt ol** ve **giriş yap** sayfaları
- **Protected routes** - Yetkisiz erişim koruması
- **Auto-logout** - Token süresi dolduğunda otomatik çıkış
- **Password hashing** - bcrypt ile güvenli şifre saklama

### Talep Yönetimi
- **Talep Oluşturma** - Çok adımlı form ile kolay talep oluşturma
- **Talep Listesi** - Filtreleme, arama ve sıralama özellikleri
- **Talep Detayı** - Mesajlaşma ve durum takibi
- **Dosya Ekleme** - Talep ile birlikte dosya yükleme
- **Otomatik Numaralandırma** - T1001, T1002... formatında

### Kullanıcı Yönetimi
- **Profil Güncelleme** - Kişisel bilgileri düzenleme
- **Şifre Değiştirme** - Güvenli şifre güncelleme
- **Kullanıcı Bilgileri** - Ad, soyad, email, telefon, adres

### Modern UI/UX
- **Responsive Design** - Mobil ve desktop uyumlu
- **Ant Design** - Modern ve tutarlı arayüz
- **Gradient Backgrounds** - Çekici görsel tasarım
- **Loading States** - Kullanıcı deneyimi için loading animasyonları
- **Error Handling** - Kullanıcı dostu hata mesajları
---



## Kurulum ve Çalıştırma

### Gereksinimler
- Node.js 18+
- MongoDB 6+
- npm veya yarn

### Backend Kurulumu
```bash
cd backend
npm install
npm run dev
```

### Frontend Kurulumu
```bash
cd frontend
npm install
npm run dev
```

### Erişim
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
---

## Test Senaryoları

### Authentication Testleri
- Kullanıcı kaydı
- Kullanıcı girişi
- Token doğrulama
- Otomatik logout
- Protected route koruması

### Talep Yönetimi Testleri
- Talep oluşturma
- Talep listeleme
- Talep detayı görüntüleme
- Mesaj ekleme
- Filtreleme ve arama

### Kullanıcı Yönetimi Testleri
- Profil güncelleme
- Şifre değiştirme
- Kullanıcı bilgileri görüntüleme

---

## Güvenlik Özellikleri

- **JWT Authentication** - Güvenli token tabanlı kimlik doğrulama
- **Password Hashing** - bcrypt ile şifre güvenliği
- **Input Validation** - Kullanıcı girdisi doğrulama
- **CORS Protection** - Cross-origin request koruması
- **Error Handling** - Güvenli hata yönetimi
