"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Plus, Book, Users, Trash2, ExternalLink, Clock } from "lucide-react";
import { toast } from "sonner";

export default function Dashboard() {
  const [novels, setNovels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/novels/create")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setNovels(data.novels);
        setLoading(false);
      });
  }, []);


  return (
    <main className="min-h-screen">
      <Navbar />
      
      <div className="pt-28 pb-10 px-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Library</h1>
            <p className="text-gray-400">Manage your novels and writing personas.</p>
          </div>
          <div className="flex space-x-4">
            <Link href="/personas/new" className="glass px-6 py-2 rounded-xl text-sm font-medium hover:bg-white/5 transition-all flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span>Writer Personas</span>
            </Link>
            <Link href="/novels/new" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl text-sm font-medium transition-all flex items-center space-x-2 shadow-lg shadow-purple-500/20">
              <Plus className="w-4 h-4" />
              <span>New Novel</span>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-white/5 rounded-3xl border border-white/5" />
            ))}
          </div>
        ) : novels.length === 0 ? (
          <div className="glass p-20 rounded-3xl text-center border border-white/5">
            <Book className="w-16 h-16 text-gray-600 mx-auto mb-6" />
            <h3 className="text-2xl font-bold mb-2">No novels yet</h3>
            <p className="text-gray-400 mb-8">Start your writing journey by creating your first novel.</p>
            <Link href="/novels/new" className="bg-white text-black px-8 py-3 rounded-full font-bold transition-all">
              Create Novel
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {novels.map((novel) => (
              <div key={novel._id} className="glass p-6 rounded-3xl group border border-white/5 hover:border-purple-500/30 transition-all flex flex-col justify-between h-80">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${novel.status === 'Draft' ? 'bg-blue-500/10 text-blue-400' : 'bg-green-500/10 text-green-400'}`}>
                      {novel.status}
                    </span>
                    <Clock className="w-4 h-4 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">{novel.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                    Persona: <span className="text-gray-300">{novel.writerPersonaId?.name || 'Unknown'}</span>
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-[10px] bg-white/5 px-2 py-1 rounded border border-white/5 text-gray-500">
                      {novel.chapters?.length || 0} Chapters
                    </span>
                    <span className="text-[10px] bg-white/5 px-2 py-1 rounded border border-white/5 text-gray-500">
                      {novel.characters?.length || 0} Characters
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-2 pt-4 border-t border-white/5">
                  <Link 
                    href={`/studio/${novel._id}`} 
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white text-center py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center space-x-2"
                  >
                    <span>Open Editor</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                  <button 
                    onClick={async () => {
                      if (!confirm("Are you sure you want to delete this novel?")) return;
                      const res = await fetch(`/api/novels/${novel._id}`, { method: "DELETE" });
                      if (res.ok) {
                        toast.success("Novel deleted successfully");
                        setNovels(novels.filter(n => n._id !== novel._id));
                      } else {
                        toast.error("Failed to delete novel");
                      }
                    }}
                    className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
