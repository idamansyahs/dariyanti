import React from "react";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";

export default function RoomAdmin() {
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({ roomNumber: "", type: "", price: "" });
  const [editingRoom, setEditingRoom] = useState(null);

  // Fetch data
  const fetchRooms = async () => {
    const res = await fetch("http://localhost:5000/api/room", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const data = await res.json();
    setRooms(data);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit tambah / edit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editingRoom ? "PUT" : "POST";
    const url = editingRoom
      ? `http://localhost:5000/api/room/${editingRoom.id}`
      : "http://localhost:5000/api/room";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(form),
    });

    await fetchRooms();
    setForm({ roomNumber: "", type: "", price: "" });
    setEditingRoom(null);

    // Tutup modal secara manual (Bootstrap 5)
    const modalEl = document.getElementById("roomModal");
    const modal = window.bootstrap.Modal.getInstance(modalEl);
    modal.hide();
  };

  // Edit room
  const handleEdit = (room) => {
    setForm({
      roomNumber: room.roomNumber,
      type: room.type,
      price: room.price,
    });
    setEditingRoom(room);
    const modal = new window.bootstrap.Modal(
      document.getElementById("roomModal")
    );
    modal.show();
  };

  // Hapus room
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus kamar ini?")) return;
    await fetch(`http://localhost:5000/api/room/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setRooms(rooms.filter((r) => r.id !== id));
  };

  // Buka modal tambah
  const openAddModal = () => {
    setForm({ roomNumber: "", type: "", price: "" });
    setEditingRoom(null);
    const modal = new window.bootstrap.Modal(
      document.getElementById("roomModal")
    );
    modal.show();
  };

  return (
    <Layout>
      <div className="container mt-5">
        <h1 className="mb-4">🏨 Manajemen Kamar</h1>

        <button className="btn btn-primary mb-3" onClick={openAddModal}>
          Tambah Kamar
        </button>

        {/* Tabel */}
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-light">
              <tr>
                <th>No Kamar</th>
                <th>Jenis</th>
                <th>Harga</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rooms.length > 0 ? (
                rooms.map((room) => (
                  <tr key={room.id}>
                    <td>{room.roomNumber}</td>
                    <td>{room.type}</td>
                    <td>Rp {room.price.toLocaleString()}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEdit(room)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(room.id)}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-muted py-4">
                    Belum ada data kamar
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Tambah / Edit */}
        <div
          className="modal fade"
          id="roomModal"
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <form className="modal-content" onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingRoom ? "Edit Kamar" : "Tambah Kamar"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Nomor Kamar</label>
                  <input
                    type="text"
                    name="roomNumber"
                    className="form-control"
                    value={form.roomNumber}
                    onChange={handleChange}
                    required
                    disabled={!!editingRoom} // no kamar tidak bisa diubah saat edit
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Jenis Kamar</label>
                  <select
                    name="type"
                    className="form-select"
                    value={form.type}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Pilih --</option>
                    <option value="BOUTIQUE">Boutique</option>
                    <option value="SS">SS</option>
                    <option value="DXQ">DXQ</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Harga</label>
                  <input
                    type="number"
                    name="price"
                    className="form-control"
                    value={form.price}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingRoom ? "Simpan Perubahan" : "Tambah Kamar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
