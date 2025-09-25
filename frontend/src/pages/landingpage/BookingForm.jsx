import React, { useState } from "react";
import api from "../../api";

export default function BookingForm() {
  const [formData, setFormData] = useState({
    guestName: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    roomType: "BOUTIQUE", // default
    notes: "",
  });

  const [message, setMessage] = useState("");

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("http://localhost:5000/api/booking-user", formData);
      setMessage("✅ Terima kasih, booking anda sedang diproses.");
      setFormData({
        guestName: "",
        email: "",
        phone: "",
        checkIn: "",
        checkOut: "",
        roomType: "BOUTIQUE",
        notes: "",
      });
    } catch (error) {
      console.error(error);
      setMessage("❌ Gagal mengirim booking, coba lagi!");
    }
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4">Booking Kamar</h2>
      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nama Lengkap</label>
          <input
            type="text"
            className="form-control"
            name="guestName"
            value={formData.guestName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">No HP</label>
          <input
            type="text"
            className="form-control"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Check-In</label>
            <input
              type="date"
              className="form-control"
              name="checkIn"
              value={formData.checkIn}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Check-Out</label>
            <input
              type="date"
              className="form-control"
              name="checkOut"
              value={formData.checkOut}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Tipe Kamar</label>
          <select
            className="form-select"
            name="roomType"
            value={formData.roomType}
            onChange={handleChange}
          >
            <option value="BOUTIQUE">Fhandika Boutique - 1377K</option>
            <option value="SS">Fhandika SS - 1077K</option>
            <option value="DXQ">Fhandika DXQ - 877K</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Catatan</label>
          <textarea
            className="form-control"
            name="notes"
            rows="3"
            value={formData.notes}
            onChange={handleChange}
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary">
          Booking Sekarang
        </button>
      </form>
    </div>
  );
}
