export default function MasterGerbang() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Master Gerbang</h1>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Location</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2">1</td>
              <td className="p-2">Gerbang Tol 1</td>
              <td className="p-2">Jakarta</td>
              <td className="p-2">Active</td>
            </tr>
            <tr>
              <td className="p-2">2</td>
              <td className="p-2">Gerbang Tol 2</td>
              <td className="p-2">Bandung</td>
              <td className="p-2">Inactive</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}