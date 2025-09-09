import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [resumes, setResumes] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchData = async () => {
      try {
        const resUser = await axios.get("http://localhost:8080/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(resUser.data);

        const resResumes = await axios.get("http://localhost:8080/resume", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResumes(resResumes.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!window.confirm("Are you sure you want to delete this resume?")) return;

    try {
      await axios.delete(`http://localhost:8080/resume/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResumes(resumes.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Error deleting resume:", err);
    }
  };

  const handleDownload = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get(`http://localhost:8080/resume/pdf/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob", // ensures we get a file
      });

      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "resume.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error downloading PDF:", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl mb-4">Welcome, {user?.name}</h2>
      {user?.profilePicture && (
        <img
          src={`http://localhost:8080${user.profilePicture}`}
          alt="profile"
          className="w-24 h-24 rounded-full mb-4 object-cover"
        />
      )}
      <Link
        to="/resume/new"
        className="bg-blue-500 text-white px-3 py-1 rounded"
      >
        Create Resume
      </Link>
      <ul className="mt-4 space-y-2">
        {resumes.map((r) => (
          <li
            key={r._id}
            className="border p-2 flex justify-between items-center"
          >
            <span>{r.personalDetails?.name || "Untitled"}</span>
            <div className="space-x-3">
              <Link to={`/resume/${r._id}`} className="text-blue-600">
                Edit
              </Link>
              <button
                onClick={() => handleDownload(r._id)}
                className="text-green-600 hover:underline"
              >
                Download PDF
              </button>
              <button
                onClick={() => handleDelete(r._id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
