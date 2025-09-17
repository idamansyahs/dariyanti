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
export const createBooking = async (req, res) => {
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
        AND: [
          { checkIn: { lt: booking.checkOut } },
          { checkOut: { gt: booking.checkIn } },
        ],
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
    const allowed = ["PENDING", "CONFIRMED", "CHECKED_IN", "CHECKED_OUT", "CANCELLED"];
    if (!allowed.includes(status)) return res.status(400).json({ error: "Status invalid" });

    // ambil dulu booking lama
    const bookingBefore = await prisma.booking.findUnique({ where: { id: Number(id) }, include: { room: true } });
    if (!bookingBefore) return res.status(404).json({ error: "Booking tidak ditemukan" });

    // update booking status
    const updated = await prisma.booking.update({
      where: { id: Number(id) },
      data: { status },
      include: { room: true },
    });

    // update room.status tergantung status booking
    if (updated.roomId) {
      if (status === "CHECKED_IN") {
        await prisma.room.update({ where: { id: updated.roomId }, data: { status: "OCCUPIED" } });
      } else if (status === "CHECKED_OUT") {
        await prisma.room.update({ where: { id: updated.roomId }, data: { status: "VDN" } }); // perlu dibersihkan
      } else if (status === "CANCELLED") {
        // jika room sudah ter-assign tapi belum di-huni, set kembali ke READY (VCI)
        await prisma.room.update({ where: { id: updated.roomId }, data: { status: "VCI" } });
      }
    }

    // send email on CONFIRMED or CANCELLED
    if (status === "CONFIRMED" || status === "CANCELLED") {
      const subject = status === "CONFIRMED" ? "Booking Anda Telah Dikonfirmasi" : "Booking Anda Dibatalkan";
      const html = `
        <p>Hi ${updated.guestName},</p>
        <p>Booking Anda untuk <strong>${updated.roomType}</strong> dari <strong>${updated.checkIn.toISOString().slice(0,10)}</strong> sampai <strong>${updated.checkOut.toISOString().slice(0,10)}</strong> telah <strong>${status}</strong>.</p>
        ${updated.room ? `<p>Nomor kamar: <strong>${updated.room.roomNumber}</strong></p>` : ""}
        <p>Total: <strong>Rp ${Number(updated.total).toLocaleString("id-ID")}</strong></p>
        <p>Terima kasih, <br/>Fhandika Boutique</p>
      `;

      try {
        await sendMail({ to: updated.email, subject, html });
      } catch (mailErr) {
        console.error("Gagal mengirim email:", mailErr);
        // jangan return error — email gagal tidak membuat operasi booking gagal
      }
    }

    return res.json(updated);
  } catch (err) {
    console.error("updateBookingStatus:", err);
    return res.status(500).json({ error: "Gagal update booking status" });
  }
};
