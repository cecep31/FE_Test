export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome to your Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-bold">Card 1</h2>
          <p className="text-gray-600">Some information here</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-bold">Card 2</h2>
          <p className="text-gray-600">Some information here</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-bold">Card 3</h2>
          <p className="text-gray-600">Some information here</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-bold">Card 4</h2>
          <p className="text-gray-600">Some information here</p>
        </div>
      </div>
    </div>
  );
}