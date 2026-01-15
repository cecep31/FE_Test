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

  const SHIFT_COLORS = ["#3b82f6", "#10b981", "#f59e0b"];
  const RUAS_COLORS = ["#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"];
  const BANK_COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4"];

  // Custom label for doughnut charts
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent
  }: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null;

    return (
      <g>
        <rect
          x={x - 20}
          y={y - 10}
          width={40}
          height={20}
          fill="rgba(0, 0, 0, 0.7)"
          rx={4}
        />
        <text 
          x={x} 
          y={y} 
          fill="white" 
          textAnchor="middle" 
          dominantBaseline="central"
          className="text-xs font-semibold"
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      </g>
    );
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-slate-400 rounded-lg animate-pulse"></div>
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-64 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center space-y-4 bg-slate-50 min-h-screen">
        <div className="max-w-md mx-auto mt-20">
          <p className="text-red-600 font-medium text-lg mb-2">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-slate-500 hover:bg-slate-600 text-white"
          >
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-slate-50 min-h-screen p-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p className="text-slate-500">Monitor lalu lintas dan analisis data E-Toll</p>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <div className="flex gap-4 items-end">
          <div className="min-w-[200px] relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Calendar className="h-4 w-4 text-slate-400" />
            </div>
            <Input
              type="date"
              placeholder="Tanggal"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full pl-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
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
          <h2 className="text-lg font-semibold mb-4 text-slate-700">E-Toll per Bank</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={eTollData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Bar dataKey="Jumlah Lalin" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                {eTollData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={BANK_COLORS[index % BANK_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Shift Pie Chart */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-700">Total Lalin per Shift</h2>
            <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">
              {shiftData.reduce((sum, item) => sum + item.value, 0).toLocaleString('id-ID')} Total
            </div>
          </div>
          <div className="flex items-center justify-between">
            <ResponsiveContainer width="60%" height={320}>
              <PieChart>
                <Pie
                  data={shiftData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={2}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                  animationEasing="ease-out"
                  label={renderCustomizedLabel}
                  labelLine={false}
                >
                  {shiftData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={SHIFT_COLORS[index % SHIFT_COLORS.length]}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.98)",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                    padding: "12px",
                  }}
                  formatter={(value: number) => [value.toLocaleString('id-ID'), 'Jumlah Lalin']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-3">
              <h3 className="font-semibold text-sm mb-3 text-slate-700">Distribusi Shift</h3>
              {shiftData.map((entry, index) => (
                <div 
                  key={entry.name} 
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors group"
                >
                  <div
                    className="w-4 h-4 rounded-full shadow-sm group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: SHIFT_COLORS[index % SHIFT_COLORS.length] }}
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-slate-700">{entry.name}</span>
                    <div className="text-xs text-slate-500">
                      {entry.value.toLocaleString('id-ID')} lalin
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-900">{entry.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gerbang Bar Chart */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 text-slate-700">Total Lalin per Gerbang</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={gerbangData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Bar dataKey="Jumlah Lalin" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Ruas Pie Chart */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-700">Total Lalin per Ruas</h2>
            <div className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-xs font-medium">
              {ruasData.reduce((sum, item) => sum + item.value, 0).toLocaleString('id-ID')} Total
            </div>
          </div>
          <div className="flex items-center justify-between">
            <ResponsiveContainer width="60%" height={320}>
              <PieChart>
                <Pie
                  data={ruasData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={2}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                  animationEasing="ease-out"
                  label={renderCustomizedLabel}
                  labelLine={false}
                >
                  {ruasData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={RUAS_COLORS[index % RUAS_COLORS.length]}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.98)",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                    padding: "12px",
                  }}
                  formatter={(value: number) => [value.toLocaleString('id-ID'), 'Jumlah Lalin']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-3">
              <h3 className="font-semibold text-sm mb-3 text-slate-700">Distribusi Ruas</h3>
              {ruasData.map((entry, index) => (
                <div 
                  key={entry.name} 
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors group"
                >
                  <div
                    className="w-4 h-4 rounded-full shadow-sm group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: RUAS_COLORS[index % RUAS_COLORS.length] }}
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-slate-700">{entry.name}</span>
                    <div className="text-xs text-slate-500">
                      {entry.value.toLocaleString('id-ID')} lalin
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-900">{entry.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
