// src/controllers/bookingController.js
import { PrismaClient } from "@prisma/client";
import { sendMail } from "../src/utils/mailer.js";
import midtransClient from 'midtrans-client';

const prisma = new PrismaClient();

// Inisialisasi Snap
let snap = new midtransClient.Snap({
    isProduction: false, // false untuk sandbox, true untuk production
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
});

const bookingToRoomStatus = (bookingStatus) => {
  switch (bookingStatus) {
    case "CONFIRMED":
      return "VCI";
    case "CHECKED_IN":
      return "OCCUPIED";
    case "CHECKED_OUT":
      return "VDN";
    case "CANCELLED":
      return "VCI";
    default:
      return undefined;
  }
};

const nightsBetween = (start, end) => {
  const msPerDay = 24 * 60 * 60 * 1000;
  const diff = new Date(end) - new Date(start);
  return Math.max(1, Math.ceil(diff / msPerDay));
};

// === TAMBAHKAN HELPER BARU DI SINI ===
const getBookingCodePrefix = (roomType) => {
  const mapping = {
    FBK: "FBK",
    FSKG: "FSKG",
    FSST: "FSST",
    DXQ: "DXQ",
  };
  // Mengembalikan prefix yang sesuai, atau 'BOOK' sebagai default
  return mapping[roomType] || "BOOK";
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

    const prefix = getBookingCodePrefix(booking.roomType);
    const bookingCode = `${prefix}${booking.id}`;

    const updatedBooking = await prisma.booking.update({
      where: { id: booking.id },
      data: { bookingCode: bookingCode },
    });

    return res.status(201).json(updatedBooking);
  } catch (err) {
    console.error("createBooking:", err);
    return res.status(500).json({ error: "Gagal membuat booking" });
  }
};

// Create booking admin
export const createBooking = async (req, res) => {
  try {
    const {
      guestName,
      email,
      phone,
      notes,
      checkIn,
      checkOut,
      roomId,
      roomType,
      pricePerNight,
      nights,
      total,
    } = req.body;

    // compute nights if not provided
    let computedNights = nights;
    if ((!nights || nights === 0) && checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      computedNights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    }

    // if roomId supplied, fetch price if pricePerNight missing
    let finalPricePerNight = pricePerNight;
    if (roomId && (!pricePerNight || pricePerNight === 0)) {
      const room = await prisma.room.findUnique({ where: { id: Number(roomId) } });
      if (room) finalPricePerNight = room.price;
    }

    const finalTotal = total ?? (finalPricePerNight && computedNights ? finalPricePerNight * computedNights : 0);

    const booking = await prisma.booking.create({
      data: {
        guestName,
        email,
        phone,
        notes,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        nights: computedNights,
        pricePerNight: finalPricePerNight ? Number(finalPricePerNight) : null,
        total: finalTotal ? Number(finalTotal) : null,
        roomId: roomId ? Number(roomId) : null,
        roomType,
      },
      include: { room: true },
    });

    res.status(201).json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Update booking
export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    // if checkIn/checkOut change -> recompute nights & total if pricePerNight present
    if ((data.checkIn || data.checkOut) && (data.pricePerNight || data.pricePerNight === 0)) {
      const checkIn = data.checkIn ? new Date(data.checkIn) : undefined;
      const checkOut = data.checkOut ? new Date(data.checkOut) : undefined;
      if (checkIn && checkOut) {
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        data.nights = nights;
        data.total = nights * Number(data.pricePerNight);
      }
    }

    const updated = await prisma.booking.update({
      where: { id: Number(id) },
      data,
      include: { room: true },
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Fungsi untuk membuat transaksi Midtrans
export const createMidtransTransaction = async (req, res) => {
    try {
        const { bookingId, totalPrice, guestName, email } = req.body;

        // Membuat parameter untuk transaksi Midtrans
        let parameter = {
            "transaction_details": {
                "order_id": `BOOKING-${bookingId}-${Date.now()}`, // ID order yang unik
                "gross_amount": totalPrice
            },
            "customer_details": {
                "first_name": guestName,
                "email": email
            },
            "callbacks": {
                // URL di frontend Anda yang akan menangani hasil pembayaran
                "finish": `${process.env.FRONTEND_URL}/pembayaran-berhasil`
            }
        };

        // Membuat transaksi menggunakan Snap
        const transaction = await snap.createTransaction(parameter);
        const transactionToken = transaction.token;

        console.log('transactionToken:', transactionToken);
        res.status(200).json({ token: transactionToken });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Gagal membuat transaksi Midtrans", error: error.message });
    }
};

export const handleMidtransNotification = async (req, res) => {
  try {
    const notificationJson = req.body;

    // 1. Terima notifikasi dari Midtrans
    const statusResponse = await snap.transaction.notification(notificationJson);
    let orderId = statusResponse.order_id;
    let transactionStatus = statusResponse.transaction_status;
    let fraudStatus = statusResponse.fraud_status;

    console.log(`Transaksi diterima. Order ID: ${orderId}. Status: ${transactionStatus}. Fraud Status: ${fraudStatus}`);

    // 2. Ekstrak Booking ID dari order_id (misal format: "BOOKING-123-TIMESTAMP")
    const bookingId = parseInt(orderId.split('-')[1]);

    if (!bookingId) {
        console.error("Gagal parsing bookingId dari orderId:", orderId);
        return res.status(400).send("Invalid order_id format");
    }

    // 3. Update status pembayaran di database berdasarkan notifikasi
    let newPaymentStatus;
    if (transactionStatus == 'capture') {
        if (fraudStatus == 'accept') {
            newPaymentStatus = 'SUCCESS';
        }
    } else if (transactionStatus == 'settlement') {
        newPaymentStatus = 'SUCCESS';
    } else if (transactionStatus == 'cancel' || transactionStatus == 'deny' || transactionStatus == 'expire') {
        newPaymentStatus = 'FAILED';
    } else if (transactionStatus == 'pending') {
        newPaymentStatus = 'PENDING';
    }

    if (newPaymentStatus) {
        await prisma.booking.update({
            where: { id: bookingId },
            data: { payment_status: newPaymentStatus }
        });
        console.log(`Booking ID ${bookingId} status pembayaran diupdate menjadi ${newPaymentStatus}`);
    }

    // 4. Kirim respons 200 OK ke Midtrans
    res.status(200).send("OK");

  } catch (error) {
    console.error("Webhook Error:", error.message);
    res.status(500).send("Webhook Error");
  }
};

// FUNGSI BARU UNTUK CEK KETERSEDIAAN KAMAR
export const checkAvailabilityPublic = async (req, res) => {
  try {
    const { roomType, checkIn, checkOut } = req.query;

    if (!roomType || !checkIn || !checkOut) {
      return res.status(400).json({ message: "Tipe kamar, tanggal check-in, dan check-out diperlukan." });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
        return res.status(400).json({ message: "Format tanggal tidak valid." });
    }

    // 1. Hitung total kamar untuk tipe yang dipilih
    const totalRoomsOfType = await prisma.room.count({
      where: {
        type: roomType,
        status: { not: "OOO" }, // Abaikan kamar Out of Order
      },
    });

    if (totalRoomsOfType === 0) {
      return res.json({ available: false, message: "Tipe kamar tidak ditemukan." });
    }

    // 2. Hitung booking yang tumpang tindih untuk tipe kamar tersebut
    const conflictingBookings = await prisma.booking.count({
      where: {
        roomType: roomType,
        status: { in: ["PENDING", "CONFIRMED", "CHECKED_IN"] },
        AND: [
          { checkIn: { lt: checkOutDate } },
          { checkOut: { gt: checkInDate } },
        ],
      },
    });
    
    // 3. Cek apakah masih ada kamar tersisa
    const isAvailable = totalRoomsOfType > conflictingBookings;

    if (isAvailable) {
      res.json({ available: true, message: `Kamar tipe ${roomType} tersedia pada tanggal tersebut.` });
    } else {
      res.json({ available: false, message: `Kamar tipe ${roomType} penuh pada tanggal tersebut.` });
    }

  } catch (error) {
    console.error("Error checking public availability:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
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

export const getBookingUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await prisma.booking.findUnique({
      where: { id: Number(id) },
      // include: { room: true },
    });
    if (!booking) {
      return res.status(404).json({ error: "Booking tidak ditemukan" });
    }
    res.json(booking);
  } catch (err) {
    console.error("getBookingUserById:", err);
    res.status(500).json({ error: "Gagal mengambil detail booking" });
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
      where: { id: Number(id) },
      data: { status },
      include: { room: true },
    });

    // If booking linked to a room, update the room status per mapping
    if (booking?.roomId) {
      const mapped = bookingToRoomStatus(status);
      if (mapped) {
        await prisma.room.update({
          where: { id: booking.roomId },
          data: { status: mapped },
        });
      }
    }

    res.json(booking);
  } catch (err) {
    console.error(err);
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
    // if deleting a booking that had room and was checked_in/confirmed, we may want to update room status
    const booking = await prisma.booking.findUnique({ where: { id: Number(id) } });

    await prisma.booking.delete({ where: { id: Number(id) } });

    // if booking had a room assigned and was NOT CHECKED_OUT, reset room status to VCI
    if (booking?.roomId) {
      await prisma.room.update({
        where: { id: Number(booking.roomId) },
        data: { status: "VCI" },
      });
    }

    res.json({ message: "Booking deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const available = async (req, res) => {
  try {
    const { type, checkIn, checkOut } = req.query;
    if (!type || !checkIn || !checkOut) {
      return res.status(400).json({ error: "Missing params" });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const rooms = await prisma.room.findMany({
      where: {
        type,
        status: { not: "OOO" }, // exclude out of order
        bookings: {
          none: {
            OR: [
              {
                checkIn: { lte: checkOutDate },
                checkOut: { gte: checkInDate },
                status: { in: ["PENDING", "CONFIRMED", "CHECKED_IN"] },
              },
            ],
          },
        },
      },
    });

    res.json(rooms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

