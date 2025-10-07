// src/controllers/roomController.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// helper validasi enum simple
const ROOM_TYPES = ["FBK", "FSKG", "FSST", "DXQ"];
const ROOM_STATUS = ["VCN", "VCI", "OCCUPIED", "VDN", "OOO"];

export const getRooms = async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({ orderBy: { roomNumber: "asc" } });
    res.json(rooms);
  } catch (err) {
    console.error("getRooms:", err);
    res.status(500).json({ error: "Gagal mengambil daftar kamar" });
  }
};

export const getRoomById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const room = await prisma.room.findUnique({ where: { id } });
    if (!room) return res.status(404).json({ error: "Room tidak ditemukan" });
    res.json(room);
  } catch (err) {
    console.error("getRoomById:", err);
    res.status(500).json({ error: "Gagal mengambil detail kamar" });
  }
};

export const createRoom = async (req, res) => {
  try {
    const { roomNumber, type, price, status } = req.body;

    // basic validation
    if (!roomNumber || !type || price == null) {
      return res.status(400).json({ error: "roomNumber, type dan price wajib diisi" });
    }
    if (!ROOM_TYPES.includes(type)) {
      return res.status(400).json({ error: `type invalid. Pilih salah satu: ${ROOM_TYPES.join(", ")}` });
    }
    if (status && !ROOM_STATUS.includes(status)) {
      return res.status(400).json({ error: `status invalid. Pilih salah satu: ${ROOM_STATUS.join(", ")}` });
    }

    const created = await prisma.room.create({
      data: {
        roomNumber,
        type,
        price: Number(price),
        status: status || "VCN",
      },
    });

    res.status(201).json(created);
  } catch (err) {
    console.error("createRoom:", err);
    // handle unique constraint error (roomNumber)
    if (err.code === "P2002") {
      return res.status(400).json({ error: "roomNumber sudah ada" });
    }
    res.status(500).json({ error: "Gagal membuat kamar" });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { roomNumber, type, price, status } = req.body;

    if (type && !ROOM_TYPES.includes(type)) {
      return res.status(400).json({ error: `type invalid. Pilih salah satu: ${ROOM_TYPES.join(", ")}` });
    }
    if (status && !ROOM_STATUS.includes(status)) {
      return res.status(400).json({ error: `status invalid. Pilih salah satu: ${ROOM_STATUS.join(", ")}` });
    }

    const updated = await prisma.room.update({
      where: { id },
      data: {
        ...(roomNumber !== undefined ? { roomNumber } : {}),
        ...(type !== undefined ? { type } : {}),
        ...(price !== undefined ? { price: Number(price) } : {}),
        ...(status !== undefined ? { status } : {}),
      },
    });

    res.json(updated);
  } catch (err) {
    console.error("updateRoom:", err);
    if (err.code === "P2025") return res.status(404).json({ error: "Room tidak ditemukan" });
    if (err.code === "P2002") return res.status(400).json({ error: "roomNumber conflict" });
    res.status(500).json({ error: "Gagal mengupdate kamar" });
  }
};

export const updateRoomStatus = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    if (!status || !ROOM_STATUS.includes(status)) {
      return res.status(400).json({ error: `status invalid. Pilih salah satu: ${ROOM_STATUS.join(", ")}` });
    }

    const updated = await prisma.room.update({
      where: { id },
      data: { status },
    });

    res.json(updated);
  } catch (err) {
    console.error("updateRoomStatus:", err);
    if (err.code === "P2025") return res.status(404).json({ error: "Room tidak ditemukan" });
    res.status(500).json({ error: "Gagal mengupdate status kamar" });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.room.delete({ where: { id } });
    res.json({ message: "Room berhasil dihapus" });
  } catch (err) {
    console.error("deleteRoom:", err);
    if (err.code === "P2025") return res.status(404).json({ error: "Room tidak ditemukan" });
    res.status(500).json({ error: "Gagal menghapus kamar" });
  }
};
