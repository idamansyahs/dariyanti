import React, { useState, useEffect } from 'react';
import { /*useLocation,*/ useParams, useNavigate, Link } from 'react-router-dom';
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
  const [isCancelling, setIsCancelling] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(0);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  // Fungsi untuk memproses pembayaran
    const processPayment = async () => {
        if (!booking || isPaying) return; // cegah double click
        setIsPaying(true);

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
                // Tampilkan pop-up pesan sukses
                alert('Pembayaran Berhasil! Pesanan Anda telah dikonfirmasi.');
                // Ubah state untuk menandakan pembayaran selesai
                setPaymentCompleted(true);
                setIsPaying(false);
            },
            onPending: function (result) {
                console.log('Pembayaran Pending:', result);
                // GANTI JUGA DI SINI (opsional, tapi baik untuk konsistensi)
                navigate(`/payment-finish?order_id=${result.order_id}&status_code=${result.status_code}&transaction_status=${result.transaction_status}`);
                setIsPaying(false);
            },
            onError: function (result) {
                console.log('Pembayaran Gagal:', result);
                // GANTI DI SINI
                navigate(`/payment-finish?order_id=${result.order_id}&status_code=${result.status_code}&transaction_status=${result.transaction_status}`);
                setIsPaying(false);
            },
            onClose: function () {
                console.log('Jendela pembayaran ditutup oleh pengguna.');
                
                // === LOGIKA BARU DIMULAI DI SINI ===
                // Cek apakah pembayaran sudah selesai. Jika BELUM, maka batalkan.
                // Variabel `paymentCompleted` perlu diakses di sini.
                // Karena keterbatasan scope, kita akan panggil fungsi dari luar.
                handleSnapClose();
                setIsPaying(false);
            }
        });
      } else {
      throw new Error("Token transaksi tidak valid.");
    }
        } catch (error) {
            console.error("Gagal mendapatkan token pembayaran:", error);
            setError("Gagal memulai sesi pembayaran. Silakan coba lagi.");
            setIsPaying(false);
            // Tampilkan pesan error kepada user
        }
    };

    // FUNGSI BARU UNTUK MENANGANI PENUTUPAN POPUP SNAP
  const handleSnapClose = () => {
    // Gunakan setTimeout untuk memastikan state `paymentCompleted` sudah yang terbaru
    setTimeout(() => {
      // Cek state paymentCompleted. Jika false, berarti pembayaran belum berhasil.
      if (!paymentCompleted) {
        alert("Anda menutup jendela pembayaran sebelum transaksi selesai. Pesanan akan otomatis dibatalkan.");
        // Panggil fungsi pembatalan yang sudah ada
        handleCancelBooking();
      }
    }, 100); // Beri jeda 100ms
  };

  // FUNGSI BARU UNTUK MEMBATALKAN BOOKING
  const handleCancelBooking = async () => {
    // Konfirmasi kepada pengguna sebelum membatalkan
    if (window.confirm("Apakah Anda yakin ingin membatalkan pesanan ini?")) {
      setIsCancelling(true);
      try {
        await api.put(`/api/booking-user/${bookingId}/cancel`);
        alert("Pesanan Anda telah berhasil dibatalkan.");
        navigate('/'); // Arahkan ke halaman utama setelah berhasil
      } catch (err) {
        const errorMessage = err.response?.data?.message || "Gagal membatalkan pesanan.";
        alert(`Terjadi kesalahan: ${errorMessage}`);
        console.error("Gagal membatalkan:", err);
      } finally {
        setIsCancelling(false);
      }
    }
  };

  const startRedirectCountdown = (seconds) => {
    let timeLeft = seconds;
    setRedirectCountdown(timeLeft);

    const countdownInterval = setInterval(() => {
      timeLeft -= 1;
      setRedirectCountdown(timeLeft);

      if (timeLeft <= 0) {
        clearInterval(countdownInterval);
        navigate("/");
      }
    }, 1000);
  };

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await api.get(`/api/booking-user/${bookingId}`);
        if (response.data.status !== 'PENDING') {
        setError("Pesanan ini sudah berhasil/dibatalkan dan sudah tidak bisa diproses.");
        startRedirectCountdown(7);
        return;
        }
        setBooking(response.data);
      } catch (err) {
        setError("Gagal memuat detail pesanan atau pesanan tidak ditemukan.");
        console.error(err);
        startRedirectCountdown(7);
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBookingData();
    }
  }, [bookingId, navigate]);

  
  if (loading) {
    return <div className="text-center my-5"><h2>Memuat Detail Pesanan...</h2></div>;
  }
  if (error) {
  return (
    <div className="alert alert-danger text-center my-5">
      <p>{error}</p>
      {redirectCountdown > 0 && (
        <p>
          Anda akan dialihkan ke halaman utama dalam{" "}
          <strong>{redirectCountdown}</strong> detik...
        </p>
      )}
    </div>
  );
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
        {paymentCompleted ? (
          <>
            <h1 className="fw-bold text-success">Pembayaran Berhasil!</h1>
            <p className="text-muted">
              Terima kasih! Pesanan Anda telah kami terima dan akan segera diproses.
            </p>
          </>
        ) : (
          <>
            <h1 className="fw-bold">Selesaikan Pembayaran Anda</h1>
            <p className="text-muted">
              Pesanan Anda akan dikonfirmasi setelah pembayaran berhasil.
            </p>
          </>
        )}
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
              <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
                {/* Gunakan kondisi untuk menampilkan tombol yang sesuai */}
                {paymentCompleted ? (
                    <>
                        <Link to="/" className="btn btn-primary">
                            Kembali ke Halaman Utama
                        </Link>
                        <Link to="/rooms/booking" className="btn btn-secondary">
                            Booking Kamar Lagi
                        </Link>
                    </>
                ) : (
                    <>
                        {/* Tombol Batal */}
                        <button 
                          onClick={handleCancelBooking} 
                          className="btn btn-outline-danger"
                          disabled={isCancelling}
                        >
                          {isCancelling ? 'Membatalkan...' : 'Batalkan Pesanan'}
                        </button>

                        {/* Tombol Bayar */}
                        <button 
                          onClick={processPayment} 
                          className="btn btn-primary btn-lg"
                          disabled={isCancelling || isPaying}
                        >
                          {isPaying ? 'Memproses Pembayaran...' : 'Bayar Sekarang'}
                        </button>
                    </>
                )}
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingDetail;