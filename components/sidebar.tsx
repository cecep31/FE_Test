import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-4 font-bold text-lg">My App</div>
      <nav className="flex-1 px-2 space-y-1">
        <Link
          href="/dashboard"
          className="block px-2 py-2.5 rounded-md hover:bg-gray-700"
        >
          Dashboard
        </Link>
        <Link
          href="/dashboard/master-gerbang"
          className="block px-2 py-2.5 rounded-md hover:bg-gray-700"
        >
          Master Gerbang
        </Link>
        <Link
          href="/dashboard/laporan-latin"
          className="block px-2 py-2.5 rounded-md hover:bg-gray-700"
        >
          Laporan Latin
        </Link>
      </nav>
    </div>
  );
}
