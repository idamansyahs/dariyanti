import React, { useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";

export default function BookingForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    guestName: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    roomType: "FBK",
    notes: "",
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State untuk loading

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Mulai loading
    setMessage(""); // Hapus pesan lama

    try {
      const response = await api.post("http://localhost:5000/api/booking-user", formData);
      // setMessage("✅ Terima kasih! Booking Anda telah kami terima dan akan segera diproses.");
      // setFormData({
      //   guestName: "", email: "", phone: "", checkIn: "",
      //   checkOut: "", roomType: "BOUTIQUE", notes: "",
      const newBookingId = response.data.id;
      navigate(`/booking-detail/${newBookingId}`);
    } catch (error) {
      console.error(error);
      setMessage("❌ Maaf, terjadi kesalahan. Gagal mengirim booking, silakan coba lagi!");
    } finally {
      setIsLoading(false); // Selesai loading
    }
  };
  
  const alertClass = message.startsWith("✅") ? "alert-success" : "alert-danger";

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4 p-md-5">
              
              <div className="text-center mb-4">
                <h2 className="card-title fw-bold">Formulir Pemesanan Kamar</h2>
                <p className="text-muted">Isi detail di bawah ini untuk memesan kamar Anda.</p>
              </div>
              
              {message && (
                <div className={`alert ${alertClass}`} role="alert">
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="input-group mb-3">
                  <span className="input-group-text"><i className="bi bi-person-fill"></i></span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nama Lengkap"
                    name="guestName"
                    value={formData.guestName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group mb-3">
                  <span className="input-group-text"><i className="bi bi-envelope-fill"></i></span>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Alamat Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group mb-3">
                  <span className="input-group-text"><i className="bi bi-telephone-fill"></i></span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="No. Handphone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <div className="input-group">
                       <span className="input-group-text"><i className="bi bi-box-arrow-in-right"></i></span>
                       <input
                        type="date"
                        className="form-control"
                        name="checkIn"
                        value={formData.checkIn}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="input-group">
                       <span className="input-group-text"><i className="bi bi-box-arrow-left"></i></span>
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
                </div>

                <div className="input-group mb-3">
                  <span className="input-group-text"><i className="bi bi-door-open-fill"></i></span>
                  <select
                    className="form-select"
                    name="roomType"
                    value={formData.roomType}
                    onChange={handleChange}
                  >
                    <option value="FBK">Fhandika Boutique - 1377K</option>
                    <option value="FSKG">Fhandika SS King - 1077K</option>
                    <option value="FSST">Fhandika SS Twin - 1077K</option>
                    <option value="DXQ">Fhandika DXQ - 877K</option>
                  </select>
                </div>

                <div className="input-group mb-4">
                  <span className="input-group-text"><i className="bi bi-pencil-fill"></i></span>
                  <textarea
                    className="form-control"
                    placeholder="Catatan tambahan (opsional)"
                    name="notes"
                    rows="3"
                    value={formData.notes}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary btn-lg" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span className="ms-2">Mengirim...</span>
                      </>
                    ) : (
                       "Booking Sekarang"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}