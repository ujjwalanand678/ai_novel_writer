import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Book, Users, ScrollText } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
          Write Your Next Masterpiece with <span className="gradient-text">AI Persona</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Upload your favorite novels to create a writing style persona. 
          Generate chapters that feel authentically yours.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            href="/personas/new" 
            className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-bold text-lg transition-all shadow-xl shadow-purple-500/20"
          >
            Create Writer Persona
          </Link>
          <Link 
            href="/dashboard" 
            className="px-8 py-4 glass hover:bg-white/5 text-white rounded-full font-bold text-lg transition-all"
          >
            Go to Dashboard
          </Link>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass p-8 rounded-3xl text-left border border-white/5">
            <Users className="w-12 h-12 text-blue-400 mb-6" />
            <h3 className="text-2xl font-bold mb-4">Analyze Persona</h3>
            <p className="text-gray-400">Upload PDF, EPUB, or Word files to extract unique writing patterns and tones.</p>
          </div>
          <div className="glass p-8 rounded-3xl text-left border border-white/5">
            <ScrollText className="w-12 h-12 text-purple-400 mb-6" />
            <h3 className="text-2xl font-bold mb-4">World Building</h3>
            <p className="text-gray-400">Define cultivation levels, magic systems, and detailed character backgrounds.</p>
          </div>
          <div className="glass p-8 rounded-3xl text-left border border-white/5">
            <Book className="w-12 h-12 text-pink-400 mb-6" />
            <h3 className="text-2xl font-bold mb-4">AI Co-Writer</h3>
            <p className="text-gray-400">Generate whole chapters based on your summary, preserving the persona's style.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
