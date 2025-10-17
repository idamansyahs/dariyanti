// frontend/src/pages/landingpage/PaymentFinish.jsx

import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
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
    const [paymentStatus, setPaymentStatus] = useState({
        status: 'loading', // Ubah status awal menjadi loading
        message: 'Memverifikasi status pembayaran...',
        orderId: ''
    });

    const [bookingDetails, setBookingDetails] = useState(null);

    // === FUNGSI BARU UNTUK MEMBUKA KEMBALI POPUP MIDTRANS ===
    const handleResumePayment = () => {
        // Pastikan detail booking dan token pembayaran sudah ada
        if (bookingDetails && bookingDetails.paymentToken) {
            window.snap.pay(bookingDetails.paymentToken, {
                onSuccess: function (result) {
                    console.log('Pembayaran Sukses:', result);
                    alert('Pembayaran Berhasil!');
                    // Muat ulang halaman untuk menampilkan status sukses yang baru
                    window.location.reload();
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
            alert("Tidak dapat memuat detail pembayaran. Silakan coba muat ulang halaman.");
        }
    };

    useEffect(() => {
        const orderId = searchParams.get('order_id');
        const transactionStatus = searchParams.get('transaction_status');
        const statusCode = searchParams.get('status_code');

        const verifyPaymentStatus = async (bookingCode) => {
          if (!bookingCode) {
              setPaymentStatus({ status: 'error', message: 'ID Pesanan tidak valid.', orderId: '' });
              return;
          }

          try {
            // Selalu ambil status terbaru dari database
            const response = await api.get(`/api/booking-code/${bookingCode}`);
            const dbBooking = response.data;
            setBookingDetails(dbBooking);

            // === LOGIKA BARU: PRIORITASKAN STATUS DARI DATABASE ===
            // Jika di database sudah CANCELLED (karena timeout/cron job), langsung set status GAGAL.
            if (dbBooking.status === 'CANCELLED') {
                setPaymentStatus({ status: 'error', message: 'Waktu pembayaran telah habis atau pesanan dibatalkan.', orderId: bookingCode });
                return; 
            }
            // === AKHIR LOGIKA BARU ===

            // Jika di database belum final, gunakan status dari URL Midtrans
            if (statusCode === '200' && (transactionStatus === 'capture' || transactionStatus === 'settlement')) {
                setPaymentStatus({ status: 'success', message: 'Pembayaran Berhasil!', orderId: bookingCode });
            } else if (statusCode === '201' && transactionStatus === 'pending') {
                 setPaymentStatus({ status: 'pending', message: 'Pembayaran Anda tertunda...', orderId: bookingCode });
            } else {
                 setPaymentStatus({ status: 'error', message: 'Pembayaran Gagal atau Dibatalkan.', orderId: bookingCode });
            }

          } catch (error) {
            console.error("Gagal memverifikasi status booking:", error);
            setPaymentStatus({ status: 'error', message: 'Gagal memuat detail pesanan.', orderId: bookingCode });
          }
        };

        verifyPaymentStatus(orderId);
    }, [searchParams]);

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
                    title: 'Pembayaran Gagal',
                    text: `Terjadi masalah dengan pembayaran untuk pesanan ${paymentStatus.orderId}. Silakan coba lagi atau hubungi dukungan.`
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
                        <button onClick={handleResumePayment} className="btn btn-warning fw-bold"> Lanjutkan Pembayaran </button>
                    ) : paymentStatus.status !== 'loading' && (
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