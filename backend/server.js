import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/route.js";
import cors from "cors";
import cron from "node-cron";
import { cleanExpiredBookings } from "./controllers/BookControllers.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
// Routes


app.use("/api", authRoutes);
// Root
app.get("/", (req, res) => {
  res.json({ message: "API is running 🚀" });
});

// Jalankan tugas setiap 5 menit, membatalkan booking yang pending
cron.schedule('*/5 * * * *', () => {
  cleanExpiredBookings();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
