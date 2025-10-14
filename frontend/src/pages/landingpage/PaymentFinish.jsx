// frontend/src/pages/landingpage/PaymentFinish.jsx

import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import './../../assets/css/PaymentFinish.css'; // Kita akan buat file CSS ini

const PaymentFinish = () => {
    const [searchParams] = useSearchParams();
    const [paymentStatus, setPaymentStatus] = useState({
        status: 'pending',
        message: 'Memproses pembayaran Anda...',
        orderId: ''
    });

    useEffect(() => {
        const orderId = searchParams.get('order_id');
        const transactionStatus = searchParams.get('transaction_status');
        const statusCode = searchParams.get('status_code');

        if (statusCode === '200' && (transactionStatus === 'capture' || transactionStatus === 'settlement')) {
            setPaymentStatus({
                status: 'success',
                message: 'Pembayaran Berhasil!',
                orderId: orderId,
            });
        } else if (statusCode === '201' && transactionStatus === 'pending') {
             setPaymentStatus({
                status: 'pending',
                message: 'Pembayaran Anda tertunda. Silakan selesaikan pembayaran Anda.',
                orderId: orderId,
            });
        } else {
             setPaymentStatus({
                status: 'error',
                message: 'Pembayaran Gagal atau Dibatalkan.',
                orderId: orderId,
            });
        }
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
                <Link to="/" className="btn btn-primary mt-4">
                    Kembali ke Halaman Utama
                </Link>
            </div>
        </div>
    );
};

export default PaymentFinish;