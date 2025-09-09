import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ResumeForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [resume, setResume] = useState({
    title: "",
    personal: { fullName: "", headline: "" },
    education: [""],
    experience: [""],
    skills: [""],
    sections: [],
  });

  // Load existing resume if editing
  useEffect(() => {
    if (id !== "new") {
      const fetchResume = async () => {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8080/resume", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const found = res.data.find((r) => r._id === id);
        if (found) setResume(found);
      };
      fetchResume();
    }
  }, [id]);

  // Handle field changes
  const handleChange = (field, value) => {
    setResume({ ...resume, [field]: value });
  };

  const handleArrayChange = (field, index, value) => {
    const arr = [...resume[field]];
    arr[index] = value;
    setResume({ ...resume, [field]: arr });
  };

  const addArrayItem = (field) => {
    setResume({ ...resume, [field]: [...resume[field], ""] });
  };

  const removeArrayItem = (field, index) => {
    const arr = [...resume[field]];
    arr.splice(index, 1);
    setResume({ ...resume, [field]: arr });
  };

  // Handle dynamic sections
  const addSection = () => {
    setResume({
      ...resume,
      sections: [...resume.sections, { sectionTitle: "", content: "" }],
    });
  };

  const updateSection = (index, key, value) => {
    const updated = [...resume.sections];
    updated[index][key] = value;
    setResume({ ...resume, sections: updated });
  };

  const removeSection = (index) => {
    const updated = [...resume.sections];
    updated.splice(index, 1);
    setResume({ ...resume, sections: updated });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (id === "new") {
      await axios.post("http://localhost:8080/resume", resume, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      await axios.put(`http://localhost:8080/resume/${id}`, resume, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    navigate("/dashboard");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl mb-4">Resume Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <input
          type="text"
          placeholder="Resume Title"
          className="border p-2 w-full"
          value={resume.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />

        {/* Personal Details */}
        <input
          type="text"
          placeholder="Full Name"
          className="border p-2 w-full"
          value={resume.personal.fullName}
          onChange={(e) =>
            setResume({
              ...resume,
              personal: { ...resume.personal, fullName: e.target.value },
            })
          }
        />
        <input
          type="text"
          placeholder="Headline"
          className="border p-2 w-full"
          value={resume.personal.headline}
          onChange={(e) =>
            setResume({
              ...resume,
              personal: { ...resume.personal, headline: e.target.value },
            })
          }
        />

        {/* Education */}
        <h3 className="font-semibold">Education</h3>
        {resume.education.map((edu, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Education"
              className="border p-2 w-full"
              value={edu}
              onChange={(e) =>
                handleArrayChange("education", i, e.target.value)
              }
            />
            <button
              type="button"
              onClick={() => removeArrayItem("education", i)}
              className="bg-red-500 text-white px-2 rounded"
            >
              X
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem("education")}
          className="bg-blue-500 text-white px-2 py-1 rounded"
        >
          + Add Education
        </button>

        {/* Experience */}
        <h3 className="font-semibold mt-4">Experience</h3>
        {resume.experience.map((exp, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Experience"
              className="border p-2 w-full"
              value={exp}
              onChange={(e) =>
                handleArrayChange("experience", i, e.target.value)
              }
            />
            <button
              type="button"
              onClick={() => removeArrayItem("experience", i)}
              className="bg-red-500 text-white px-2 rounded"
            >
              X
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem("experience")}
          className="bg-blue-500 text-white px-2 py-1 rounded"
        >
          + Add Experience
        </button>

        {/* Skills */}
        <h3 className="font-semibold mt-4">Skills</h3>
        {resume.skills.map((skill, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Skill"
              className="border p-2 w-full"
              value={skill}
              onChange={(e) => handleArrayChange("skills", i, e.target.value)}
            />
            <button
              type="button"
              onClick={() => removeArrayItem("skills", i)}
              className="bg-red-500 text-white px-2 rounded"
            >
              X
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem("skills")}
          className="bg-blue-500 text-white px-2 py-1 rounded"
        >
          + Add Skill
        </button>

        {/* Dynamic Sections */}
        <h3 className="font-semibold mt-4">Custom Sections</h3>
        {resume.sections.map((sec, i) => (
          <div key={i} className="border p-3 mb-2">
            <input
              type="text"
              placeholder="Section Title (e.g. Projects)"
              className="border p-2 w-full mb-2"
              value={sec.sectionTitle}
              onChange={(e) => updateSection(i, "sectionTitle", e.target.value)}
            />
            <textarea
              placeholder="Content"
              className="border p-2 w-full"
              value={sec.content}
              onChange={(e) => updateSection(i, "content", e.target.value)}
            />
            <button
              type="button"
              onClick={() => removeSection(i)}
              className="bg-red-500 text-white px-2 py-1 rounded mt-2"
            >
              Remove Section
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addSection}
          className="bg-green-500 text-white px-2 py-1 rounded"
        >
          + Add Section
        </button>

        {/* Submit */}
        <button className="bg-green-600 text-white px-4 py-2 rounded w-full mt-4">
          Save Resume
        </button>
      </form>
    </div>
  );
}
