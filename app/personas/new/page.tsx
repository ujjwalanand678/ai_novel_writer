"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Upload, FileText, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { useDropzone } from "react-dropzone";

export default function NewPersona() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onDrop = (acceptedFiles: File[]) => {
    setFiles([...files, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/epub+zip": [".epub"],
      "text/plain": [".txt"],
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || files.length === 0) {
      setError("Please provide a name and at least one novel file.");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("name", name);
    files.forEach((file) => formData.append("files", file));

    try {
      const res = await fetch("/api/personas/create", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        router.push("/dashboard");
      } else {
        setError(data.error || "Failed to create persona");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <div className="pt-28 pb-20 px-4 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Create Writer Persona</h1>
        <p className="text-gray-400 mb-10">Upload existing novels to extract writing style, tone, and pacing.</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Writer Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., J.K. Rowling Style, Epic Fantasy Author"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-purple-500 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Upload Novels (PDF, EPUB, DOCX)</label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer ${
                isDragActive ? "border-purple-500 bg-purple-500/5" : "border-white/10 hover:border-white/20"
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-300 font-medium">Drag & drop files here, or click to select</p>
              <p className="text-gray-500 text-sm mt-2">Support for PDF, EPUB, and Word files</p>
            </div>
          </div>

          {files.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-300">Selected Files ({files.length})</p>
              <div className="grid grid-cols-1 gap-2">
                {files.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between glass px-4 py-3 rounded-xl border border-white/5">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-blue-400" />
                      <span className="text-sm text-gray-300 truncate max-w-[200px]">{file.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFiles(files.filter((_, i) => i !== idx))}
                      className="text-gray-500 hover:text-red-400 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center space-x-2 text-red-400 bg-red-400/10 p-4 rounded-2xl border border-red-400/20">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analyzing Writing Style...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Analyze & Create Persona</span>
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
