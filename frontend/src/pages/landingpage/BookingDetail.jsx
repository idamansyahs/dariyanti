import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api';

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
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
            </div>
          </div>
        </div>
        {/* ... (KOLOM KANAN) ... */}
      </div>
    </div>
  );
}

export default BookingDetail;