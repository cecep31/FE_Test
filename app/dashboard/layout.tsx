import Sidebar from "@/components/sidebar";
import Header from "@/components/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-6 bg-gray-100">{children}</main>
        </div>
      </div>
    </div>
  );
}
