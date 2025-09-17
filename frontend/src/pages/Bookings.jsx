import React, { useEffect, useState } from "react";
import api from "../api";
import Layout from "../components/Layout";

export default function BookingAdmin() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/api/booking", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(
        `/api/booking/${id}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchBookings();
    } catch (err) {
      console.error("Error updating booking:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <Layout>
      <div className="container mt-4">
        <h2>Manajemen Booking</h2>
        <table className="table table-bordered mt-3">
          <thead>
            <tr>
              <th>Nama Tamu</th>
              <th>Email</th>
              <th>Kamar</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{b.guestName}</td>
                <td>{b.email}</td>
                <td>{b.room?.roomNumber} ({b.room?.type})</td>
                <td>{new Date(b.checkIn).toLocaleDateString()}</td>
                <td>{new Date(b.checkOut).toLocaleDateString()}</td>
                <td>
                  <span className="badge bg-info">{b.status}</span>
                </td>
                <td>
                  <select
                    value={b.status}
                    onChange={(e) => updateStatus(b.id, e.target.value)}
                    className="form-select"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="CHECKED_IN">Checked In</option>
                    <option value="CHECKED_OUT">Checked Out</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center text-muted">
                  Belum ada booking
                </td>
              </tr>
            )}
          </tbody>
        </table>

      </div>

    </Layout>
  );
}
