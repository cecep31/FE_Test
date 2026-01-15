import Link from "next/link";
import Image from "next/image";

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="h-16 flex items-center justify-center bg-gray-900">
        <h1 className="text-xl font-bold">Dashboard</h1>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        <Link
          href="/dashboard"
          className="flex items-center px-2 py-2.5 rounded-md hover:bg-gray-700"
        >
          <Image src="/globe.svg" alt="Dashboard" width={24} height={24} />
          <span className="ml-3">Dashboard</span>
        </Link>
        <Link
          href="/dashboard/master-gerbang"
          className="flex items-center px-2 py-2.5 rounded-md hover:bg-gray-700"
        >
          <Image src="/window.svg" alt="Master Gerbang" width={24} height={24} />
          <span className="ml-3">Master Gerbang</span>
        </Link>
        <Link
          href="/dashboard/laporan-latin"
          className="flex items-center px-2 py-2.5 rounded-md hover:bg-gray-700"
        >
          <Image src="/file.svg" alt="Laporan Latin" width={24} height={24} />
          <span className="ml-3">Laporan Latin</span>
        </Link>
      </nav>
      <div className="px-2 py-4">
        <button className="w-full flex items-center px-2 py-2.5 rounded-md bg-red-600 hover:bg-red-700">
          <span className="ml-3">Logout</span>
        </button>
      </div>
    </div>
  );
}
