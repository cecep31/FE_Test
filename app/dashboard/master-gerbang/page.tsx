"use client";

import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/fetch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2 } from "lucide-react";

interface Gerbang {
  id: number;
  IdCabang: number;
  NamaGerbang: string;
  NamaCabang: string;
}

interface GerbangResponse {
  status: boolean;
  message: string;
  code: number;
  data: {
    total_pages: number;
    current_page: number;
    count: number;
    rows: {
      count: number;
      rows: Gerbang[];
    };
  };
}

interface GerbangFormData {
  IdCabang: number;
  NamaGerbang: string;
  NamaCabang: string;
}

const initialFormData: GerbangFormData = {
  IdCabang: 0,
  NamaGerbang: "",
  NamaCabang: "",
};

export default function MasterGerbang() {
  const [gerbangData, setGerbangData] = useState<Gerbang[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState<GerbangFormData>(initialFormData);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchGerbang = async (search?: string) => {
    try {
      const params = new URLSearchParams();
      if (search) {
        params.append("NamaGerbang", search);
      }
      const response = await axiosInstance.get<GerbangResponse>(
        `/gerbangs?${params.toString()}`
      );
      const data = response.data;

      if (data.status && data.data?.rows?.rows) {
        setGerbangData(data.data.rows.rows);
      } else {
        setError(data.message || "Failed to fetch data");
      }
    } catch (err) {
      setError("Failed to fetch data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      fetchGerbang(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "IdCabang" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const openCreateModal = () => {
    setFormData(initialFormData);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (gerbang: Gerbang) => {
    setFormData({
      IdCabang: gerbang.IdCabang,
      NamaGerbang: gerbang.NamaGerbang,
      NamaCabang: gerbang.NamaCabang,
    });
    setEditingId(gerbang.id);
    setIsModalOpen(true);
  };

  const openDeleteModal = (id: number) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData(initialFormData);
    setEditingId(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await axiosInstance.put(`/gerbangs/${editingId}`, formData);
      } else {
        await axiosInstance.post("/gerbangs", formData);
      }
      await fetchGerbang();
      closeModal();
    } catch (err) {
      console.error("Failed to save gerbang:", err);
      setError("Failed to save data");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setSubmitting(true);
    try {
      await axiosInstance.delete(`/gerbangs/${deleteId}`);
      await fetchGerbang();
      closeDeleteModal();
    } catch (err) {
      console.error("Failed to delete gerbang:", err);
      setError("Failed to delete data");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Master Gerbang</h1>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-center p-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Master Gerbang</h1>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-center p-4 text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Master Gerbang</h1>

      <div className="mb-4 flex justify-between gap-2">
        <div className="relative flex-1 max-w-md">
          <Input
            placeholder="Cari Nama Gerbang..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          )}
        </div>
        <Button onClick={openCreateModal}>Tambah Gerbang</Button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">ID Cabang</th>
              <th className="p-2 text-left">Nama Gerbang</th>
              <th className="p-2 text-left">Nama Cabang</th>
              <th className="p-2 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {gerbangData.map((gerbang) => (
              <tr key={`${gerbang.id}-${gerbang.IdCabang}`} className="border-b">
                <td className="p-2">{gerbang.id}</td>
                <td className="p-2">{gerbang.IdCabang}</td>
                <td className="p-2">{gerbang.NamaGerbang}</td>
                <td className="p-2">{gerbang.NamaCabang}</td>
                <td className="p-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mr-1"
                    onClick={() => openEditModal(gerbang)}
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openDeleteModal(gerbang.id)}
                    title="Hapus"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? "Edit Gerbang" : "Tambah Gerbang"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <Label htmlFor="IdCabang">ID Cabang</Label>
                <Input
                  id="IdCabang"
                  name="IdCabang"
                  type="number"
                  value={formData.IdCabang || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="NamaGerbang">Nama Gerbang</Label>
                <Input
                  id="NamaGerbang"
                  name="NamaGerbang"
                  value={formData.NamaGerbang}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="NamaCabang">Nama Cabang</Label>
                <Input
                  id="NamaCabang"
                  name="NamaCabang"
                  value={formData.NamaCabang}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={closeModal}>
                  Batal
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Menyimpan..." : "Simpan"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Konfirmasi Hapus</h2>
            <p className="mb-4">Apakah Anda yakin ingin menghapus gerbang ini?</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={closeDeleteModal}>
                Batal
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={submitting}>
                {submitting ? "Menghapus..." : "Hapus"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}