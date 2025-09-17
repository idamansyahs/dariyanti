// src/controllers/bookingController.js
import { PrismaClient } from "@prisma/client";
import { sendMail } from "../src/utils/mailer.js";

const prisma = new PrismaClient();

const nightsBetween = (start, end) => {
  const msPerDay = 24 * 60 * 60 * 1000;
  const diff = new Date(end) - new Date(start);
  return Math.max(1, Math.ceil(diff / msPerDay));
};

// Create booking (public)
export const createBookingUser = async (req, res) => {
  try {
    const { roomType, guestName, email, phone, notes, checkIn, checkOut } = req.body;
    if (!roomType || !guestName || !email || !phone || !checkIn || !checkOut) {
      return res.status(400).json({ error: "Lengkapi semua field yang required" });
    }

    const nights = nightsBetween(checkIn, checkOut);
    const sampleRoom = await prisma.room.findFirst({ where: { type: roomType } });
    if (!sampleRoom) return res.status(400).json({ error: "Tipe kamar tidak tersedia" });

    const pricePerNight = sampleRoom.price;
    const total = pricePerNight * nights;

    const booking = await prisma.booking.create({
      data: {
        roomType,
        guestName,
        email,
        phone,
        notes,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        nights,
        pricePerNight,
        total,
        status: "PENDING",
      },
    });

    return res.status(201).json(booking);
  } catch (err) {
    console.error("createBooking:", err);
    return res.status(500).json({ error: "Gagal membuat booking" });
  }
};

// Create booking admin
export const createBooking = async (req, res) => {
  try {
    const { guestName, email, phone, notes, checkIn, checkOut, roomId, roomType } = req.body;

    // hitung nights
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    // ambil harga dari room (kalau ada)
    let pricePerNight = 0;
    if (roomId) {
      const room = await prisma.room.findUnique({ where: { id: parseInt(roomId) } });
      if (room) pricePerNight = room.price;
    }

    const total = nights * pricePerNight;

    const booking = await prisma.booking.create({
      data: {
        guestName,
        email,
        phone,
        notes,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        nights,
        pricePerNight,
        total,
        roomId: roomId ? parseInt(roomId) : null,
        roomType, // wajib dari enum
      },
    });

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update booking
export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const booking = await prisma.booking.update({
      where: { id: Number(id) },
      data,
    });

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all bookings (admin)
export const getBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: { room: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(bookings);
  } catch (err) {
    console.error("getBookings:", err);
    res.status(500).json({ error: "Gagal mengambil booking" });
  }
};

// Assign a real room to a booking (admin)
export const assignRoom = async (req, res) => {
  try {
    const { id } = req.params; // booking id
    const { roomId } = req.body;
    if (!roomId) return res.status(400).json({ error: "roomId required" });

    const booking = await prisma.booking.findUnique({ where: { id: Number(id) } });
    if (!booking) return res.status(404).json({ error: "Booking tidak ditemukan" });

    const room = await prisma.room.findUnique({ where: { id: Number(roomId) } });
    if (!room) return res.status(404).json({ error: "Room tidak ditemukan" });

    // cek overlap: sudah ada booking CONFIRMED or CHECKED_IN yang tumpang tindih
    const overlap = await prisma.booking.findFirst({
      where: {
        roomId: Number(roomId),
        status: { in: ["CONFIRMED", "CHECKED_IN"] },
        AND: [{ checkIn: { lt: booking.checkOut } }, { checkOut: { gt: booking.checkIn } }],
      },
    });

    if (overlap) {
      return res.status(400).json({ error: "Room tidak tersedia pada rentang tanggal tersebut" });
    }

    const updated = await prisma.booking.update({
      where: { id: Number(id) },
      data: { roomId: Number(roomId) },
      include: { room: true },
    });

    return res.json(updated);
  } catch (err) {
    console.error("assignRoom:", err);
    return res.status(500).json({ error: "Gagal assign room" });
  }
};

// Update booking status (admin) + email notify on CONFIRMED or CANCELLED
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const booking = await prisma.booking.update({
      where: { id: parseInt(id) },
      data: { status },
    });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPublicRooms = async (req, res) => {
  try {
    const { search, type } = req.query;

    let where = {};

    if (search) {
      where.OR = [{ type: { contains: search, mode: "insensitive" } }, { roomNumber: { contains: search, mode: "insensitive" } }];
    }

    if (type) {
      where.type = type;
    }

    const rooms = await prisma.room.findMany({
      where,
      orderBy: { id: "asc" },
    });

    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: "Error fetching rooms" });
  }
};

// Delete booking
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.booking.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Booking deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
