import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import api from '../../api'
import Layout from '../../components/Layout'

const DaftarKonten = () => {
    const [content, setContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([])

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
                await api.delete(`api/konten-management/${id}`)
            } catch (err) {
                console.error(err)
            }
        }
    }

    return (
        <Layout>
            <div className="container mt-5">
                <h2 className="mb-4">Manajemen Kamar</h2>
                <button className="btn btn-primary mb-3">+ Tambah Konten</button>
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
                                    <td>{content.Link}</td>
                                    <td>{content.platform}</td>
                                    <td>
                                        <button className="btn btn-sm btn-warning me-2">
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
        </Layout>
    )
}

export default DaftarKonten