import React, { useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";

export default function BookingForm() {

  const initialState = {
    guestName: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    roomType: "",
    notes: "",
  };

  const [formData, setFormData] = useState(initialState);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State untuk loading

  const [isChecking, setIsChecking] = useState(false);
  const [availability, setAvailability] = useState({
    checked: false,
    available: false,
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckAvailability = async () => {
    // Validasi input sebelum mengirim
    if (!formData.checkIn || !formData.checkOut || !formData.roomType) {
      setAvailability({
        checked: true,
        available: false,
        message: "⚠️ Silakan pilih tanggal check-in, check-out, dan tipe kamar terlebih dahulu.",
      });
      return;
    }

    setIsChecking(true);
    setAvailability({ checked: false, message: "" }); // Reset status

    try {
      const response = await api.get("/api/check-availability", {
        params: {
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          roomType: formData.roomType,
        },
      });
      setAvailability({
        checked: true,
        available: response.data.available,
        message: response.data.message,
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Gagal memeriksa ketersediaan.";
      setAvailability({
        checked: true,
        available: false,
        message: `❌ ${errorMessage}`,
      });
    } finally {
      setIsChecking(false);
    }
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
      navigate(`/rooms/booking/detail/${newBookingId}`);
    } catch (error) {
      console.error(error);
      setMessage("❌ Maaf, terjadi kesalahan. Gagal mengirim booking, silakan coba lagi!");
    } finally {
      setIsLoading(false); // Selesai loading
    }
  };

  const handleReset = () => {
    setFormData(initialState); // Kembalikan state ke awal
    setMessage(""); // Hapus pesan error/sukses jika ada

    setAvailability({
      checked: false,
      available: false,
      message: "",
    });
  };
  
  const alertClass = message.startsWith("✅") ? "alert-success" : "alert-danger";

  // Mendapatkan tanggal hari ini dalam format YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4 p-md-5 position-relative">
              
              <button
                type="button"
                className="btn btn-link text-secondary position-absolute top-0 start-0 mt-3 ms-3"
                onClick={() => navigate(-1)}
              >
                <i className="bi bi-arrow-left"></i>
              </button>
              
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
                        min={today}
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
                        min={formData.checkIn}
                        disabled={!formData.checkIn}
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
                    required
                  >
                    <option value="" disabled>--- Pilih Tipe Kamar ---</option>
                    <option value="FBK">Fhandika Boutique - 1377K</option>
                    <option value="FSKG">Fhandika SS King - 1077K</option>
                    <option value="FSST">Fhandika SS Twin - 1077K</option>
                    <option value="DXQ">Fhandika DXQ - 877K</option>
                  </select>
                </div>

                <div className="text-center mb-3">
                  <button
                    type="button"
                    className="btn btn-outline-info"
                    onClick={handleCheckAvailability}
                    disabled={isChecking || !formData.checkIn || !formData.checkOut || !formData.roomType}
                  >
                    {isChecking ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span className="ms-2">Mengecek...</span>
                      </>
                    ) : (
                      "Cek Ketersediaan Kamar"
                    )}
                  </button>
                </div>

                {availability.checked && (
                  <div 
                    className={`alert ${availability.available ? 'alert-success' : 'alert-warning'}`} 
                    role="alert"
                  >
                    {availability.available ? `✅ ${availability.message}` : `⚠️ ${availability.message}`}
                  </div>
                )}


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

                <div className="d-flex justify-content-center gap-5">
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={handleReset}
                  >
                    Kosongkan Form
                  </button>
                  <button type="submit" className="btn btn-primary px-4" disabled={isLoading}>
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