import express from "express";
// import multer from "multer";
import Resume from "../models/Resume.js";
import auth from "../middleware/auth.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
const router = express.Router({ mergeParams: true });

// Create new resume
router.post("/", auth, async (req, res) => {
  const resume = await Resume.create({ ...req.body, user: req.user });
  res.json(resume);
});

// Get all resumes
router.get("/", auth, async (req, res) => {
  const resumes = await Resume.find({ user: req.user });
  res.json(resumes);
});

// Update resume
router.put("/:id", auth, async (req, res) => {
  const resume = await Resume.findOneAndUpdate(
    { _id: req.params.id, user: req.user },
    req.body,
    { new: true }
  );
  res.json(resume);
});

// Delete resume
router.delete("/:id", auth, async (req, res) => {
  await Resume.findOneAndDelete({ _id: req.params.id, user: req.user });
  res.json({ msg: "Deleted" });
});

// Generate basic PDF
router.get("/pdf/:id", auth, async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id).populate("user");
    if (!resume) return res.status(404).json({ msg: "Resume not found" });

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${resume.title || "resume"}.pdf`
    );
    doc.pipe(res);

    // ====== HEADER ======
    if (resume.user?.profilePicture) {
      try {
        const picPath = path.join(
          path.resolve(),
          "uploads",
          path.basename(resume.user.profilePicture)
        );
        if (fs.existsSync(picPath)) {
          doc.image(picPath, doc.page.width - 150, 40, {
            width: 80,
            height: 80,
          });
        }
      } catch (err) {
        console.error("Error loading profile picture:", err);
      }
    }

    doc
      .fontSize(22)
      .font("Helvetica-Bold")
      .text(resume.personal.fullName || "Unnamed");
    doc.moveDown(0.3);
    doc
      .fontSize(14)
      .font("Helvetica-Oblique")
      .fillColor("gray")
      .text(resume.personal.headline || "");
    doc.moveDown(1);

    // Horizontal line
    doc
      .moveTo(50, doc.y)
      .lineTo(doc.page.width - 50, doc.y)
      .stroke();
    doc.moveDown(1);

    // ====== SECTION RENDERER ======
    const renderSection = (title, items) => {
      if (!items || !items.length) return;
      doc.fontSize(16).font("Helvetica-Bold").fillColor("black").text(title);
      doc.moveDown(0.3);
      doc.fontSize(12).font("Helvetica").fillColor("black");

      if (Array.isArray(items)) {
        items.forEach((item) => doc.text(`• ${item}`));
      } else if (typeof items === "string") {
        doc.text(items);
      }
      doc.moveDown(1);
    };

    // ====== MAIN SECTIONS ======
    renderSection("Education", resume.education);
    renderSection("Experience", resume.experience);
    renderSection("Skills", [resume.skills?.join(", ")]);

    // ====== CUSTOM SECTIONS ======
    if (resume.sections?.length) {
      resume.sections.forEach((sec) => {
        renderSection(sec.sectionTitle || "Untitled Section", [sec.content]);
      });
    }

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error generating PDF" });
  }
});

// Public link
router.get("/public/:slug", async (req, res) => {
  const resume = await Resume.findOne({ publicSlug: req.params.slug });
  if (!resume) return res.status(404).json({ msg: "Not found" });
  res.json(resume);
});

export default router;
