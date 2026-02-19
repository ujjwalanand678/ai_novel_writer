import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWriterPersona extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  sourceFiles: string[];
  styleAttributes: {
    tone?: string;
    pacing?: string;
    vocabulary?: string;
    [key: string]: any;
  };
  genre?: string;
  createdAt: Date;
}

const WriterPersonaSchema = new Schema<IWriterPersona>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  description: { type: String },
  sourceFiles: [{ type: String }],
  styleAttributes: {
    tone: { type: String },
    pacing: { type: String },
    vocabulary: { type: String },
  },
  genre: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const WriterPersona: Model<IWriterPersona> = 
  mongoose.models.WriterPersona || mongoose.model<IWriterPersona>("WriterPersona", WriterPersonaSchema);
