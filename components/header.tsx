export default function Header() {
  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <div>
        <h1 className="text-xl font-semibold">Dashboard</h1>
      </div>
      <div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Logout
        </button>
      </div>
    </header>
  );
}
