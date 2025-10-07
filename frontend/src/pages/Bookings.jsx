import React, { useEffect, useState } from "react";
import api from "../api";
import Layout from "../components/Layout";

// 🔹 Reusable Badge
const StatusBadge = ({ status }) => {
  const colors = {
    PENDING: "secondary",
    CONFIRMED: "primary",
    CHECKED_IN: "success",
    CHECKED_OUT: "dark",
    CANCELLED: "danger",
  };

  return <span className={`badge rounded-pill bg-${colors[status]}`}>{status}</span>;
};

// 🔹 Reusable Status Select
const StatusSelect = ({ value, onChange }) => (
  <select className="form-select form-select-sm mt-1" value={value} onChange={onChange}>
    {["PENDING", "CONFIRMED", "CHECKED_IN", "CHECKED_OUT", "CANCELLED"].map((s) => (
      <option key={s} value={s}>
        {s}
      </option>
    ))}
  </select>
);

const BookingAdmin = () => {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [newBooking, setNewBooking] = useState({
    guestName: "",
    email: "",
    phone: "",
    notes: "",
    checkIn: "",
    checkOut: "",
    roomId: "",
    roomType: "",
    nights: 0,
    pricePerNight: 0,
    total: 0,
  });

  const token = localStorage.getItem("token");

  // --- FETCHING DATA ---
  useEffect(() => {
    fetchRooms();
    fetchBookings();
  }, );

  const fetchRooms = async () => {
    try {
      const res = await api.get("/api/room", { headers: { Authorization: `Bearer ${token}` } });
      setRooms(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await api.get("/api/booking", { headers: { Authorization: `Bearer ${token}` } });
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // --- HELPER ---
  const calculateNightsAndTotal = (bookingData) => {
    let nights = 0;
    let total = 0;

    if (bookingData.checkIn && bookingData.checkOut) {
      const start = new Date(bookingData.checkIn);
      const end = new Date(bookingData.checkOut);
      nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    }

    if (bookingData.pricePerNight && nights > 0) total = nights * bookingData.pricePerNight;
    return { nights, total };
  };

  // --- CRUD ---
  const handleCreateBooking = async () => {
    try {
      const { nights, total } = calculateNightsAndTotal(newBooking);
      const payload = { ...newBooking, nights, total };

      await api.post("/api/booking", payload, { headers: { Authorization: `Bearer ${token}` } });

      fetchBookings();
      fetchRooms();

      // reset form
      setNewBooking({
        guestName: "",
        email: "",
        phone: "",
        notes: "",
        checkIn: "",
        checkOut: "",
        roomId: "",
        roomType: "",
        nights: 0,
        pricePerNight: 0,
        total: 0,
      });

      const modal = window.bootstrap.Modal.getInstance(document.getElementById("addBookingModal"));
      modal?.hide();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/api/booking/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      fetchBookings();
      fetchRooms();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm("Hapus booking ini?")) return;
    try {
      await api.delete(`/api/booking/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchBookings();
      fetchRooms();
    } catch (err) {
      console.error(err);
    }
  };

  const checkAvailability = async () => {
    if (!newBooking.roomType || !newBooking.checkIn || !newBooking.checkOut) {
      alert("Pilih Room Type, Check-In, dan Check-Out dulu!");
      return;
    }
    try {
      const res = await api.get("/api/available", {
        params: {
          type: newBooking.roomType,
          checkIn: newBooking.checkIn,
          checkOut: newBooking.checkOut,
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      setAvailableRooms(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateRoom = async () => {
    if (!selectedBooking || !selectedRoomId) return;

    const selectedRoom = rooms.find((r) => r.id === selectedRoomId);

    // hitung nights & total
    let nights = 0;
    let total = 0;
    if (selectedBooking.checkIn && selectedBooking.checkOut) {
      const start = new Date(selectedBooking.checkIn);
      const end = new Date(selectedBooking.checkOut);
      nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    }
    if (selectedRoom?.price && nights > 0) {
      total = nights * selectedRoom.price;
    }

    await api.put(
      `/api/booking/${selectedBooking.id}`,
      {
        roomId: selectedRoomId,
        roomType: selectedRoom?.type || selectedBooking.roomType,
        pricePerNight: selectedRoom?.price || 0,
        nights,
        total,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setSelectedBooking(null);
    setSelectedRoomId(null);
    fetchBookings();
    fetchRooms();
  };

  // --- UI ---
  return (
    <Layout>
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-primary">📋 Booking Management</h2>
          <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addBookingModal">
            + Add Booking
          </button>
        </div>

        {/* Booking Table */}
        <div className="table-responsive shadow-sm rounded">
          <table className="table table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Guest</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Room Type</th>
                <th>Room</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Nights</th>
                <th>Price/Night</th>
                <th>Total</th>
                <th>Status</th>
                <th>Notes</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td className="fw-semibold">{b.guestName}</td>
                  <td>{b.email}</td>
                  <td>{b.phone}</td>
                  <td>{b.roomType}</td>
                  <td>{b.room ? b.room.roomNumber : "-"}</td>
                  <td>{new Date(b.checkIn).toLocaleDateString()}</td>
                  <td>{new Date(b.checkOut).toLocaleDateString()}</td>
                  <td>{b.nights}</td>
                  <td>Rp {b.pricePerNight ?? "-"}</td>
                  <td className="fw-bold text-success">Rp {b.total ?? "-"}</td>
                  <td>
                    <StatusBadge status={b.status} />
                    <StatusSelect value={b.status} onChange={(e) => handleUpdateStatus(b.id, e.target.value)} />
                  </td>
                  <td>{b.notes}</td>
                  <td className="text-center">
                    {!b.roomId && (
                      <button
                        className="btn btn-sm btn-warning me-2"
                        data-bs-toggle="modal"
                        data-bs-target="#assignRoomModal"
                        onClick={() => setSelectedBooking(b)}
                      >
                        🛏 Assign
                      </button>
                    )}
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteBooking(b.id)}>
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 🔹 Modal Create Booking */}
        <div className="modal fade" id="addBookingModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content shadow-lg">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">➕ Add New Booking</h5>
                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
              </div>

              <div className="modal-body">
                <div className="card border-0">
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Guest Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={newBooking.guestName}
                          onChange={(e) => setNewBooking({ ...newBooking, guestName: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          value={newBooking.email}
                          onChange={(e) => setNewBooking({ ...newBooking, email: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Phone</label>
                        <input
                          type="text"
                          className="form-control"
                          value={newBooking.phone}
                          onChange={(e) => setNewBooking({ ...newBooking, phone: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Notes</label>
                        <input
                          type="text"
                          className="form-control"
                          value={newBooking.notes}
                          onChange={(e) => setNewBooking({ ...newBooking, notes: e.target.value })}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Room Type</label>
                        <select
                          className="form-select"
                          value={newBooking.roomType}
                          onChange={(e) => setNewBooking({ ...newBooking, roomType: e.target.value, roomId: "" })}
                        >
                          <option value="">-- Select Type --</option>
                          <option value="FBK">BOUTIQUE</option>
                          <option value="FSKG">SS KING</option>
                          <option value="FSST">SS TWIN</option>
                          <option value="DXQ">DXQ</option>
                        </select>
                      </div>

                      <div className="col-md-3">
                        <label className="form-label">Check In</label>
                        <input
                          type="date"
                          className="form-control"
                          value={newBooking.checkIn}
                          onChange={(e) => setNewBooking({ ...newBooking, checkIn: e.target.value })}
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Check Out</label>
                        <input
                          type="date"
                          className="form-control"
                          value={newBooking.checkOut}
                          onChange={(e) => setNewBooking({ ...newBooking, checkOut: e.target.value })}
                        />
                      </div>

                      <div className="col-12">
                        <button type="button" className="btn btn-outline-primary w-100" onClick={checkAvailability}>
                          🔍 Check Available Rooms
                        </button>
                      </div>

                      {availableRooms.length > 0 && (
                        <div className="col-12">
                          <label className="form-label">Available Rooms</label>
                          <select
                            className="form-select"
                            value={newBooking.roomId}
                            onChange={(e) => {
                              const selected = availableRooms.find((r) => r.id === Number(e.target.value));
                              const updated = {
                                ...newBooking,
                                roomId: e.target.value,
                                roomType: selected ? selected.type : newBooking.roomType,
                                pricePerNight: selected ? selected.price : newBooking.pricePerNight,
                              };
                              const { nights, total } = calculateNightsAndTotal(updated);
                              setNewBooking({ ...updated, nights, total });
                            }}
                          >
                            <option value="">-- Select Room --</option>
                            {availableRooms.map((r) => (
                              <option key={r.id} value={r.id}>
                                Room {r.roomNumber} - {r.type} (Rp {r.price})
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div className="col-md-4">
                        <label className="form-label">Price/Night</label>
                        <input type="number" className="form-control" value={newBooking.pricePerNight || ""} readOnly />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Nights</label>
                        <input type="number" className="form-control" value={newBooking.nights || 0} readOnly />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Total</label>
                        <input type="number" className="form-control" value={newBooking.total || 0} readOnly />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" data-bs-dismiss="modal">
                  ❌ Cancel
                </button>
                <button className="btn btn-success" onClick={handleCreateBooking}>
                  💾 Save Booking
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 🔹 Modal Assign Room */}
        <div className="modal fade" id="assignRoomModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg">
              <div className="modal-header bg-warning">
                <h5 className="modal-title">🛏 Assign Room</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body">
                {selectedBooking && (
                  <div className="card border-0">
                    <div className="card-body">
                      <p className="fw-semibold">
                        Assign room for: <span className="text-primary">{selectedBooking.guestName}</span>
                      </p>

                      <div className="mb-3">
                        <label className="form-label">Room Type</label>
                        <select
                          className="form-select"
                          value={selectedBooking.roomType || ""}
                          onChange={(e) =>
                            setSelectedBooking({ ...selectedBooking, roomType: e.target.value })
                          }
                        >
                          <option value="">-- Select Type --</option>
                          <option value="FBK">BOUTIQUE</option>
                          <option value="FSKG">SS KING</option>
                          <option value="FSST">SS TWIN</option>
                          <option value="DXQ">DXQ</option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Available Rooms</label>
                        <select
                          className="form-select"
                          value={selectedRoomId || ""}
                          onChange={(e) => setSelectedRoomId(Number(e.target.value))}
                        >
                          <option value="">-- Select Room --</option>
                          {rooms
                            .filter(
                              (r) =>
                                r.type === selectedBooking.roomType &&
                                r.status !== "OCCUPIED" &&
                                r.status !== "OOO"
                            )
                            .map((r) => (
                              <option key={r.id} value={r.id}>
                                Room {r.roomNumber} - {r.type} (Rp {r.price})
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" data-bs-dismiss="modal">
                  ❌ Cancel
                </button>
                <button className="btn btn-primary" onClick={handleUpdateRoom} data-bs-dismiss="modal">
                  💾 Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookingAdmin;
