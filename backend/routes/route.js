import express from "express";
import { login, profile } from "../controllers/AuthControllers.js";
import { authMiddleware } from "../src/middleware/authMiddleware.js";
import { getKonten, getKontenById, createKonten, updateKonten, deleteKonten } from "../controllers/KontenController.js";
import { assignRoom, createBooking, getBookings, updateBookingStatus } from "../controllers/BookControllers.js";
import { createRoom, deleteRoom, getRoomById, getRooms, updateRoom, updateRoomStatus } from "../controllers/RoomControllers.js";

const router = express.Router();

/**
 * ADMIN
 */

// Public
router.post("/login", login);

// Booking
router.post("/booking", createBooking);


// Protected
router.get("/room", authMiddleware, getRooms);
router.post("/room", authMiddleware, createRoom);
router.get("/room/:id", authMiddleware, getRoomById);
router.put("/room/:id", authMiddleware, updateRoom);
router.patch("/room/:id/status", authMiddleware, updateRoomStatus);
router.delete("/room/:id", authMiddleware, deleteRoom);

router.get("/profile", authMiddleware, profile);
router.get("/booking", authMiddleware, getBookings);
router.put("/booking/:id/status", authMiddleware, updateBookingStatus);
router.put("/booking/:id/assign-room", authMiddleware, assignRoom);

/**
 * KONTEN
 */
router.get("/konten-management", authMiddleware,getKonten);
router.get("/konten-management/:id",authMiddleware, getKontenById);
router.post("/konten-management",authMiddleware, createKonten);
router.put("/konten-management/:id",authMiddleware, updateKonten);
router.delete("/konten-management/:id",authMiddleware, deleteKonten);

export default router;
