import React, { useEffect, useState } from "react";
import api from "../api";
import Layout from "../components/Layout";


function RoomList() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await api.get("/api/room");
      setRooms(res.data || []);
      console.log(rooms)
    } catch (err) {
      console.error("Error fetching rooms:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <Layout>
      <div className="container mt-5">
        <h2 className="mb-4">Manajemen Kamar</h2>
        <button className="btn btn-primary mb-3">+ Tambah Kamar</button>
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>No</th>
              <th>No Kamar</th>
              <th>Tipe</th>
              <th>Harga</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {rooms.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">
                  Tidak ada data kamar
                </td>
              </tr>
            ) : (
              rooms.map((room, idx) => (
                <tr key={room.id}>
                  <td>{idx + 1}</td>
                  <td>{room.roomNumber}</td>
                  <td>{room.type}</td>
                  <td>Rp {room.price.toLocaleString()}</td>
                  <td>{room.status}</td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2">
                      Edit
                    </button>
                    <button className="btn btn-sm btn-info me-2">
                      Ubah Status
                    </button>
                    <button className="btn btn-sm btn-danger">
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Layout>

  );
}

export default RoomList;
