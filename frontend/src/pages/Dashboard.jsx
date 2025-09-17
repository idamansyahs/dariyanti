// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import Layout from "../components/Layout";

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/booking");
        setBookings(res.data || []);
      } catch (err) {
        console.error("fetch bookings:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Layout>
      <h1 className="h3 mb-4">Dashboard</h1>

      <section>
        <h2 className="h5 mb-3">Bookings</h2>

        {loading ? (
          <div className="alert alert-info">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="alert alert-secondary">No bookings yet.</div>
        ) : (
          <div className="table-responsive bg-white shadow rounded">
            <table className="table table-striped align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>email</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td>{b.guestName}</td>
                    <td>{b.email}</td>
                    <td>{new Date(b.checkIn).toLocaleDateString()}</td>
                    <td>{new Date(b.checkOut).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </Layout>
  );
}
