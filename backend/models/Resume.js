import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({
  sectionTitle: String,
  content: String,
});

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: String,
  personal: {
    fullName: String,
    headline: String,
  },
  education: [String],
  experience: [String],
  skills: [String],
  sections: [sectionSchema],
  publicSlug: String,
});

export default mongoose.model("Resume", resumeSchema);
