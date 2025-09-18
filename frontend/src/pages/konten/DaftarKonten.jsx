import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import api from '../../api'
import Layout from '../../components/Layout'

const DaftarKonten = () => {
    const [content, setContent] = useState([]);
    const [form, setForm] = useState({ link: "", deskripsi: "", platform: "" });
    const [loading, setLoading] = useState(true);
    const [editingContent, setEditingContent] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await api.get("/api/konten-management");
                setContent(res.data || []);
            } catch (err) {
                console.error("Error fetching content:", err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const deleteKonten = async (id) => {
        if (window.confirm('Apakah anda yakin!')) {
            try {
                await api.delete(`/api/konten-management/${id}`)
                setContent(content.filter((r) => r.id !== id));
            } catch (err) {
                console.error(err)
            }
        }
    }

    // Submit tambah / edit konten
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingContent) {
                // UPDATE konten
                const res = await api.put(
                    `/api/konten-management/${editingContent.id}`,
                    form
                );
                // update data di state supaya UI langsung berubah
                setContent((prev) =>
                    prev.map((item) =>
                        item.id === editingContent.id ? res.data : item
                    )
                );
            } else {
                // CREATE konten baru
                const res = await api.post("/api/konten-management", form);
                setContent((prev) => [...prev, res.data]);
            }

            // reset form dan editing state
            setForm({ link: "", deskripsi:"", platform: "" });
            setEditingContent(null);

            // Tutup modal (Bootstrap 5)
            const modalEl = document.getElementById("kontenModal");
            const modal = window.bootstrap.Modal.getInstance(modalEl);
            modal.hide();
        } catch (err) {
            console.error("Error saving content:", err);
        }
    };

    // Klik tombol Edit → buka modal dan isi form
    const handleEditClick = (item) => {
        setForm({
            link: item.link,
            deskripsi: item.deskripsi,
            platform: item.platform,
        });
        setEditingContent(item);
        console.log("idnya===========>", item);


        const modal = new window.bootstrap.Modal(
            document.getElementById("kontenModal")
        );
        modal.show();
    };

    // Handle input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const openAddModal = () => {
        setForm({ link: "", platform: "" });
        setEditingContent(null);
        const modal = new window.bootstrap.Modal(
            document.getElementById("kontenModal")
        );
        modal.show();
    };



    return (
        <Layout>
            <div className="container mt-5">
                <h2 className="mb-4">Manajemen Kamar</h2>
                <button className="btn btn-primary mb-3" onClick={openAddModal}>
                    Tambah Konten
                </button>
                <table className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Link</th>
                            <th>Platform</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {content.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center">
                                    Tidak ada data kamar
                                </td>
                            </tr>
                        ) : (
                            content.map((content, idx) => (
                                <tr key={content.id}>
                                    <td>{idx + 1}</td>
                                    <td>{content.link}</td>
                                    <td>{content.platform}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-warning me-2"
                                            data-bs-toggle="modal"
                                            data-bs-target="#roomModal"
                                            onClick={() => handleEditClick(content)}
                                        >
                                            Edit
                                        </button>
                                        <button className="btn btn-sm btn-danger" onClick={() => deleteKonten(content.id)}>
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Tambah / Edit */}
            <div
                className="modal fade"
                id="kontenModal"
                tabIndex="-1"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <form className="modal-content" onSubmit={handleSubmit}>
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {editingContent ? "Edit Konten" : "Tambah Konten"}
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Link</label>
                                <input
                                    type="text"
                                    name="link"
                                    className="form-control"
                                    value={form.link}
                                    onChange={handleChange}
                                    required
                                // disabled={!!editingContent} // no kamar tidak bisa diubah saat edit
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">desc</label>
                                <input
                                    type="text"
                                    name="deskripsi"
                                    className="form-control"
                                    value={form.deskripsi}
                                    onChange={handleChange}
                                    required
                                // disabled={!!editingContent} // no kamar tidak bisa diubah saat edit
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Platform</label>
                                <select
                                    name="platform"
                                    className="form-select"
                                    value={form.platform}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">-- Pilih --</option>
                                    <option value="Instagram">Instagram</option>
                                    <option value="Tiktok">Tiktok</option>
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Batal
                            </button>
                            <button type="submit" className="btn btn-primary">
                                {editingContent ? "Simpan Perubahan" : "Edit Konten"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    )
}

export default DaftarKonten