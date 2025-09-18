import React, { useEffect, useState } from "react";
import api from "../api";
import Layout from "../components/Layout";

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState({
    roomNumber: "",
    type: "",
    price: "",
    status: "VCI",
  });
  const [editRoom, setEditRoom] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await api.get("/api/room", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRooms(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async () => {
    try {
      await api.post("/api/room", newRoom, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewRoom({ roomNumber: "", type: "", price: "", status: "VCI" });
      fetchRooms();
      const modal = window.bootstrap.Modal.getInstance(
        document.getElementById("addRoomModal")
      );
      if (modal) modal.hide();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async () => {
    if (!editRoom) return;
    try {
      await api.put(`/api/room/${editRoom.id}`, editRoom, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRooms();
      setEditRoom(null);
      const modal = window.bootstrap.Modal.getInstance(
        document.getElementById("editRoomModal")
      );
      if (modal) modal.hide();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus room ini?")) return;
    try {
      await api.delete(`/api/room/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRooms();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      OCCUPIED: "danger",
      VCI: "success",
      VCN: "secondary",
      VDN: "warning",
      OOO: "dark",
    };
    return <span className={`badge bg-${colors[status]}`}>{status}</span>;
  };

  return (
    <Layout>
      <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Room Management</h2>
          <button
            className="btn btn-primary shadow-sm"
            data-bs-toggle="modal"
            data-bs-target="#addRoomModal"
          >
            <i className="bi bi-plus-circle me-2"></i> Add Room
          </button>
        </div>

        <div className="row">
          {rooms.map((room) => (
            <div key={room.id} className="col-md-4 col-lg-3 mb-4">
              <div className="card shadow-sm border-0 rounded-3 h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="card-title fw-bold mb-0">
                      Room {room.roomNumber}
                    </h5>
                    {getStatusBadge(room.status)}
                  </div>
                  <p className="text-muted mb-1">
                    <strong>Type:</strong> {room.type}
                  </p>
                  <p className="text-muted mb-3">
                    <strong>Price:</strong> Rp{" "}
                    {Number(room.price).toLocaleString()}
                  </p>
                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-outline-warning btn-sm"
                      data-bs-toggle="modal"
                      data-bs-target="#editRoomModal"
                      onClick={() => setEditRoom(room)}
                    >
                      <i className="bi bi-pencil-square me-1"></i>Edit
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(room.id)}
                    >
                      <i className="bi bi-trash me-1"></i>Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Room Modal */}
        <div
          className="modal fade"
          id="addRoomModal"
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 shadow">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">Add Room</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                ></button>
              </div>
              <div className="modal-body">
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="roomNumber"
                    placeholder="Room Number"
                    value={newRoom.roomNumber}
                    onChange={(e) =>
                      setNewRoom({ ...newRoom, roomNumber: e.target.value })
                    }
                  />
                  <label htmlFor="roomNumber">Room Number</label>
                </div>

                <div className="form-floating mb-3">
                  <select
                    className="form-select"
                    id="roomType"
                    value={newRoom.type}
                    onChange={(e) =>
                      setNewRoom({ ...newRoom, type: e.target.value })
                    }
                  >
                    <option value="">-- Select Type --</option>
                    <option value="BOUTIQUE">BOUTIQUE</option>
                    <option value="SS">SS</option>
                    <option value="DXQ">DXQ</option>
                  </select>
                  <label htmlFor="roomType">Room Type</label>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="number"
                    className="form-control"
                    id="price"
                    placeholder="Price"
                    value={newRoom.price}
                    onChange={(e) =>
                      setNewRoom({ ...newRoom, price: e.target.value })
                    }
                  />
                  <label htmlFor="price">Price</label>
                </div>

                <div className="form-floating">
                  <select
                    className="form-select"
                    id="status"
                    value={newRoom.status}
                    onChange={(e) =>
                      setNewRoom({ ...newRoom, status: e.target.value })
                    }
                  >
                    <option value="VCI">VCI - Vacant Clean Inspected</option>
                    <option value="VCN">VCN - Vacant Clean Not inspected</option>
                    <option value="OCCUPIED">OCCUPIED</option>
                    <option value="VDN">VDN - Vacant Dirty</option>
                    <option value="OOO">OOO - Out of Order</option>
                  </select>
                  <label htmlFor="status">Status</label>
                </div>
              </div>
              <div className="modal-footer border-0">
                <button className="btn btn-light" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleCreate}>
                  Save Room
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Room Modal */}
        <div
          className="modal fade"
          id="editRoomModal"
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 shadow">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">Edit Room</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                ></button>
              </div>
              {editRoom && (
                <>
                  <div className="modal-body">
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="editRoomNumber"
                        placeholder="Room Number"
                        value={editRoom.roomNumber}
                        onChange={(e) =>
                          setEditRoom({
                            ...editRoom,
                            roomNumber: e.target.value,
                          })
                        }
                      />
                      <label htmlFor="editRoomNumber">Room Number</label>
                    </div>

                    <div className="form-floating mb-3">
                      <select
                        className="form-select"
                        id="editRoomType"
                        value={editRoom.type}
                        onChange={(e) =>
                          setEditRoom({ ...editRoom, type: e.target.value })
                        }
                      >
                        <option value="BOUTIQUE">BOUTIQUE</option>
                        <option value="SS">SS</option>
                        <option value="DXQ">DXQ</option>
                      </select>
                      <label htmlFor="editRoomType">Room Type</label>
                    </div>

                    <div className="form-floating mb-3">
                      <input
                        type="number"
                        className="form-control"
                        id="editPrice"
                        placeholder="Price"
                        value={editRoom.price}
                        onChange={(e) =>
                          setEditRoom({ ...editRoom, price: e.target.value })
                        }
                      />
                      <label htmlFor="editPrice">Price</label>
                    </div>

                    <div className="form-floating">
                      <select
                        className="form-select"
                        id="editStatus"
                        value={editRoom.status}
                        onChange={(e) =>
                          setEditRoom({ ...editRoom, status: e.target.value })
                        }
                      >
                        <option value="VCI">
                          VCI - Vacant Clean Inspected
                        </option>
                        <option value="VCN">
                          VCN - Vacant Clean Not inspected
                        </option>
                        <option value="OCCUPIED">OCCUPIED</option>
                        <option value="VDN">VDN - Vacant Dirty</option>
                        <option value="OOO">OOO - Out of Order</option>
                      </select>
                      <label htmlFor="editStatus">Status</label>
                    </div>
                  </div>
                  <div className="modal-footer border-0">
                    <button className="btn btn-light" data-bs-dismiss="modal">
                      Cancel
                    </button>
                    <button className="btn btn-primary" onClick={handleUpdate}>
                      Update Room
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RoomList;
