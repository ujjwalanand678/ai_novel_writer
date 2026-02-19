"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import { 
  Plus, Users, Globe, BookText, Settings, 
  Sparkles, Save, Download, Loader2, ChevronRight,
  UserPlus, Zap, Wand2, FileDown
} from "lucide-react";

export default function WritingStudio() {
  const { novelId } = useParams();
  const { data: session } = useSession();
  const [novel, setNovel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"editor" | "characters" | "world">("editor");
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // States for generating chapter
  const [chapterSummary, setChapterSummary] = useState("");
  const [targetWordCount, setTargetWordCount] = useState(1000);
  const [selectedChars, setSelectedChars] = useState<string[]>([]);

  useEffect(() => {
    if (session && novelId) {
      fetch(`/api/novels/${novelId}/update`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setNovel(data.novel);
          setLoading(false);
        });
    }
  }, [session, novelId]);

  const saveNovel = async (updatedData: any) => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/novels/${novelId}/update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      if (data.success) setNovel(data.novel);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const generateChapter = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch(`/api/novels/${novelId}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapterIndex: activeChapterIndex,
          summary: chapterSummary,
          targetWordCount,
          charactersPresent: selectedChars,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNovel(data.novel);
        setChapterSummary("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    window.open(`/api/novels/${novelId}/download`, "_blank");
  };

  if (!session || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505]">
      <Navbar />
      
      <div className="pt-20 h-screen flex flex-col md:flex-row">
        {/* Sidebar: Navigation & Chapters */}
        <aside className="w-full md:w-72 glass border-r border-white/5 flex flex-col">
          <div className="p-6 border-b border-white/5">
            <h2 className="font-bold text-lg truncate mb-1">{novel.title}</h2>
            <p className="text-xs text-gray-500">Persona: {novel.writerPersonaId?.name}</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <nav className="space-y-1">
              <button 
                onClick={() => setActiveTab("editor")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'editor' ? 'bg-purple-500/10 text-purple-400' : 'text-gray-400 hover:bg-white/5'}`}
              >
                <BookText className="w-4 h-4" />
                <span className="text-sm font-medium">Writing Desk</span>
              </button>
              <button 
                onClick={() => setActiveTab("characters")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'characters' ? 'bg-blue-500/10 text-blue-400' : 'text-gray-400 hover:bg-white/5'}`}
              >
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">Characters</span>
              </button>
              <button 
                onClick={() => setActiveTab("world")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'world' ? 'bg-green-500/10 text-green-400' : 'text-gray-400 hover:bg-white/5'}`}
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">World Setting</span>
              </button>
            </nav>

            <div className="space-y-4 pt-4 border-t border-white/5">
               <div className="flex items-center justify-between px-2">
                 <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Chapters</h3>
                 <button className="text-gray-400 hover:text-white transition-colors">
                   <Plus className="w-4 h-4" />
                 </button>
               </div>
               <div className="space-y-1">
                 {novel.chapters?.map((chapter: any, index: number) => (
                   <button
                    key={index}
                    onClick={() => { setActiveChapterIndex(index); setActiveTab("editor"); }}
                    className={`w-full flex items-center justify-between px-4 py-2 border rounded-xl text-sm transition-all ${activeChapterIndex === index ? 'border-purple-500/30 bg-purple-500/5 text-purple-400' : 'border-transparent text-gray-500 hover:bg-white/5'}`}
                   >
                     <span className="truncate">{chapter.title}</span>
                     <ChevronRight className="w-3 h-3 opacity-50" />
                   </button>
                 ))}
               </div>
            </div>
          </div>

          <div className="p-4 border-t border-white/5 space-y-2">
            <button 
              onClick={handleDownload}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-xl border border-white/5 text-gray-300 hover:bg-white/5 text-sm transition-all"
            >
              <FileDown className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <section className="flex-1 overflow-y-auto bg-black/20">
          {activeTab === "editor" && (
            <div className="p-4 md:p-8 max-w-4xl mx-auto h-full flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold">{novel.chapters[activeChapterIndex]?.title || "New Chapter"}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {novel.chapters[activeChapterIndex]?.content?.length || 0} characters
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button className="flex items-center space-x-2 px-4 py-2 glass rounded-xl text-sm font-medium hover:bg-white/10 transition-all">
                    <Save className="w-4 h-4" />
                    <span>Save Draft</span>
                  </button>
                </div>
              </div>

              <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-3xl p-8 mb-8 relative">
                <textarea
                  className="w-full h-full bg-transparent border-none outline-none resize-none text-gray-300 leading-relaxed text-lg font-serif"
                  placeholder="The story begins here..."
                  value={novel.chapters[activeChapterIndex]?.content || ""}
                  onChange={(e) => {
                    const newChapters = [...novel.chapters];
                    if (!newChapters[activeChapterIndex]) {
                       newChapters[activeChapterIndex] = { title: "New Chapter", content: "", order: activeChapterIndex };
                    }
                    newChapters[activeChapterIndex].content = e.target.value;
                    setNovel({ ...novel, chapters: newChapters });
                  }}
                />
              </div>

              {/* Generator Section */}
              <div className="glass p-8 rounded-3xl border border-purple-500/20 shadow-2xl shadow-purple-500/5">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2 text-purple-400">
                    <Sparkles className="w-5 h-5" />
                    <h3 className="font-bold text-lg">AI Writing Assistant</h3>
                  </div>
                  <div className="text-xs bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full border border-purple-500/20">
                    Mode: {novel.writerPersonaId?.name}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Chapter Summary/Goal</label>
                    <textarea 
                      value={chapterSummary}
                      onChange={(e) => setChapterSummary(e.target.value)}
                      placeholder="e.g. Hero enters the dark forest and encounters an ancient guardian..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-purple-500 transition-all h-24"
                    />
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Characters in Chapter</label>
                      <div className="flex flex-wrap gap-2">
                        {novel.characters.map((char: any, i: number) => (
                          <button
                            key={i}
                            onClick={() => setSelectedChars(prev => prev.includes(char.name) ? prev.filter(c => c !== char.name) : [...prev, char.name])}
                            className={`text-xs px-3 py-1 rounded-full border transition-all ${selectedChars.includes(char.name) ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'}`}
                          >
                            {char.name}
                          </button>
                        ))}
                        {novel.characters.length === 0 && (
                          <span className="text-xs text-gray-600 italic">No characters added yet.</span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Target Word Count: {targetWordCount}</label>
                       <input 
                        type="range" min="500" max="3000" step="500"
                        value={targetWordCount}
                        onChange={(e) => setTargetWordCount(parseInt(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                       />
                    </div>
                  </div>
                </div>

                <button 
                  onClick={generateChapter}
                  disabled={!chapterSummary || isGenerating}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-purple-500/30 flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                  <span>Generate Chapter Content</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === "characters" && (
            <div className="p-8 max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-bold flex items-center space-x-3">
                   <Users className="w-8 h-8 text-blue-400" />
                   <span>Character Dossier</span>
                </h2>
                <button 
                  onClick={() => {
                    const newChars = [...novel.characters, { name: "New Character", role: "Supporting", age: "", background: "" }];
                    saveNovel({ characters: newChars });
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center space-x-2 transition-all shadow-lg shadow-blue-500/20"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Add Character</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {novel.characters.map((char: any, index: number) => (
                  <div key={index} className="glass p-6 rounded-3xl border border-white/5 hover:border-blue-500/20 transition-all relative group">
                    <input
                      className="text-xl font-bold bg-transparent border-none outline-none mb-2 w-full text-blue-400"
                      value={char.name}
                      onChange={(e) => {
                        const newChars = [...novel.characters];
                        newChars[index].name = e.target.value;
                        setNovel({...novel, characters: newChars});
                      }}
                      onBlur={() => saveNovel({ characters: novel.characters })}
                    />
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-gray-600 tracking-widest">Role</label>
                        <input className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500/30" value={char.role} onChange={(e) => {
                          const nc = [...novel.characters]; nc[index].role = e.target.value; setNovel({...novel, characters: nc});
                        }} onBlur={() => saveNovel({ characters: novel.characters })} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-gray-600 tracking-widest">Age</label>
                        <input className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500/30" value={char.age} onChange={(e) => {
                          const nc = [...novel.characters]; nc[index].age = e.target.value; setNovel({...novel, characters: nc});
                        }} onBlur={() => saveNovel({ characters: novel.characters })} />
                      </div>
                      <div className="space-y-1 col-span-2">
                        <label className="text-[10px] uppercase font-bold text-gray-600 tracking-widest">Ability/Power</label>
                        <input className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500/30" value={char.ability} onChange={(e) => {
                          const nc = [...novel.characters]; nc[index].ability = e.target.value; setNovel({...novel, characters: nc});
                        }} onBlur={() => saveNovel({ characters: novel.characters })} />
                      </div>
                      <div className="space-y-1 col-span-2">
                        <label className="text-[10px] uppercase font-bold text-gray-600 tracking-widest">Background</label>
                        <textarea className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500/30 h-20 resize-none" value={char.background} onChange={(e) => {
                          const nc = [...novel.characters]; nc[index].background = e.target.value; setNovel({...novel, characters: nc});
                        }} onBlur={() => saveNovel({ characters: novel.characters })} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "world" && (
            <div className="p-8 max-w-4xl mx-auto">
               <h2 className="text-3xl font-bold flex items-center space-x-3 mb-10">
                   <Globe className="w-8 h-8 text-green-400" />
                   <span>World Building</span>
                </h2>
                
                <div className="grid grid-cols-1 gap-8">
                  <div className="glass p-8 rounded-3xl border border-white/5 space-y-6">
                    <div className="flex items-center space-x-2 text-green-400 mb-2">
                      <Zap className="w-5 h-5" />
                      <h3 className="font-bold text-lg">Power System & Cultivation</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Power System Description</label>
                        <textarea 
                          className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white focus:outline-none focus:border-green-500/50 transition-all h-32"
                          placeholder="Describe how magic, supernatural powers, or cultivation works in your world..."
                          value={novel.worldSettings?.powerSystem || ""}
                          onChange={(e) => {
                            setNovel({...novel, worldSettings: {...novel.worldSettings, powerSystem: e.target.value}});
                          }}
                          onBlur={() => saveNovel({ worldSettings: novel.worldSettings })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Cultivation Levels / Ranks</label>
                        <input 
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-green-500/50 transition-all"
                          placeholder="e.g. Mortal -> Foundation -> Core Formation..."
                          value={novel.worldSettings?.cultivationLevels || ""}
                          onChange={(e) => {
                            setNovel({...novel, worldSettings: {...novel.worldSettings, cultivationLevels: e.target.value}});
                          }}
                          onBlur={() => saveNovel({ worldSettings: novel.worldSettings })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
