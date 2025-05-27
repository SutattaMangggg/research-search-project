import mongoose from 'mongoose';

const researchSchema = new mongoose.Schema({
  title: { type: String, required: true },
  course: String,
  year: String,
  developer: [String],
  advisor: [String],
  abstract: String,
  others: String,
  pdfFile: String,
  embedding: [Number],
  uploadedBy: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Research', researchSchema);
