// src/controllers/bookingController.js
import { PrismaClient } from "@prisma/client";
import { sendMail } from "../src/utils/mailer.js";
import midtransClient from 'midtrans-client';
import axios from 'axios';

const prisma = new PrismaClient();

// Inisialisasi Snap
let snap = new midtransClient.Snap({
    isProduction: false, // false untuk sandbox, true untuk production
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
});

// Fungsi untuk membuat booking code unik
const generateBookingCode = (roomType) => {
    const randomNum = Math.floor(10 + Math.random() * 90); // Angka acak antara 10-99
    return `${roomType}${randomNum}`;
};

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
        const { bookingId } = req.body;

        // 1. Cari data booking dari database
        const booking = await prisma.booking.findUnique({
            where: { id: Number(bookingId) },
        });

        if (!booking) {
            return res.status(404).json({ msg: "Booking tidak ditemukan" });
        }

        // Cek jika status booking tidak lagi PENDING
        if (booking.status !== 'PENDING') {
            return res.status(400).json({ msg: `Tidak dapat membuat pembayaran. Status pesanan adalah: ${booking.status}` });
        }

        // ==================== PERBAIKAN UTAMA DI SINI ====================
        // Selalu buat order_id BARU dan UNIK setiap kali fungsi ini dipanggil
        // dengan menambahkan timestamp. Ini mencegah error "order_id sudah digunakan".
        const new_midtrans_order_id = `${booking.bookingCode}-${Date.now()}`;
        // ===============================================================
        
        console.log(`Membuat transaksi Midtrans baru dengan Order ID unik: ${new_midtrans_order_id}`);
        
        const parameter = {
            "transaction_details": {
                "order_id": new_midtrans_order_id, // Gunakan order_id yang baru dan unik
                "gross_amount": booking.total
            },
            "customer_details": {
                "first_name": booking.guestName,
                "email": booking.email,
                "phone": booking.phone
            },
            "callbacks": {
                "finish": `${process.env.FRONTEND_URL}/payment-finish`,
                "unfinish": `${process.env.FRONTEND_URL}/payment-finish`,
                "error": `${process.env.FRONTEND_URL}/payment-finish`
            },
            expiry: {
                unit: "minute",
                duration: 10 // Beri waktu 10 menit
            }
        };

        const transaction = await snap.createTransaction(parameter);
        const transactionToken = transaction.token;

        // SIMPAN token dan order_id BARU ke database
        await prisma.booking.update({
            where: { id: booking.id },
            data: { 
                paymentToken: transactionToken,
                midtransOrderId: new_midtrans_order_id // Simpan juga order_id baru
            },
        });

        console.log(`Token baru ${transactionToken} berhasil dibuat dan disimpan untuk Order ID ${new_midtrans_order_id}.`);
        res.status(200).json({ token: transactionToken, orderId: new_midtrans_order_id });

    } catch (error) {
        console.error("Gagal membuat transaksi Midtrans:", error);
        res.status(500).json({ msg: "Gagal membuat transaksi Midtrans", error: error.message });
    }
};

export const handleMidtransNotification = async (req, res) => {
  try {
    console.log("=== Webhook Midtrans Masuk ===");
    console.log("Body:", req.body);

    const notificationJson = req.body;
    const statusResponse = await snap.transaction.notification(notificationJson);
    console.log("Status Response:", statusResponse);

    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    console.log(`Notifikasi diterima. Order ID: ${orderId}, Status: ${transactionStatus}`);

    // ==================== PERBAIKAN UTAMA DI SINI ====================
    // Cari booking berdasarkan kolom 'midtransOrderId', bukan 'bookingCode'.
    // Kolom 'midtransOrderId' berisi nilai yang sama persis dengan 'order_id' dari Midtrans.
    const booking = await prisma.booking.findUnique({
      where: { midtransOrderId: orderId },
    });
    // ===============================================================

    if (!booking) {
      console.warn(`Booking dengan order_id Midtrans ${orderId} tidak ditemukan.`);
      return res.status(404).send("Booking tidak ditemukan");
    }

    let dataToUpdate = {};

    if (transactionStatus === 'settlement' || (transactionStatus === 'capture' && fraudStatus === 'accept')) {
      dataToUpdate = { status: 'CONFIRMED', payment_status: 'SUCCESS' };
    } else if (transactionStatus === 'expire') {
      dataToUpdate = { status: 'CANCELLED', payment_status: 'EXPIRED' };
    } else if (transactionStatus === 'cancel' || transactionStatus === 'deny') {
      dataToUpdate = { status: 'CANCELLED', payment_status: 'CANCELLED' };
    }

    if (Object.keys(dataToUpdate).length > 0) {
      await prisma.booking.update({
        where: { id: booking.id },
        data: dataToUpdate,
      });
      console.log(`Booking ${booking.bookingCode} (order_id: ${orderId}) berhasil diupdate.`);
    } else {
      console.log(`Tidak ada perubahan status untuk transaksi ${orderId}.`);
    }

    res.status(200).send("OK");
  } catch (error) {
    console.error("Kesalahan Webhook Midtrans:", error);
    res.status(500).send("Terjadi kesalahan pada webhook");
  }
};

// FUNGSI BARU UNTUK REGENERATE TOKEN
export const regenerateToken = async (req, res) => {
  console.log("=============================================");
  console.log("MEMULAI PROSES REGENERATE TOKEN PADA:", new Date().toISOString());
  
  const { booking_code } = req.body;
  console.log(`1. Menerima permintaan untuk booking_code: ${booking_code}`);

  if (!booking_code) {
    console.error("   -> GAGAL: Booking code tidak ada dalam request body.");
    return res.status(400).json({ msg: "Booking code diperlukan" });
  }

  try {
    console.log(`2. Mencari data booking di database...`);
    const existingBooking = await prisma.booking.findUnique({
      where: { 
        bookingCode: booking_code 
      }
    });

    if (!existingBooking) {
      console.error(`   -> GAGAL: Booking dengan kode ${booking_code} tidak ditemukan.`);
      return res.status(404).json({ msg: "Booking tidak ditemukan" });
    }
    console.log(`   -> SUKSES: Data booking ditemukan untuk tamu: ${existingBooking.guestName}`);
    console.log(`   -> Status booking saat ini: ${existingBooking.status}`);

    // ==================== PERBAIKAN UTAMA ====================
    // Hentikan proses jika status BUKAN 'PENDING'.
    // Ini adalah satu-satunya status yang memperbolehkan pembayaran ulang.
    if (existingBooking.status !== 'PENDING') {
      console.error(`   -> GAGAL: Percobaan regenerate token untuk booking dengan status final: ${existingBooking.status}.`);
      console.log("=============================================\n");
      return res.status(400).json({ msg: `Tidak dapat melanjutkan pembayaran. Status pesanan saat ini adalah: ${existingBooking.status}`});
    }
    // =========================================================

    console.log("3. Menginisialisasi Midtrans Snap...");
    let snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });
    console.log("   -> SUKSES: Midtrans Snap terinisialisasi.");
      
    // ==================== PERBAIKAN UTAMA ====================
    // Buat order_id BARU dan UNIK untuk Midtrans dengan menambahkan timestamp.
    // Ini akan mencegah error "order_id sudah digunakan".
    const new_midtrans_order_id = `${existingBooking.bookingCode}-${Date.now()}`;
    // =========================================================
    
    console.log(`4. Membuat parameter untuk transaksi Midtrans dengan order_id baru: ${new_midtrans_order_id}`);

    const parameter = {
      transaction_details: {
        order_id: new_midtrans_order_id,
        gross_amount: existingBooking.total,
      },
      customer_details: {
        first_name: existingBooking.guestName,
        email: existingBooking.email,
        phone: existingBooking.phone
      },
      // Optional: Menambahkan detail item
      item_details: [{
        id: existingBooking.roomType, 
        price: existingBooking.total,
        quantity: 1,
        name: `Booking Kamar Tipe ${existingBooking.roomType} #${existingBooking.bookingCode}`,
      }],
      credit_card: {
        secure: true,
      },
       expiry: {
            unit: "minute",
            duration: 10 // Beri waktu 10 menit untuk pembayaran
        }
    };
    console.log("   -> Parameter:", JSON.stringify(parameter, null, 2));

    console.log("5. Mengirim permintaan pembuatan transaksi ke Midtrans...");
    const transaction = await snap.createTransaction(parameter);
    const newTransactionToken = transaction.token;
    console.log("   -> SUKSES: Midtrans merespons dengan token baru.");

    console.log("6. Memperbarui data booking di database dengan token & order_id baru...");
    await prisma.booking.update({
      where: { id: existingBooking.id },
      data: {
        paymentToken: newTransactionToken,
        midtransOrderId: new_midtrans_order_id, // Simpan order_id baru untuk referensi
      },
    });
    console.log("   -> SUKSES: Database berhasil diperbarui.");
    
    console.log("7. Mengirim token baru ke frontend.");
    console.log("=============================================\n");
    res.status(200).json({ token: newTransactionToken });

  } catch (error) {
    console.error("   -> ERROR KRITIS PADA BLOK `try...catch`!");
    console.error("   -> Pesan Error:", error.message);
    if (error.ApiResponse) {
        console.error("   -> Respons API Midtrans:", error.ApiResponse);
    }
    console.log("=============================================\n");
    res.status(500).json({ 
        msg: 'Gagal membuat token pembayaran baru di server.', 
        error: error.message 
    });
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

export const getBookingByCode = async (req, res) => {
  try {
    const { bookingCode } = req.params;
    const booking = await prisma.booking.findUnique({
      where: { bookingCode: bookingCode },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking tidak ditemukan." });
    }

    res.json(booking);
  } catch (error) {
    console.error("Error fetching booking by code:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
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

export const cancelBookingUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Cari booking yang sesuai
    const booking = await prisma.booking.findUnique({
      where: { id: Number(id) },
    });

    // Jika tidak ditemukan atau statusnya bukan PENDING, kirim error
    if (!booking) {
      return res.status(404).json({ message: "Booking tidak ditemukan." });
    }

    if (booking.status !== "PENDING") {
      return res.status(400).json({ message: "Hanya pesanan yang masih pending yang bisa dibatalkan." });
    }

    // Cek apakah booking ini memiliki bookingCode (yang digunakan sebagai order_id)
    if (booking.bookingCode) {
      const serverKey = process.env.MIDTRANS_SERVER_KEY;
      const midtransUrl = `https://api.sandbox.midtrans.com/v2/${booking.bookingCode}/cancel`;
      
      // Enkripsi Server Key untuk otorisasi (Basic Auth)
      const authString = Buffer.from(`${serverKey}:`).toString('base64');

      try {
        console.log(`Mencoba membatalkan transaksi Midtrans: ${booking.bookingCode}`);
        // Kirim permintaan pembatalan ke API Midtrans
        await axios.post(midtransUrl, {}, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Basic ${authString}`
          }
        });
        console.log(`Transaksi Midtrans ${booking.bookingCode} berhasil dibatalkan.`);
      } catch (midtransError) {
        // Jika gagal, catat errornya tapi proses tetap lanjut.
        // Ini untuk menangani kasus jika transaksi sudah kedaluwarsa di sisi Midtrans.
        console.error(`Gagal membatalkan transaksi Midtrans ${booking.bookingCode}:`, midtransError.response?.data || midtransError.message);
      }
    }

    // Update status booking menjadi CANCELLED
    const cancelledBooking = await prisma.booking.update({
      where: { id: Number(id) },
      data: { status: "CANCELLED", payment_status: "CANCELLED"},
    });

    res.json({ message: "Pesanan telah berhasil dibatalkan.", booking: cancelledBooking });
  } catch (err) {
    console.error("Error cancelling booking:", err);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

export const getBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id: Number(id) },
      select: { status: true, payment_status: true, bookingCode: true },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking tidak ditemukan" });
    }

    res.json({
      status: booking.status,
      payment_status: booking.payment_status,
      bookingCode: booking.bookingCode,
    });
  } catch (error) {
    console.error("Gagal mendapatkan status booking:", error);
    res.status(500).json({ message: "Gagal memeriksa status booking" });
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

// FUNGSI BARU UNTUK MEMBERSIHKAN BOOKING YANG EXPIRED
export const cleanExpiredBookings = async () => {
  console.log('Running scheduled job: Cleaning expired bookings...');
  try {
    // Tentukan batas waktu (misalnya, 10 menit yang lalu)
    const expiryTime = new Date(Date.now() - 10 * 60 * 1000);

    // Cari semua booking yang masih PENDING dan dibuat lebih dari 10 menit yang lalu
    const expiredBookings = await prisma.booking.findMany({
      where: {
        status: 'PENDING',
        createdAt: {
          lt: expiryTime, // lt = less than (kurang dari)
        },
      },
    });

    if (expiredBookings.length > 0) {
      const idsToCancel = expiredBookings.map(b => b.id);
      console.log(`Found ${expiredBookings.length} expired bookings to cancel. IDs: ${idsToCancel.join(', ')}`);

      // Ubah status semua booking yang kedaluwarsa menjadi CANCELLED
      await prisma.booking.updateMany({
        where: {
          id: {
            in: idsToCancel,
          },
        },
        data: {
          status: 'CANCELLED',
          payment_status: 'FAILED',
        },
      });
    } else {
      console.log('No expired bookings found.');
    }
  } catch (error) {
    console.error('Error during scheduled job:', error);
  }
};