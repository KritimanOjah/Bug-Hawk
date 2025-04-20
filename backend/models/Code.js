import mongoose from "mongoose";

const CodeSchema = new mongoose.Schema({
  code: { type: String, required: true },
  language: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Code", CodeSchema);
