import express from "express";
import { login, profile } from "../controllers/AuthControllers.js";
import { authMiddleware } from "../src/middleware/authMiddleware.js";
import { getKonten, getKontenById, createKonten, updateKonten, deleteKonten } from "../controllers/KontenController.js";
import { assignRoom, createBooking, createBookingUser, deleteBooking, getBookings, getPublicRooms, updateBooking, updateBookingStatus, available, getBookingUserById, createMidtransTransaction, handleMidtransNotification, checkAvailabilityPublic, cancelBookingUser, getBookingStatus, getBookingByCode, regenerateToken  } from "../controllers/BookControllers.js";
import { createRoom, deleteRoom, getRoomById, getRooms, updateRoom, updateRoomStatus } from "../controllers/RoomControllers.js";

const router = express.Router();

/**
 * ADMIN
 */

// Public
router.post("/login", login);

// Booking
router.post("/booking-user", createBookingUser);
router.get("/booking-user/:id", getBookingUserById);
router.get("/booking-status/:id", getBookingStatus);
router.get("/booking-code/:bookingCode", getBookingByCode);

// Route untuk regenerate token pembayaran
router.post('/regenerate-payment-token', regenerateToken);

// Route untuk cancel pembayaran
router.put("/booking-user/:id/cancel", cancelBookingUser);

// TAMBAHKAN BARIS INI UNTUK MEMPERBAIKI ERROR 404
router.post('/booking/cancel/:id', cancelBookingUser);

// Route untuk membuat token transaksi Midtrans
router.post("/booking/pembayaran", createMidtransTransaction);

// Route untuk menerima notifikasi webhook dari Midtrans
router.post('/midtrans-notification', handleMidtransNotification);

// Route untuk mengecheck ketersediaan kamar
router.get("/check-availability", checkAvailabilityPublic);

// Protected
router.get("/room", authMiddleware, getRooms);
router.get("/rooms", authMiddleware, getPublicRooms);
router.post("/room", authMiddleware, createRoom);
router.get("/room/:id", authMiddleware, getRoomById);
router.put("/room/:id", authMiddleware, updateRoom);
router.patch("/room/:id/status", authMiddleware, updateRoomStatus);
router.delete("/room/:id", authMiddleware, deleteRoom);

router.get("/profile", authMiddleware, profile);


router.get("/booking", authMiddleware, getBookings);
router.post("/booking", authMiddleware, createBooking);
router.put("/booking/:id", authMiddleware, updateBooking);
router.put("/booking/:id/status", authMiddleware, updateBookingStatus);
router.put("/booking/:id/assign-room", authMiddleware, assignRoom);
router.delete("/booking/:id", authMiddleware, deleteBooking);

router.get('/available', authMiddleware, available);


/**
 * KONTEN
 */
router.get("/konten-user",getKonten);
router.get("/konten-management", authMiddleware,getKonten);
router.get("/konten-management/:id",authMiddleware, getKontenById);
router.post("/konten-management",authMiddleware, createKonten);
router.put("/konten-management/:id",authMiddleware, updateKonten);
router.delete("/konten-management/:id",authMiddleware, deleteKonten);

export default router;
