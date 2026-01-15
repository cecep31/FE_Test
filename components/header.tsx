"use client";

export default function Header() {
  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="flex items-center">
        <img
          src="/next.svg"
          alt="App Logo"
          className="h-10 w-10 object-contain"
        />
        <h1 className="text-xl font-bold ml-4">My App</h1>
      </div>
      <div>
        {/* User info can go here */}
      </div>
    </header>
  );
}
