import express from "express";
import { login, profile } from "../controllers/AuthControllers.js";
import { authMiddleware } from "../src/middleware/authMiddleware.js";
import { getKonten, getKontenById, createKonten, updateKonten, deleteKonten } from "../controllers/KontenController.js";
import { assignRoom, createBooking, getBookings, getPublicRooms, updateBookingStatus } from "../controllers/BookControllers.js";
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
router.get("/rooms", authMiddleware, getPublicRooms);
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
router.get("/konten", getKonten);
router.get("/konten/:id", getKontenById);
router.post("/konten", createKonten);
router.put("/konten/:id", updateKonten);
router.delete("/konten/:id", deleteKonten);

export default router;
