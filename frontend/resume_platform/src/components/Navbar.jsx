import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="p-4 bg-gray-800 text-white flex justify-between">
      <Link to="/dashboard" className="font-bold">
        Resume Builder
      </Link>
      <div className="space-x-3">
        <Link to="/dashboard">Dashboard</Link>
        <button onClick={handleLogout} className="bg-red-500 px-2 py-1 rounded">
          Logout
        </button>
      </div>
    </nav>
  );
}
