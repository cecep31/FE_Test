export default function Header() {
  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <div>
        <img
          src="/next.svg"
          alt="App Logo"
          className="h-10 w-10 object-contain"
        />
      </div>
      <div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Logout
        </button>
      </div>
    </header>
  );
}
