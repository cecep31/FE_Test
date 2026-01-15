"use client";

import { useState, useEffect } from "react";
import { axiosInstance } from "@/lib/fetch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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

export default function Dashboard() {
  const [data, setData] = useState<LalinData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>("2023-11-01");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get<LalinResponse>(
          `/lalins?tanggal=${startDate}&page=1&limit=100`
        );
        const result = response.data;
        if (result.status && result.data?.rows?.rows) {
          setData(result.data.rows.rows);
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
  }, [startDate]);

  // Process data for E-Toll Bank chart
  const processETollData = () => {
    const bankData = {
      BCA: 0,
      BRI: 0,
      BNI: 0,
      DKI: 0,
      Mandiri: 0,
      Mega: 0,
      Flo: 0,
    };

    data.forEach((item) => {
      bankData.BCA += item.eBca;
      bankData.BRI += item.eBri;
      bankData.BNI += item.eBni;
      bankData.DKI += item.eDKI;
      bankData.Mandiri += item.eMandiri;
      bankData.Mega += item.eMega;
      bankData.Flo += item.eFlo;
    });

    return Object.entries(bankData).map(([name, value]) => ({
      name,
      "Jumlah Lalin": value,
    }));
  };

  // Process data for Shift pie chart
  const processShiftData = () => {
    const shiftData: Record<number, number> = {};

    data.forEach((item) => {
      const total = item.Tunai + item.eMandiri + item.eBri + item.eBni + 
                    item.eBca + item.eNobu + item.eDKI + item.eMega + item.eFlo;
      shiftData[item.Shift] = (shiftData[item.Shift] || 0) + total;
    });

    const total = Object.values(shiftData).reduce((sum, val) => sum + val, 0);

    return Object.entries(shiftData).map(([shift, value]) => ({
      name: `Shift ${shift}`,
      value,
      percentage: total > 0 ? Math.round((value / total) * 100) : 0,
    }));
  };

  // Process data for Gerbang chart
  const processGerbangData = () => {
    const gerbangData: Record<number, number> = {};

    data.forEach((item) => {
      const total = item.Tunai + item.eMandiri + item.eBri + item.eBni + 
                    item.eBca + item.eNobu + item.eDKI + item.eMega + item.eFlo;
      gerbangData[item.IdGerbang] = (gerbangData[item.IdGerbang] || 0) + total;
    });

    return Object.entries(gerbangData)
      .map(([gerbang, value]) => ({
        name: `Gerbang ${gerbang}`,
        "Jumlah Lalin": value,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  // Process data for Ruas pie chart
  const processRuasData = () => {
    const ruasData: Record<number, number> = {};

    data.forEach((item) => {
      const total = item.Tunai + item.eMandiri + item.eBri + item.eBni + 
                    item.eBca + item.eNobu + item.eDKI + item.eMega + item.eFlo;
      ruasData[item.IdCabang] = (ruasData[item.IdCabang] || 0) + total;
    });

    const total = Object.values(ruasData).reduce((sum, val) => sum + val, 0);

    return Object.entries(ruasData).map(([ruas, value]) => ({
      name: `Ruas ${ruas}`,
      value,
      percentage: total > 0 ? Math.round((value / total) * 100) : 0,
    }));
  };

  const eTollData = processETollData();
  const shiftData = processShiftData();
  const gerbangData = processGerbangData();
  const ruasData = processRuasData();

  const SHIFT_COLORS = ["#a5b4fc", "#818cf8", "#4338ca"];
  const RUAS_COLORS = ["#a5b4fc", "#818cf8", "#4338ca"];

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px] relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Calendar className="h-4 w-4 text-slate-400" />
            </div>
            <Input
              type="date"
              placeholder="Tanggal"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full pl-10"
            />
          </div>
          <Button
            onClick={() => {}}
            className="bg-slate-500 hover:bg-slate-600 text-white"
          >
            Filter
          </Button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* E-Toll Bank Bar Chart */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">E-Toll per Bank</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={eTollData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="Jumlah Lalin" fill="#475569" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Shift Pie Chart */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Total Lalin per Shift</h2>
          <div className="flex items-center justify-between">
            <ResponsiveContainer width="60%" height={300}>
              <PieChart>
                <Pie
                  data={shiftData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {shiftData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={SHIFT_COLORS[index % SHIFT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-3">
              <h3 className="font-semibold text-sm mb-2">Total Lalin</h3>
              {shiftData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: SHIFT_COLORS[index % SHIFT_COLORS.length] }}
                  />
                  <span className="text-sm text-slate-600">{entry.name}</span>
                  <span className="text-sm font-semibold ml-auto">{entry.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gerbang Bar Chart */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Total Lalin per Gerbang</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={gerbangData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="Jumlah Lalin" fill="#475569" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Ruas Pie Chart */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Total Lalin per Ruas</h2>
          <div className="flex items-center justify-between">
            <ResponsiveContainer width="60%" height={300}>
              <PieChart>
                <Pie
                  data={ruasData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {ruasData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={RUAS_COLORS[index % RUAS_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-3">
              <h3 className="font-semibold text-sm mb-2">Total Lalin</h3>
              {ruasData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: RUAS_COLORS[index % RUAS_COLORS.length] }}
                  />
                  <span className="text-sm text-slate-600">{entry.name}</span>
                  <span className="text-sm font-semibold ml-auto">{entry.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
