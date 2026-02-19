"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Book, Check, ChevronRight, Loader2, Sparkles, UserCheck } from "lucide-react";

export default function NewNovel() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [personas, setPersonas] = useState<any[]>([]);
  const [selectedPersona, setSelectedPersona] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/personas")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setPersonas(data.personas);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async () => {
    if (!title || !selectedPersona) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/novels/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          writerPersonaId: selectedPersona,
          worldSettings: {
            powerSystem: "Standard",
            cultivationLevels: "None",
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        router.push(`/studio/${data.novel._id}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <main className="min-h-screen">
      <Navbar />
      
      <div className="pt-28 pb-20 px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Create New Novel</h1>
        <p className="text-gray-400 mb-10">Choose your title and a writer persona to begin your journey.</p>

        <div className="space-y-12">
          {/* Step 1: Title */}
          <section className="space-y-4">
            <div className="flex items-center space-x-3 text-purple-400">
              <span className="flex items-center justify-center w-8 h-8 rounded-full border border-purple-400 text-sm font-bold">1</span>
              <h2 className="text-xl font-bold text-white">Give your novel a title</h2>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your novel's title..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-2xl font-bold text-white focus:outline-none focus:border-purple-500 transition-all placeholder:text-gray-700"
            />
          </section>

          {/* Step 2: Persona Selection */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 text-purple-400">
                <span className="flex items-center justify-center w-8 h-8 rounded-full border border-purple-400 text-sm font-bold">2</span>
                <h2 className="text-xl font-bold text-white">Select Writer Persona</h2>
              </div>
              <button 
                onClick={() => router.push("/personas/new")}
                className="text-sm text-gray-400 hover:text-white transition-colors flex items-center space-x-1"
              >
                <span>Create new persona</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
              </div>
            ) : personas.length === 0 ? (
              <div className="glass p-12 rounded-3xl text-center border border-white/5">
                <p className="text-gray-500 mb-4">You haven't created any writer personas yet.</p>
                <button 
                  onClick={() => router.push("/personas/new")}
                  className="bg-purple-600 px-6 py-2 rounded-xl text-sm font-bold"
                >
                  Create Your First Persona
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {personas.map((persona) => (
                  <div
                    key={persona._id}
                    onClick={() => setSelectedPersona(persona._id)}
                    className={`glass p-6 rounded-3xl border cursor-pointer transition-all relative ${
                      selectedPersona === persona._id 
                        ? "border-purple-500 bg-purple-500/10" 
                        : "border-white/5 hover:border-white/20"
                    }`}
                  >
                    {selectedPersona === persona._id && (
                      <div className="absolute top-4 right-4 bg-purple-500 rounded-full p-1">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <UserCheck className={`w-8 h-8 mb-4 ${selectedPersona === persona._id ? "text-purple-400" : "text-gray-600"}`} />
                    <h3 className="font-bold text-white mb-1">{persona.name}</h3>
                    <p className="text-xs text-gray-500 line-clamp-1">{persona.description}</p>
                    <div className="mt-4 flex space-x-2">
                       <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-gray-400">{persona.styleAttributes?.tone} Tone</span>
                       <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-gray-400">{persona.styleAttributes?.genre || 'General'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Action */}
          <div className="pt-10 border-t border-white/5 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={!title || !selectedPersona || submitting}
              className="flex items-center space-x-2 bg-white text-black px-10 py-4 rounded-full font-bold hover:bg-gray-200 transition-all disabled:opacity-30 shadow-2xl shadow-white/5"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
              <span>Initialize Writing Studio</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
