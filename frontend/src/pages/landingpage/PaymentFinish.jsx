// frontend/src/pages/landingpage/PaymentFinish.jsx

import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api';
import './../../assets/css/PaymentFinish.css'; // Kita akan buat file CSS ini

const formatCurrency = (amount) => {
  if (!amount) return 'Rp 0';
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString("id-ID", {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const roomTypeMapping = {
  FBK: "Fhandika Boutique",
  FSKG: "Fhandika SS King",
  FSST: "Fhandika SS Twin",
  DXQ: "Fhandika DXQ",
};

const getRoomTypeName = (typeCode) => {
  return roomTypeMapping[typeCode] || typeCode;
};

const PaymentFinish = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [paymentStatus, setPaymentStatus] = useState({
        status: 'loading', // Ubah status awal menjadi loading
        message: 'Memverifikasi status pembayaran...',
        orderId: ''
    });

    const [bookingDetails, setBookingDetails] = useState(null);
    const [isRegenerating, setIsRegenerating] = useState(false);

    // === TAMBAHKAN STATE BARU UNTUK PEMBATALAN ===
    const [isCancelling, setIsCancelling] = useState(false);

    // === FUNGSI BARU UNTUK MEMBUKA KEMBALI POPUP MIDTRANS ===
    const handleResumePayment = async() => {
        // Pastikan detail booking dan token pembayaran sudah ada
        if (!bookingDetails || !bookingDetails.bookingCode) {
            alert("Detail pesanan tidak ditemukan. Silakan muat ulang halaman.");
            return;
        }

        setIsRegenerating(true); // Mulai loading

        try {
            // 1. Minta token baru dari backend
            const response = await api.post('/api/regenerate-payment-token', {
                booking_code: bookingDetails.bookingCode
            });

            const { token: newToken } = response.data;

            // 2. Gunakan token baru untuk membuka Snap
            if (newToken) {
                window.snap.pay(newToken, {
                    onSuccess: function (result) {
                        console.log('Pembayaran Sukses:', result);
                        // Redirect ke halaman finish dengan status baru
                        navigate(`/payment-finish?order_id=${bookingDetails.bookingCode}&status=success`);
                        window.location.reload(); // Reload untuk data terbaru
                    },
                    onPending: function (result) {
                        console.log('Pembayaran Pending:', result);
                        alert('Pembayaran Anda masih tertunda.');
                        window.location.reload();
                    },
                    onError: function (result) {
                        console.log('Pembayaran Gagal:', result);
                        alert('Pembayaran Gagal.');
                        window.location.reload();
                    },
                    onClose: function () {
                        console.log('Anda menutup jendela pembayaran');
                        alert('Anda menutup jendela pembayaran sebelum transaksi selesai.');
                    }
                });
            } else {
                throw new Error("Token baru tidak diterima dari server.");
            }

        } catch (error) {
            // ================= UBAH BAGIAN INI =================
            console.error("Gagal membuat ulang token pembayaran:", error);
            
            // Log ini akan memberikan detail error dari backend
            if (error.response) {
                console.error("Data Error dari Backend:", error.response.data);
                console.error("Status Error dari Backend:", error.response.status);
            }
            
            alert("Gagal memuat ulang sesi pembayaran. Cek konsol browser (F12) untuk detail.");
            // ===================================================
        } finally {
            setIsRegenerating(false); // Selesai loading
        }
    };

    // === FUNGSI BARU UNTUK MEMBATALKAN BOOKING ===
    const handleCancelBooking = async () => {
        if (!bookingDetails || !bookingDetails.id) {
            alert("Detail pesanan tidak ditemukan.");
            return;
        }

        // Konfirmasi pengguna
        if (!window.confirm("Apakah Anda yakin ingin membatalkan pesanan ini?")) {
            return;
        }

        setIsCancelling(true);
        try {
            // Panggil API cancelBookingUser dari backend
            const response = await api.post(`/api/booking/cancel/${bookingDetails.id}`);
            
            // Tampilkan pesan sukses
            alert(response.data.message || "Pesanan telah berhasil dibatalkan.");

            // Update UI
            setPaymentStatus({
                status: 'error', // Set status ke error/gagal
                message: 'Pesanan telah dibatalkan oleh Anda.',
                orderId: bookingDetails.bookingCode
            });
            // Update detail booking dengan data terbaru dari backend
            setBookingDetails(response.data.booking);

        } catch (error) {
            console.error("Gagal membatalkan pesanan:", error);
            alert("Gagal membatalkan pesanan: " + (error.response?.data?.message || error.message));
        } finally {
            setIsCancelling(false);
        }
    };
    // === AKHIR FUNGSI BARU ===

    useEffect(() => {
        // 1. Ambil orderId LENGKAP dari URL (misal: "FBK22-1760694479489")
        const orderIdFromUrl = searchParams.get('order_id');

        const verifyPaymentStatus = async (fullOrderId) => {
            if (!fullOrderId) {
                setPaymentStatus({ status: 'error', message: 'ID Pesanan tidak valid.', orderId: '' });
                return;
            }

            // ==================== PERBAIKAN UTAMA DI SINI ====================
            // 2. Pisahkan orderId berdasarkan tanda '-' dan ambil bagian pertamanya.
            // Ini akan mengubah "FBK22-1760694479489" menjadi "FBK22".
            const cleanBookingCode = fullOrderId.split('-')[0];
            // ===============================================================

            try {
            // 3. Gunakan booking code yang sudah bersih untuk memanggil API.
            // ==================== LOGIKA BARU YANG LEBIH ANDAL ====================
            // 1. Selalu ambil status terbaru dari database. Ini adalah sumber kebenaran utama.
            const response = await api.get(`/api/booking-code/${cleanBookingCode}`);
            const dbBooking = response.data;
            setBookingDetails(dbBooking); // Simpan detail booking untuk ditampilkan

            // 2. Tentukan status halaman HANYA berdasarkan status dari database.
            // Abaikan parameter URL yang bisa membingungkan.
            switch (dbBooking.status) {
                case 'CONFIRMED':
                    setPaymentStatus({ status: 'success', message: 'Pembayaran Berhasil!', orderId: cleanBookingCode });
                    break;
                case 'PENDING':
                    setPaymentStatus({ status: 'pending', message: 'Kami masih menunggu pembayaran Anda.', orderId: cleanBookingCode });
                    break;
                case 'CANCELLED':
                    // Bedakan pesan jika payment_status nya CANCELLED (oleh user) vs EXPIRED/FAILED
                        if (dbBooking.payment_status === 'CANCELLED') {
                             setPaymentStatus({ status: 'error', message: 'Pesanan ini telah dibatalkan.', orderId: cleanBookingCode });
                        } else {
                             setPaymentStatus({ status: 'error', message: 'Waktu pembayaran telah habis atau pesanan dibatalkan.', orderId: cleanBookingCode });
                        }
                        break;
                default:
                    setPaymentStatus({ status: 'error', message: 'Status pesanan tidak dikenali.', orderId: cleanBookingCode });
                    break;
            }
        } catch (error) {
            console.error("Gagal memverifikasi status booking:", error);
            setPaymentStatus({ status: 'error', message: 'Gagal memuat detail pesanan.', orderId: cleanBookingCode });
        }
    };

    // 4. Panggil fungsi verifikasi dengan orderId LENGKAP dari URL.
    verifyPaymentStatus(orderIdFromUrl);
}, [searchParams]);

    // ==========================================================
    // === PERBAIKAN UTAMA UNTUK FLICKER ADA DI SINI ===
    // ==========================================================
    // Tambahkan 'if' block ini untuk menangani 'loading' state
    // SEBELUM Anda memanggil getStatusInfo()
    if (paymentStatus.status === 'loading') {
        return (
            <div className="payment-finish-container">
                {/* Gunakan style netral, misal 'payment-card-pending' */}
                <div className="payment-card payment-card-pending"> 
                    <div className="payment-icon">
                        {/* Tampilkan Bootstrap Spinner */}
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                    <h1 className="payment-title">Mohon Tunggu</h1>
                    <p className="payment-text">{paymentStatus.message}</p>
                </div>
            </div>
        );
    }
    // ==========================================================
    // === AKHIR DARI PERBAIKAN ===
    // ==========================================================


    // Kode di bawah ini HANYA akan berjalan jika status BUKAN 'loading'
    const getStatusInfo = () => {
        switch (paymentStatus.status) {
            case 'success':
                return {
                    icon: '✅',
                    cardClass: 'payment-card-success',
                    title: 'Pembayaran Berhasil!',
                    text: `Terima kasih! Pesanan Anda dengan ID ${paymentStatus.orderId} telah kami terima dan akan segera diproses.`
                };
            case 'pending':
                return {
                    icon: '⏳',
                    cardClass: 'payment-card-pending',
                    title: 'Pembayaran Tertunda',
                    text: `Kami masih menunggu konfirmasi pembayaran untuk pesanan ${paymentStatus.orderId}. Silakan selesaikan pembayaran Anda.`
                };
            case 'error':
            default:
                return {
                    icon: '❌',
                    cardClass: 'payment-card-error',
                    title: paymentStatus.message.includes("dibatalkan") ? 'Pesanan Dibatalkan' : 'Pembayaran Gagal',
                    text: `${paymentStatus.message} (ID Pesanan: ${paymentStatus.orderId})`
                };
        }
    };

    const { icon, cardClass, title, text } = getStatusInfo();

    return (
        <div className="payment-finish-container">
            <div className={`payment-card ${cardClass}`}>
                <div className="payment-icon">{icon}</div>
                <h1 className="payment-title">{title}</h1>
                <p className="payment-text">{text}</p>
                {bookingDetails && (
                    <div className="booking-details-summary mt-4">
                        <h5 className="text-muted">Rincian Pesanan</h5>
                        <ul className="list-group list-group-flush text-start">
                            <li className="list-group-item d-flex justify-content-between"><span>ID Booking</span><strong>#{bookingDetails.bookingCode}</strong></li>
                            <li className="list-group-item d-flex justify-content-between"><span>Nama Tamu</span><strong>{bookingDetails.guestName}</strong></li>
                            <li className="list-group-item d-flex justify-content-between"><span>Tipe Kamar</span><strong>{getRoomTypeName(bookingDetails.roomType)}</strong></li>
                            <li className="list-group-item d-flex justify-content-between"><span>Check-in</span><strong>{formatDate(bookingDetails.checkIn)}</strong></li>
                            <li className="list-group-item d-flex justify-content-between"><span>Check-out</span><strong>{formatDate(bookingDetails.checkOut)}</strong></li>
                            <li className="list-group-item d-flex justify-content-between align-items-center bg-light"><h6 className="mb-0">Total Pembayaran</h6><h5 className="mb-0 fw-bold text-primary">{formatCurrency(bookingDetails.total)}</h5></li>
                        </ul>
                    </div>
                )}

                <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
                    {paymentStatus.status === 'pending' ? (
                        // === PERBARUI BLOK INI ===
                        <>
                            <button 
                                onClick={handleResumePayment} 
                                className="btn btn-warning fw-bold" 
                                disabled={isRegenerating || isCancelling} // Disable saat salah satu proses jalan
                            > 
                                {isRegenerating ? 'Memuat...' : 'Lanjutkan Pembayaran'} 
                            </button>
                            
                            {/* === TOMBOL BATALKAN YANG BARU === */}
                            <button 
                                onClick={handleCancelBooking} 
                                className="btn btn-danger" 
                                disabled={isRegenerating || isCancelling} // Disable saat salah satu proses jalan
                            >
                                {isCancelling ? 'Membatalkan...' : 'Batalkan Pesanan'}
                            </button>
                        </>
                        // === AKHIR PERUBAHAN ===
                    ) : (
                        <>
                            <Link to="/" className="btn btn-primary"> Kembali ke Halaman Utama </Link>
                            <Link to="/rooms/booking" className="btn btn-secondary"> Booking Kamar Lagi </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentFinish;