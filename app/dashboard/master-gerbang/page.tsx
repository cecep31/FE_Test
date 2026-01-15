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
import { Pencil, Trash2, Search, Plus, X } from "lucide-react";

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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari Nama Gerbang..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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
                                onClick={() => openDeleteModal(gerbang.id)}
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
        <SheetContent side="right" className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>
              {editingId ? "Edit Gerbang" : "Tambah Gerbang"}
            </SheetTitle>
            <SheetDescription>
              {editingId
                ? "Perbarui informasi gerbang di bawah ini."
                : "Tambahkan gerbang baru dengan mengisi form di bawah."}
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div className="space-y-3">
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
            <div className="space-y-3">
              <Label htmlFor="NamaGerbang">Nama Gerbang</Label>
              <Input
                id="NamaGerbang"
                name="NamaGerbang"
                value={formData.NamaGerbang}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="NamaCabang">Nama Cabang</Label>
              <Input
                id="NamaCabang"
                name="NamaCabang"
                value={formData.NamaCabang}
                onChange={handleInputChange}
                required
              />
            </div>
            <SheetFooter className="gap-2">
              <Button type="button" variant="outline" onClick={closeModal}>
                Batal
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Menyimpan..." : "Simpan"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Modal */}
      <Sheet open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <SheetContent side="bottom" className="sm:max-w-md mx-auto">
          <SheetHeader>
            <SheetTitle>Konfirmasi Hapus</SheetTitle>
            <SheetDescription>
              Apakah Anda yakin ingin menghapus gerbang ini? Tindakan ini tidak
              dapat dibatalkan.
            </SheetDescription>
          </SheetHeader>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={closeDeleteModal}>
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={submitting}
            >
              {submitting ? "Menghapus..." : "Hapus"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </TooltipProvider>
  );
}