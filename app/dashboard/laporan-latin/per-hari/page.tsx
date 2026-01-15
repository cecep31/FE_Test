"use client";

import { useState, useEffect } from "react";
import { axiosInstance } from "@/lib/fetch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  FilterIcon,
  SearchIcon,
} from "lucide-react";

interface LalinData {
  id: number;
  Shift: number;
  Golongan: number;
  Tunai: number;
  eMandiri: number;
  eBri: number;
  eBni: number;
  eBca: number;
}

interface LalinResponse {
  status: boolean;
  message: string;
  code: number;
  data: {
    total_pages: number;
    current_page: number;
    count: number;
    rows: {
      count: number;
      rows: LalinData[];
    };
  };
}

export default function LaporanLatin() {
  const [data, setData] = useState<LalinData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>("2023-11-01");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get<LalinResponse>(
          `/lalins?tanggal=${startDate}&page=${currentPage}`
        );
        const result = response.data;
        if (result.status && result.data?.rows?.rows) {
          setData(result.data.rows.rows);
          setTotalPages(result.data.total_pages);
        } else {
          setError(result.message || "Failed to fetch data");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, currentPage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Laporan Latin</h1>
        </div>
        {/* Filter skeleton */}
        <div className="bg-card text-card-foreground rounded-xl border shadow-sm p-6">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px]">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        {/* Table skeleton */}
        <div className="bg-card text-card-foreground rounded-xl border shadow-sm overflow-hidden">
          <div className="p-6 space-y-4">
            <Skeleton className="h-6 w-40" />
            <Separator />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Laporan Latin</h1>
        </div>
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 text-center">
          <p className="text-destructive font-medium">{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setError(null);
              setLoading(true);
              setStartDate("2023-11-01");
              setCurrentPage(1);
            }}
          >
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Laporan Latin</h1>
        <p className="text-muted-foreground">
          Laporan data transaksi harian berdasarkan tanggal
        </p>
      </div>

      {/* Filter Card */}
      <div className="bg-card text-card-foreground rounded-xl border shadow-sm p-6">
        <div className="flex flex-col sm:flex-row flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px] w-full sm:w-auto">
            <Label htmlFor="tanggal" className="text-sm font-medium mb-2">
              Tanggal
            </Label>
            <Input
              type="date"
              id="tanggal"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full"
            />
          </div>
          <Button onClick={handleSubmit} className="w-full sm:w-auto">
            <SearchIcon className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-card text-card-foreground rounded-xl border shadow-sm overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Data Transaksi</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50 border-b">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    ID
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Shift
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Golongan
                  </th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                    Tunai
                  </th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                    e-Mandiri
                  </th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                    e-BRI
                  </th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                    e-BNI
                  </th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                    e-BCA
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <FilterIcon className="h-8 w-8 text-muted-foreground/50" />
                        <p>Tidak ada data ditemukan</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  data.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b transition-colors hover:bg-muted/50 last:border-b-0"
                    >
                      <td className="p-4 align-middle">{item.id}</td>
                      <td className="p-4 align-middle">{item.Shift}</td>
                      <td className="p-4 align-middle">{item.Golongan}</td>
                      <td className="p-4 align-middle text-right font-medium">
                        {formatCurrency(item.Tunai)}
                      </td>
                      <td className="p-4 align-middle text-right">
                        {formatCurrency(item.eMandiri)}
                      </td>
                      <td className="p-4 align-middle text-right">
                        {formatCurrency(item.eBri)}
                      </td>
                      <td className="p-4 align-middle text-right">
                        {formatCurrency(item.eBni)}
                      </td>
                      <td className="p-4 align-middle text-right">
                        {formatCurrency(item.eBca)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t p-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => handlePageChange(pageNum)}
                        isActive={currentPage === pageNum}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      handlePageChange(Math.min(totalPages, currentPage + 1))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}
