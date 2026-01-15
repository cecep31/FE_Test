"use client";

import { useState, useEffect } from "react";
import { axiosInstance } from "@/lib/fetch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  SearchIcon,
  DownloadIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LalinData {
  id: number;
  IdCabang: number;
  IdGerbang: number;
  Tanggal: string;
  Shift: number;
  IdGardu: number;
  Golongan: number;
  IdAsalGerbang: number;
  Tunai: number;
  DinasOpr: number;
  DinasMitra: number;
  DinasKary: number;
  eMandiri: number;
  eBri: number;
  eBni: number;
  eBca: number;
  eNobu: number;
  eDKI: number;
  eMega: number;
  eFlo: number;
}

interface AggregatedData {
  no: number;
  ruas: string;
  gerbang: string;
  gardu: string;
  hari: string;
  tanggal: string;
  metodePembayaran: string;
  gol1: number;
  gol2: number;
  gol3: number;
  gol4: number;
  gol5: number;
  totalLalin: number;
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
  const [activeTab, setActiveTab] = useState<string>("Total Tunai");
  const [pageSize, setPageSize] = useState<string>("10");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const tabs = [
    "Total Tunai",
    "Total E-Toll",
    "Total Flo",
    "Total KTP",
    "Total Keseluruhan",
    "Total E-Toll+Tunai+Flo",
  ];

  const handleReset = () => {
    setSearchQuery("");
    setStartDate("2023-11-01");
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get<LalinResponse>(
          `/lalins?tanggal=${startDate}&page=${currentPage}&limit=${pageSize}`
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
  }, [startDate, currentPage, pageSize]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    return days[date.getDay()];
  };

  // Group data by Ruas, Gerbang, Gardu, Tanggal, and Metode Pembayaran
  const processData = () => {
    const grouped: Record<string, AggregatedData> = {};
    
    data.forEach((item, index) => {
      // Determine payment value based on active tab
      let val = 0;
      let metode = "";
      
      switch (activeTab) {
        case "Total Tunai":
          if (item.Tunai > 0) {
            val = item.Tunai;
            metode = "Tunai";
          } else {
            return; // Skip non-tunai items
          }
          break;
        case "Total E-Toll":
          val = item.eMandiri + item.eBri + item.eBni + item.eBca + item.eNobu + item.eDKI + item.eMega;
          metode = "E-Toll";
          if (val === 0) return; // Skip if no e-toll transactions
          break;
        case "Total Flo":
          val = item.eFlo;
          metode = "Flo";
          if (val === 0) return;
          break;
        case "Total KTP":
          val = item.DinasOpr + item.DinasMitra + item.DinasKary;
          metode = "KTP";
          if (val === 0) return;
          break;
        case "Total E-Toll+Tunai+Flo":
          val = item.Tunai + item.eMandiri + item.eBri + item.eBni + item.eBca + item.eNobu + item.eDKI + item.eMega + item.eFlo;
          metode = "E-Toll+Tunai+Flo";
          break;
        case "Total Keseluruhan":
        default:
          val = item.Tunai + item.eMandiri + item.eBri + item.eBni + item.eBca + item.eNobu + item.eDKI + item.eMega + item.eFlo + item.DinasOpr + item.DinasMitra + item.DinasKary;
          metode = "Keseluruhan";
          break;
      }
      
      const key = `${item.IdCabang}-${item.IdGerbang}-${item.IdGardu}-${item.Tanggal}-${metode}`;
      
      if (!grouped[key]) {
        grouped[key] = {
          no: index + 1,
          ruas: `Ruas ${item.IdCabang}`,
          gerbang: `Gerbang ${item.IdGerbang}`,
          gardu: String(item.IdGardu).padStart(2, "0"),
          hari: getDayName(item.Tanggal),
          tanggal: formatDate(item.Tanggal),
          metodePembayaran: metode,
          gol1: 0,
          gol2: 0,
          gol3: 0,
          gol4: 0,
          gol5: 0,
          totalLalin: 0,
        };
      }
      
      if (item.Golongan === 1) grouped[key].gol1 += val;
      if (item.Golongan === 2) grouped[key].gol2 += val;
      if (item.Golongan === 3) grouped[key].gol3 += val;
      if (item.Golongan === 4) grouped[key].gol4 += val;
      if (item.Golongan === 5) grouped[key].gol5 += val;
      
      grouped[key].totalLalin += val;
    });
    
    return Object.values(grouped);
  };

  const processedRows = processData();

  // Calculate totals for summary rows
  const totalsByRuas = processedRows.reduce((acc, row) => {
    if (!acc[row.ruas]) {
      acc[row.ruas] = { gol1: 0, gol2: 0, gol3: 0, gol4: 0, gol5: 0, total: 0 };
    }
    acc[row.ruas].gol1 += row.gol1;
    acc[row.ruas].gol2 += row.gol2;
    acc[row.ruas].gol3 += row.gol3;
    acc[row.ruas].gol4 += row.gol4;
    acc[row.ruas].gol5 += row.gol5;
    acc[row.ruas].total += row.totalLalin;
    return acc;
  }, {} as Record<string, { gol1: number; gol2: number; gol3: number; gol4: number; gol5: number; total: number }>);

  const grandTotal = processedRows.reduce((acc, row) => {
    acc.gol1 += row.gol1;
    acc.gol2 += row.gol2;
    acc.gol3 += row.gol3;
    acc.gol4 += row.gol4;
    acc.gol5 += row.gol5;
    acc.total += row.totalLalin;
    return acc;
  }, { gol1: 0, gol2: 0, gol3: 0, gol4: 0, gol5: 0, total: 0 });

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center space-y-4">
        <p className="text-destructive font-medium">{error}</p>
        <Button onClick={() => window.location.reload()}>Coba Lagi</Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Filter Section */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px] relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <Input
              type="date"
              placeholder="Tanggal"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full"
            />
          </div>
          <Button
            onClick={handleSubmit}
            className="bg-slate-500 hover:bg-slate-600 text-white"
          >
            Filter
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Export Button */}
      <div className="flex justify-end">
        <Button variant="outline" className="bg-white shadow-sm border-slate-200">
          <DownloadIcon className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border rounded-md overflow-hidden bg-white shadow-sm w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-r last:border-r-0 ${
              activeTab === tab
                ? "bg-slate-500 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-3 font-semibold text-slate-700">No.</th>
                <th className="p-3 font-semibold text-slate-700">
                  <div className="flex items-center gap-1">
                    Ruas <ChevronUpIcon className="h-3 w-3" /><ChevronDownIcon className="h-3 w-3 -ml-1" />
                  </div>
                </th>
                <th className="p-3 font-semibold text-slate-700">
                  <div className="flex items-center gap-1">
                    Gerbang <ChevronUpIcon className="h-3 w-3" /><ChevronDownIcon className="h-3 w-3 -ml-1" />
                  </div>
                </th>
                <th className="p-3 font-semibold text-slate-700">
                  <div className="flex items-center gap-1">
                    Gardu <ChevronUpIcon className="h-3 w-3" /><ChevronDownIcon className="h-3 w-3 -ml-1" />
                  </div>
                </th>
                <th className="p-3 font-semibold text-slate-700">
                  <div className="flex items-center gap-1">
                    Hari <ChevronUpIcon className="h-3 w-3" /><ChevronDownIcon className="h-3 w-3 -ml-1" />
                  </div>
                </th>
                <th className="p-3 font-semibold text-slate-700">
                  <div className="flex items-center gap-1">
                    Tanggal <ChevronUpIcon className="h-3 w-3" /><ChevronDownIcon className="h-3 w-3 -ml-1" />
                  </div>
                </th>
                <th className="p-3 font-semibold text-slate-700">Metode Pembayaran</th>
                <th className="p-3 font-semibold text-slate-700">Gol I</th>
                <th className="p-3 font-semibold text-slate-700">Gol II</th>
                <th className="p-3 font-semibold text-slate-700">Gol III</th>
                <th className="p-3 font-semibold text-slate-700">Gol IV</th>
                <th className="p-3 font-semibold text-slate-700">Gol V</th>
                <th className="p-3 font-semibold text-slate-700">Total Lalin</th>
              </tr>
            </thead>
            <tbody>
              {processedRows.map((row, idx) => (
                <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-3 text-slate-600">{row.no}</td>
                  <td className="p-3 text-slate-600">{row.ruas}</td>
                  <td className="p-3 text-slate-600">{row.gerbang}</td>
                  <td className="p-3 text-slate-600">{row.gardu}</td>
                  <td className="p-3 text-slate-600">{row.hari}</td>
                  <td className="p-3 text-slate-600">{row.tanggal}</td>
                  <td className="p-3 text-slate-600">{row.metodePembayaran}</td>
                  <td className="p-3 text-slate-600">{row.gol1.toLocaleString("id-ID")}</td>
                  <td className="p-3 text-slate-600">{row.gol2.toLocaleString("id-ID")}</td>
                  <td className="p-3 text-slate-600">{row.gol3.toLocaleString("id-ID")}</td>
                  <td className="p-3 text-slate-600">{row.gol4.toLocaleString("id-ID")}</td>
                  <td className="p-3 text-slate-600">{row.gol5.toLocaleString("id-ID")}</td>
                  <td className="p-3 font-medium text-slate-800">{row.totalLalin.toLocaleString("id-ID")}</td>
                </tr>
              ))}

              {/* Summary Rows by Ruas */}
              {Object.entries(totalsByRuas).map(([ruas, totals]) => (
                <tr key={ruas} className="bg-slate-50/50 font-bold">
                  <td colSpan={7} className="p-3 text-right text-slate-700">Total Lalin {ruas}</td>
                  <td className="p-3 text-slate-800">{totals.gol1.toLocaleString("id-ID")}</td>
                  <td className="p-3 text-slate-800">{totals.gol2.toLocaleString("id-ID")}</td>
                  <td className="p-3 text-slate-800">{totals.gol3.toLocaleString("id-ID")}</td>
                  <td className="p-3 text-slate-800">{totals.gol4.toLocaleString("id-ID")}</td>
                  <td className="p-3 text-slate-800">{totals.gol5.toLocaleString("id-ID")}</td>
                  <td className="p-3 text-slate-800">{totals.total.toLocaleString("id-ID")}</td>
                </tr>
              ))}

              {/* Grand Total Row */}
              <tr className="bg-slate-500 text-white font-bold">
                <td colSpan={7} className="p-3 text-right">Total Lalin Keseluruhan</td>
                <td className="p-3">{grandTotal.gol1.toLocaleString("id-ID")}</td>
                <td className="p-3">{grandTotal.gol2.toLocaleString("id-ID")}</td>
                <td className="p-3">{grandTotal.gol3.toLocaleString("id-ID")}</td>
                <td className="p-3">{grandTotal.gol4.toLocaleString("id-ID")}</td>
                <td className="p-3">{grandTotal.gol5.toLocaleString("id-ID")}</td>
                <td className="p-3">{grandTotal.total.toLocaleString("id-ID")}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
          <div className="flex items-center gap-2 text-sm text-slate-600 border rounded px-2 py-1">
            <span>Show :</span>
            <Select value={pageSize} onValueChange={(val: string) => setPageSize(val)}>
              <SelectTrigger className="h-8 w-[100px] border-none shadow-none focus:ring-0">
                <SelectValue placeholder="10 entries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 entries</SelectItem>
                <SelectItem value="10">10 entries</SelectItem>
                <SelectItem value="25">25 entries</SelectItem>
                <SelectItem value="50">50 entries</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Pagination className="w-auto mx-0">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={`bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200 ${
                    currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
                  }`}
                />
              </PaginationItem>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) pageNum = i + 1;
                else if (currentPage <= 3) pageNum = i + 1;
                else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = currentPage - 2 + i;

                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => handlePageChange(pageNum)}
                      isActive={currentPage === pageNum}
                      className={currentPage === pageNum ? "bg-white border-slate-300 text-slate-900" : "cursor-pointer text-slate-600"}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <PaginationItem>
                  <span className="px-2">...</span>
                </PaginationItem>
              )}
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <PaginationItem>
                  <PaginationLink onClick={() => handlePageChange(totalPages)} className="cursor-pointer">
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  className={`bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200 ${
                    currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
                  }`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
