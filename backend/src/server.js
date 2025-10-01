const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const ticketRoutes = require("./routes/ticketRoutes");
const userRoutes = require("./routes/userRoutes");
const Ticket = require("./models/ticketModel");
const User = require("./models/userModel");
const bcrypt = require("bcryptjs");
const { errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();
if (!process.env.JWT_SECRET) {
  const fallback = "dev-secret-change-me";
  process.env.JWT_SECRET = fallback;
  console.warn("[WARN] JWT_SECRET not set. Using a development fallback. Set JWT_SECRET in your .env for production.");
}
connectDB();

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      const allowList = [process.env.FRONTEND_URL].filter(Boolean);
      const isNoOrigin = !origin;
      const isLocalhost = /^http:\/\/localhost:\d+$/.test(origin || "");
      const isLoopback = /^http:\/\/127\.0\.0\.1:\d+$/.test(origin || "");
      const isAllowedFromEnv = allowList.length > 0 && allowList.includes(origin);

      if (isNoOrigin || isLocalhost || isLoopback || isAllowedFromEnv) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/ticket", ticketRoutes);
app.use("/api/user", userRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

if (process.env.NODE_ENV === "development") {
  app.post("/api/seed", async (req, res) => {
    try {
      await User.deleteMany({});
      await Ticket.deleteMany({});

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash("123456", salt);

      const users = await User.insertMany([
        {
          ad: "Grispi",
          soyad: "Grispi",
          email: "grispi@grispi.com.tr",
          telefon: "+90 544 444 4444",
          password: hash,
          role: "customer",
        },
        {
          ad: "Admin",
          soyad: "Portal",
          email: "admin@grispi.com.tr",
          telefon: "+90 544 555 5555",
          password: hash,
          role: "admin",
        },
      ]);

      const sampleTickets = [
        {
          baslik: "Giriş yapamıyorum",
          aciklama: "Kullanıcı adı ve şifremi doğru girmeme rağmen giriş yapamıyorum.",
          kategori: "Teknik Destek",
          oncelik: "Yüksek",
          durum: "Açık",
          owner: users[0]._id,
          mesajlar: [],
        },
        {
          baslik: "Raporlama ekranına filtre eklenmesini istiyorum",
          aciklama: "Raporlama ekranına filtre eklenebilir mi?",
          kategori: "Özellik Talebi",
          oncelik: "Düşük",
          durum: "Çözüldü",
          owner: users[0]._id,
          mesajlar: [
            {
              sender: "customer",
              name: `${users[0].ad} ${users[0].soyad}`,
              mesaj: "Raporlama ekranına filtre eklenebilir mi?",
              tarih: new Date("2024-06-20T08:00:00Z"),
            },
            {
              sender: "support",
              name: "Destek Ekibi",
              mesaj: "Talebiniz değerlendirildi ve eklendi.",
              tarih: new Date("2024-06-22T15:00:00Z"),
            },
          ],
        },
      ];

      await Ticket.insertMany(sampleTickets);

      res.json({
        success: true,
        message: "Database seeded successfully!",
        usersCount: users.length,
        ticketsCount: sampleTickets.length,
      });
    } catch (error) {
      console.error("Error seeding database:", error);
      res.status(500).json({ success: false, error: "Error seeding database" });
    }
  });
}

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
