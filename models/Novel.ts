import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICharacter {
  name: string;
  role: string;
  age?: string;
  ability?: string;
  designation?: string;
  background?: string;
  appearance?: string;
}

export interface IChapter {
  title: string;
  summary?: string;
  targetWordCount?: number;
  content: string;
  charactersPresent: string[];
  order: number;
}

export interface INovel extends Document {
  userId: mongoose.Types.ObjectId;
  writerPersonaId: mongoose.Types.ObjectId;
  title: string;
  status: "Draft" | "Completed";
  worldSettings: {
    powerSystem?: string;
    cultivationLevels?: string;
    [key: string]: any;
  };
  characters: ICharacter[];
  chapters: IChapter[];
  createdAt: Date;
  updatedAt: Date;
}

const CharacterSchema = new Schema<ICharacter>({
  name: { type: String, required: true },
  role: { type: String },
  age: { type: String },
  ability: { type: String },
  designation: { type: String },
  background: { type: String },
  appearance: { type: String },
});

const ChapterSchema = new Schema<IChapter>({
  title: { type: String, required: true },
  summary: { type: String },
  targetWordCount: { type: Number },
  content: { type: String, default: "" },
  charactersPresent: [{ type: String }],
  order: { type: Number, required: true },
});

const NovelSchema = new Schema<INovel>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  writerPersonaId: { type: Schema.Types.ObjectId, ref: "WriterPersona", required: true },
  title: { type: String, required: true },
  status: { type: String, enum: ["Draft", "Completed"], default: "Draft" },
  worldSettings: {
    powerSystem: { type: String },
    cultivationLevels: { type: String },
  },
  characters: [CharacterSchema],
  chapters: [ChapterSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Novel: Model<INovel> = mongoose.models.Novel || mongoose.model<INovel>("Novel", NovelSchema);
