import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Helper untuk format mata uang
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Helper untuk format tanggal
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default function BookingDetail() {
  // Menghitung durasi menginap
  const checkInDate = new Date(booking.checkIn);
  const checkOutDate = new Date(booking.checkOut);
  const duration = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);
  const { bookingId } = useParams(); // 2. Dapatkan parameter `bookingId` dari URL
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 3. Fungsi untuk mengambil data booking dari API berdasarkan ID
    const fetchBookingData = async () => {
      try {
        // Ganti dengan endpoint API Anda untuk mengambil detail booking
        // const response = await api.get(`/api/booking/${bookingId}`); 
        // setBooking(response.data);

        // --- Simulasi data untuk tujuan demonstrasi ---
        console.log("Fetching data for booking ID:", bookingId);
        const dummyBookingData = {
          id: bookingId,
          guestName: "Data dari API",
          roomType: "Fhandika SS",
          checkIn: "2025-12-01",
          checkOut: "2025-12-03",
          totalAmount: 2154000,
        };
        setBooking(dummyBookingData);
        // --- Akhir dari simulasi ---

      } catch (err) {
        setError("Gagal memuat detail pesanan.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingData();
  }, [bookingId]); // Efek ini akan berjalan setiap kali bookingId berubah

  if (loading) {
    return <div className="text-center my-5"><h2>Memuat Detail Pesanan...</h2></div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center my-5">{error}</div>;
  }
  
  if (!booking) {
    return null; // atau tampilkan pesan 'tidak ditemukan'
  }

  return (
    <div className="container my-5">
      {/* --- JUDUL HALAMAN --- */}
      <div className="text-center mb-5">
        <h1 className="fw-bold">Selesaikan Pembayaran Anda</h1>
        <p className="text-muted">
          Pesanan Anda akan dikonfirmasi setelah pembayaran berhasil.
        </p>
      </div>

      <div className="row g-4">
        {/* --- KOLOM KIRI: DETAIL PESANAN --- */}
        <div className="col-md-7">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="bi bi-receipt-cutoff me-2"></i>Detail Pesanan Anda
              </h5>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between">
                  <span>ID Booking</span>
                  <strong>#{booking.id}</strong>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span>Nama Pemesan</span>
                  <strong>{booking.guestName}</strong>
                </li>
                 <li className="list-group-item d-flex justify-content-between">
                  <span>Tipe Kamar</span>
                  <strong>{booking.roomType}</strong>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span>Check-in</span>
                  <strong>{formatDate(booking.checkIn)}</strong>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span>Check-out</span>
                  <strong>{formatDate(booking.checkOut)}</strong>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span>Durasi</span>
                  <strong>{duration} malam</strong>
                </li>
              </ul>
              <hr />
              <div className="d-flex justify-content-between align-items-center mt-3 px-2">
                <h5 className="mb-0">Total Pembayaran</h5>
                <h4 className="mb-0 fw-bold text-primary">
                  {formatCurrency(booking.totalAmount)}
                </h4>
              </div>
            </div>
          </div>
        </div>

        {/* --- KOLOM KANAN: OPSI PEMBAYARAN --- */}
        <div className="col-md-5">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-light">
              <h5 className="mb-0">
                <i className="bi bi-credit-card-fill me-2"></i>Pilih Metode Pembayaran
              </h5>
            </div>
            <div className="card-body">
              <div className="accordion" id="paymentAccordion">
                
                {/* Opsi 1: QRIS */}
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingQris">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseQris" aria-expanded="true" aria-controls="collapseQris">
                      <i className="bi bi-qr-code-scan me-2"></i>
                      <strong>Bayar dengan QRIS</strong>
                    </button>
                  </h2>
                  <div id="collapseQris" className="accordion-collapse collapse show" aria-labelledby="headingQris" data-bs-parent="#paymentAccordion">
                    <div className="accordion-body text-center">
                       <p>Scan kode QR di bawah ini menggunakan aplikasi E-Wallet/Mobile Banking Anda.</p>
                       {/* Ganti dengan gambar QRIS asli Anda */}
                       <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=ContohDataQRIS" alt="QRIS Code" className="img-fluid rounded" />
                       <div className="alert alert-info mt-3">
                         Pastikan jumlah pembayaran sebesar <strong>{formatCurrency(booking.totalAmount)}</strong>.
                       </div>
                    </div>
                  </div>
                </div>

                {/* Opsi 2: Bank Transfer BSI */}
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingBsi">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseBsi" aria-expanded="false" aria-controls="collapseBsi">
                       <i className="bi bi-bank me-2"></i>
                      <strong>Transfer Bank (BSI)</strong>
                    </button>
                  </h2>
                  <div id="collapseBsi" className="accordion-collapse collapse" aria-labelledby="headingBsi" data-bs-parent="#paymentAccordion">
                    <div className="accordion-body">
                      <p>Silakan transfer ke rekening berikut:</p>
                      <ul className="list-group">
                         <li className="list-group-item"><strong>Bank:</strong> Bank Syariah Indonesia (BSI)</li>
                         <li className="list-group-item"><strong>No. Rekening:</strong> 71234567890</li>
                         <li className="list-group-item"><strong>Atas Nama:</strong> PT Fhandika Hotel Sejahtera</li>
                      </ul>
                       <div className="alert alert-warning mt-3">
                         Penting: Mohon transfer sejumlah <strong>{formatCurrency(booking.totalAmount)}</strong> agar pesanan dapat diproses secara otomatis.
                       </div>
                    </div>
                  </div>
                </div>

              </div>
               <div className="d-grid mt-4">
                 <button className="btn btn-success">
                   <i className="bi bi-check-circle-fill me-2"></i>
                   Saya Sudah Bayar
                 </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}