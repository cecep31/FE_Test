"use client";

import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/fetch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Pencil, Trash2, Search, Plus, X, Building2, Hash, MapPin, AlertTriangle } from "lucide-react";

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
  const [deleteData, setDeleteData] = useState<{ id: number; IdCabang: number } | null>(null);
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

  const openDeleteModal = (gerbang: Gerbang) => {
    setDeleteData({ id: gerbang.id, IdCabang: gerbang.IdCabang });
    setIsDeleteModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData(initialFormData);
    setEditingId(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteData(null);
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
    if (!deleteData) return;
    setSubmitting(true);
    try {
      await axiosInstance.delete(`/gerbang`, { data: deleteData });
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
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Master Gerbang</h1>
        </div>
        <div className="bg-card text-card-foreground rounded-xl border shadow-sm">
          <div className="p-6 space-y-4">
            {/* Search skeleton */}
            <div className="flex gap-4">
              <Skeleton className="h-10 w-full max-w-md" />
              <Skeleton className="h-10 w-32" />
            </div>
            <Separator />
            {/* Table skeleton */}
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-48 flex-1" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Master Gerbang</h1>
        </div>
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 text-center">
          <p className="text-destructive font-medium">{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setError(null);
              setLoading(true);
              fetchGerbang();
            }}
          >
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Master Gerbang</h1>
          <p className="text-muted-foreground">
            Kelola data gerbang cabang dengan mudah
          </p>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Cari Nama Gerbang..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-10 py-2.5 bg-background border border-input rounded-lg text-sm ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 hover:border-ring/50"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button onClick={openCreateModal}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Gerbang
          </Button>
        </div>

        {/* Table Card */}
        <div className="bg-card text-card-foreground rounded-xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50 border-b">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    ID
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    ID Cabang
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Nama Gerbang
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Nama Cabang
                  </th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {gerbangData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="h-8 w-8 text-muted-foreground/50" />
                        <p>Tidak ada data gerbang ditemukan</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  gerbangData.map((gerbang) => (
                    <tr
                      key={`${gerbang.id}-${gerbang.IdCabang}`}
                      className="border-b transition-colors hover:bg-muted/50 last:border-b-0"
                    >
                      <td className="p-4 align-middle">{gerbang.id}</td>
                      <td className="p-4 align-middle">{gerbang.IdCabang}</td>
                      <td className="p-4 align-middle font-medium">
                        {gerbang.NamaGerbang}
                      </td>
                      <td className="p-4 align-middle">{gerbang.NamaCabang}</td>
                      <td className="p-4 align-middle text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEditModal(gerbang)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit Gerbang</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openDeleteModal(gerbang)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Hapus Gerbang</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Sheet open={isModalOpen} onOpenChange={setIsModalOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader className="space-y-1 pb-6 border-b">
            <SheetTitle className="flex items-center gap-2 text-xl">
              <div className="p-2 rounded-lg bg-primary/10">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              {editingId ? "Edit Gerbang" : "Tambah Gerbang Baru"}
            </SheetTitle>
            <SheetDescription className="text-base">
              {editingId
                ? "Perbarui informasi gerbang di bawah ini."
                : "Tambahkan gerbang baru dengan mengisi form di bawah."}
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="space-y-6 mt-8 px-6">
            <div className="space-y-3">
              <Label htmlFor="IdCabang" className="text-sm font-medium flex items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                ID Cabang
              </Label>
              <Input
                id="IdCabang"
                name="IdCabang"
                type="number"
                value={formData.IdCabang || ""}
                onChange={handleInputChange}
                placeholder="Masukkan ID cabang"
                className="h-11 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2"
                required
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="NamaGerbang" className="text-sm font-medium flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                Nama Gerbang
              </Label>
              <Input
                id="NamaGerbang"
                name="NamaGerbang"
                value={formData.NamaGerbang}
                onChange={handleInputChange}
                placeholder="Masukkan nama gerbang"
                className="h-11 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2"
                required
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="NamaCabang" className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Nama Cabang
              </Label>
              <Input
                id="NamaCabang"
                name="NamaCabang"
                value={formData.NamaCabang}
                onChange={handleInputChange}
                placeholder="Masukkan nama cabang"
                className="h-11 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2"
                required
              />
            </div>
            <div className="pt-6 flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={closeModal}
                className="flex-1 h-11"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1 h-11"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    Menyimpan...
                  </span>
                ) : (
                  "Simpan"
                )}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Modal */}
      <Sheet open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <SheetContent side="bottom" className="sm:max-w-md mx-auto rounded-t-xl">
          <SheetHeader className="space-y-1 pb-4 border-b">
            <SheetTitle className="flex items-center gap-2 text-xl">
              <div className="p-2 rounded-lg bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              Konfirmasi Hapus
            </SheetTitle>
            <SheetDescription className="text-base">
              Apakah Anda yakin ingin menghapus gerbang ini? Tindakan ini tidak
              dapat dibatalkan.
            </SheetDescription>
          </SheetHeader>
          <div className="flex gap-4 mt-8 px-6">
            <Button
              variant="outline"
              onClick={closeDeleteModal}
              className="flex-1 h-11"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={submitting}
              className="flex-1 h-11"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Menghapus...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Hapus
                </span>
              )}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </TooltipProvider>
  );
}