"use client";

import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/fetch";

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

export default function MasterGerbang() {
  const [gerbangData, setGerbangData] = useState<Gerbang[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGerbang = async () => {
      try {
        const response = await axiosInstance.get<GerbangResponse>("/gerbangs");
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

    fetchGerbang();
  }, []);

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
      <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">ID Cabang</th>
              <th className="p-2 text-left">Nama Gerbang</th>
              <th className="p-2 text-left">Nama Cabang</th>
            </tr>
          </thead>
          <tbody>
            {gerbangData.map((gerbang) => (
              <tr key={`${gerbang.id}-${gerbang.IdCabang}`} className="border-b">
                <td className="p-2">{gerbang.id}</td>
                <td className="p-2">{gerbang.IdCabang}</td>
                <td className="p-2">{gerbang.NamaGerbang}</td>
                <td className="p-2">{gerbang.NamaCabang}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}