

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard";
import Booking from "./pages/Bookings.jsx";
import RoomList from "./pages/RoomList.jsx";
import About from "./pages/landingpage/About.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/landingpage/Index.jsx";
import Attraction from "./pages/landingpage/Attraction.jsx";
import Contact from "./pages/landingpage/Contact.jsx";
import Gallery from "./pages/landingpage/Gallery.jsx";
import Lava from "./pages/landingpage/Lava.jsx"
import LavaGallery from "./pages/landingpage/LavaGallery.jsx";
import Menu from "./pages/landingpage/Menu.jsx";
import Room_LP from "./pages/landingpage/Room.jsx";
import BookingForm from "./pages/landingpage/BookingForm.jsx";
import DaftarKonten from "./pages/konten/DaftarKonten.jsx";
import BookingDetail from "./pages/landingpage/BookingDetail.jsx";

// import './app.css'
import './assets/css/style.css'

export default function App() {
  return (
    <Routes>
      {/* user */}
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<About />} />
      <Route path="/attraction" element={<Attraction />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/lava" element={<Lava />} />
      <Route path="/lava-gallery" element={<LavaGallery />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/rooms" element={<Room_LP />} />
      <Route path="/rooms/book" element={<BookingForm />} />

      <Route path="/booking-detail/:bookingId" element={<BookingDetail />} />

      {/* admin */}
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/bookings" element={
        <ProtectedRoute>
          <Booking />
        </ProtectedRoute>
      } />
      <Route path="/room" element={
        <ProtectedRoute>
          <RoomList />
        </ProtectedRoute>
      } />
      <Route path="/konten-management" element={
        <ProtectedRoute>
          <DaftarKonten />
        </ProtectedRoute>
      } />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
