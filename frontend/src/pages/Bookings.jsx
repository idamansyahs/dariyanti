import React, { useEffect, useState } from "react";
import api from "../api";
import Layout from "../components/Layout";

const BookingAdmin = () => {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
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

  useEffect(() => {
    fetchRooms();
    fetchBookings();
  }, []);

  const fetchRooms = async () => {
    const res = await api.get("/api/room", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRooms(res.data);
  };

  const fetchBookings = async () => {
    const res = await api.get("/api/booking", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setBookings(res.data);
  };

  const calculateNightsAndTotal = (bookingData) => {
    let nights = 0;
    let total = 0;

    if (bookingData.checkIn && bookingData.checkOut) {
      const start = new Date(bookingData.checkIn);
      const end = new Date(bookingData.checkOut);
      nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    }

    if (bookingData.pricePerNight && nights > 0) {
      total = nights * bookingData.pricePerNight;
    }

    return { nights, total };
  };

  const handleCreateBooking = async () => {
    const { nights, total } = calculateNightsAndTotal(newBooking);
    const bookingToSend = { ...newBooking, nights, total };

    await api.post("/api/booking", bookingToSend, {
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchBookings();

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
  };

  const handleUpdateStatus = async (id, status) => {
    await api.put(
      `/api/booking/${id}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchBookings();
  };

  const handleDeleteBooking = async (id) => {
    await api.delete(`/api/booking/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchBookings();
  };

  return (
    <Layout>
      <div className="container mt-4">
        <h2>Booking Management</h2>
        <button
          className="btn btn-primary mb-3"
          data-bs-toggle="modal"
          data-bs-target="#addBookingModal"
        >
          Add Booking
        </button>

        {/* Table Booking */}
        <table className="table table-bordered table-striped">
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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{b.guestName}</td>
                <td>{b.email}</td>
                <td>{b.phone}</td>
                <td>{b.roomType}</td>
                <td>{b.room ? b.room.roomNumber : "-"}</td>
                <td>{new Date(b.checkIn).toLocaleDateString()}</td>
                <td>{new Date(b.checkOut).toLocaleDateString()}</td>
                <td>{b.nights}</td>
                <td>{b.pricePerNight}</td>
                <td>{b.total}</td>
                <td>
                  <select
                    value={b.status}
                    onChange={(e) => handleUpdateStatus(b.id, e.target.value)}
                    className="form-select form-select-sm"
                  >
                    <option>PENDING</option>
                    <option>CONFIRMED</option>
                    <option>CHECKED_IN</option>
                    <option>CHECKED_OUT</option>
                    <option>CANCELLED</option>
                  </select>
                </td>
                <td>{b.notes}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteBooking(b.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal Create Booking */}
        <div
          className="modal fade"
          id="addBookingModal"
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Booking</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                ></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  placeholder="Guest Name"
                  className="form-control mb-2"
                  value={newBooking.guestName}
                  onChange={(e) =>
                    setNewBooking({ ...newBooking, guestName: e.target.value })
                  }
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="form-control mb-2"
                  value={newBooking.email}
                  onChange={(e) =>
                    setNewBooking({ ...newBooking, email: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Phone"
                  className="form-control mb-2"
                  value={newBooking.phone}
                  onChange={(e) =>
                    setNewBooking({ ...newBooking, phone: e.target.value })
                  }
                />
                <textarea
                  placeholder="Notes"
                  className="form-control mb-2"
                  value={newBooking.notes}
                  onChange={(e) =>
                    setNewBooking({ ...newBooking, notes: e.target.value })
                  }
                />

                {/* Pilih RoomType */}
                <div className="mb-2">
                  <label className="form-label">Room Type</label>
                  <select
                    className="form-select"
                    value={newBooking.roomType}
                    onChange={(e) =>
                      setNewBooking({ ...newBooking, roomType: e.target.value })
                    }
                  >
                    <option value="">-- Pilih Room Type --</option>
                    <option value="BOUTIQUE">BOUTIQUE</option>
                    <option value="SS">SS</option>
                    <option value="DXQ">DXQ</option>
                  </select>
                </div>

                {/* Pilih Room (optional) */}
                <div className="mb-2">
                  <label className="form-label">Room (Optional)</label>
                  <select
                    className="form-select"
                    value={newBooking.roomId}
                    onChange={(e) => {
                      const room = rooms.find(
                        (r) => r.id === parseInt(e.target.value)
                      );
                      const updated = {
                        ...newBooking,
                        roomId: e.target.value,
                        pricePerNight: room ? room.price : 0,
                      };
                      const { nights, total } =
                        calculateNightsAndTotal(updated);
                      setNewBooking({ ...updated, nights, total });
                    }}
                  >
                    <option value="">-- Pilih Kamar --</option>
                    {rooms.map((room) => (
                      <option key={room.id} value={room.id}>
                        {room.roomNumber} - {room.type} (Rp {room.price})
                      </option>
                    ))}
                  </select>
                </div>

                <input
                  type="date"
                  className="form-control mb-2"
                  value={newBooking.checkIn}
                  onChange={(e) => {
                    const updated = { ...newBooking, checkIn: e.target.value };
                    const { nights, total } = calculateNightsAndTotal(updated);
                    setNewBooking({ ...updated, nights, total });
                  }}
                />
                <input
                  type="date"
                  className="form-control mb-2"
                  value={newBooking.checkOut}
                  onChange={(e) => {
                    const updated = { ...newBooking, checkOut: e.target.value };
                    const { nights, total } = calculateNightsAndTotal(updated);
                    setNewBooking({ ...updated, nights, total });
                  }}
                />

                <div className="row">
                  <div className="col">
                    <label>Price/Night</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newBooking.pricePerNight}
                      readOnly
                    />
                  </div>
                  <div className="col">
                    <label>Nights</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newBooking.nights}
                      readOnly
                    />
                  </div>
                  <div className="col">
                    <label>Total</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newBooking.total}
                      readOnly
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                  onClick={handleCreateBooking}
                >
                  Save Booking
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
