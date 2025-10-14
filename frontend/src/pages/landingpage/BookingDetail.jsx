import React, { useState, useEffect } from 'react';
import { /*useLocation,*/ useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import axios from 'axios';

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

// Objek untuk memetakan kode tipe kamar ke nama lengkapnya
const roomTypeMapping = {
  FBK: "Fhandika Boutique",
  FSKG: "Fhandika SS King",
  FSST: "Fhandika SS Twin",
  DXQ: "Fhandika DXQ",
};

// Fungsi untuk mendapatkan nama lengkap, dengan fallback jika kode tidak ditemukan
const getRoomTypeName = (typeCode) => {
  return roomTypeMapping[typeCode] || typeCode; // Jika tidak ada di map, tampilkan kode aslinya
};

// Komponen BookingDetail
const BookingDetail = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fungsi untuk memproses pembayaran
    const processPayment = async () => {
        if (!booking) return;

        try {
            const response = await axios.post('http://localhost:5000/api/booking/pembayaran', {
                bookingId: booking.id,
                totalPrice: booking.total,
                guestName: booking.guestName,
                email: booking.email
            });

            const transactionToken = response.data.token;

           if (transactionToken) {
          window.snap.pay(transactionToken, {
          onSuccess: function (result) {
            console.log('Pembayaran Sukses:', result);
            navigate(`/pembayaran-berhasil?order_id=${result.order_id}&status_code=${result.status_code}&transaction_status=${result.transaction_status}`);
          },
          onPending: function (result) {
            console.log('Pembayaran Pending:', result);
            // Anda bisa navigasi ke halaman pending jika perlu
          },
          onError: function (result) {
            console.log('Pembayaran Gagal:', result);
            navigate(`/pembayaran-berhasil?order_id=${result.order_id}&status_code=${result.status_code}&transaction_status=${result.transaction_status}`);
          },
          onClose: function () {
            console.log('Anda belum menyelesaikan pembayaran');
            // Tidak perlu melakukan apa-apa di sini, user bisa menekan tombol "Bayar" lagi
          }
        });
      } 
        } catch (error) {
            console.error("Gagal mendapatkan token pembayaran:", error);
            setError("Gagal memulai sesi pembayaran. Silakan coba lagi.");
            // Tampilkan pesan error kepada user
        }
    };

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await api.get(`/api/booking-user/${bookingId}`);
        setBooking(response.data);
      } catch (err) {
        setError("Gagal memuat detail pesanan atau pesanan tidak ditemukan.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBookingData();
    }
  }, [bookingId]);

  
  if (loading) {
    return <div className="text-center my-5"><h2>Memuat Detail Pesanan...</h2></div>;
  }
  if (error) {
    return <div className="alert alert-danger text-center my-5">{error}</div>;
  }
  if (!booking) {
    return <div className="text-center my-5"><h2>Detail Pesanan Tidak Ditemukan.</h2></div>;
  }

  // Hitung durasi setelah data 'booking' ada
  const checkInDate = new Date(booking.checkIn);
  const checkOutDate = new Date(booking.checkOut);
  const duration = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)) || 1;

  return (
    <div className="container my-5">
      {/* ... (JUDUL HALAMAN) ... */}
      <div className="text-center mb-5">
        <h1 className="fw-bold">Selesaikan Pembayaran Anda</h1>
        <p className="text-muted">
          Pesanan Anda akan dikonfirmasi setelah pembayaran berhasil.
        </p>
      </div>

      <div className="row g-4 justify-content-center">
        <div className="col-md-7">
          <div className="card shadow-sm border-0 h-100">
            {/* ... (CARD HEADER) ... */}
            <div className="card-body">
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between">
                  <span>ID Booking</span>
                  <strong>#{booking.bookingCode || booking.id}</strong>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span>Nama Pemesan</span>
                  <strong>{booking.guestName}</strong>
                </li>
                 <li className="list-group-item d-flex justify-content-between">
                  <span>Tipe Kamar</span>
                  <strong>{getRoomTypeName(booking.roomType)}</strong>
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
                  <strong>
                    {`@${formatCurrency(booking.pricePerNight)} x ${duration} malam`}
                  </strong>
                </li>
              </ul>
              <hr />
              <div className="d-flex justify-content-between align-items-center mt-3 px-2">
                <h5 className="mb-0">Total Pembayaran</h5>
                <h4 className="mb-0 fw-bold text-primary">
                  {/* 4. Ganti 'totalAmount' menjadi 'total' sesuai data backend */}
                  {formatCurrency(booking.total)} 
                </h4>
              </div>
              <div className="text-center mt-4">
                {/* Tombol untuk memicu pembayaran */}
                <button onClick={processPayment} className="btn btn-primary btn-lg">
                    Bayar Sekarang
                </button>
            </div>
            </div>
          </div>
        </div>
        {/* ... (KOLOM KANAN) ... */}
      </div>
    </div>
  );
}

export default BookingDetail;