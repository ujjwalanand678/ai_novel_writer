"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { BookOpen, User as UserIcon, LogOut, PlusCircle } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-white/5 bg-black/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="w-8 h-8 text-purple-500" />
              <span className="text-xl font-bold gradient-text">AI Novel Writer</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/personas/new"
                  className="flex items-center space-x-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all shadow-lg shadow-purple-500/20"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>New Persona</span>
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-300 hover:text-white px-3 py-2 transition-colors">
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt="Avatar"
                        className="w-8 h-8 rounded-full border border-white/10"
                      />
                    ) : (
                      <UserIcon className="w-8 h-8 p-1 rounded-full border border-white/10" />
                    )}
                  </button>
                  <div className="absolute right-0 w-48 mt-2 py-1 bg-neutral-900 border border-white/5 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all translate-y-2 group-hover:translate-y-0">
                    <div className="px-4 py-2 border-b border-white/5">
                      <p className="text-sm font-medium text-white truncate">{session.user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                    </div>
                    <button
                      onClick={() => signOut()}
                      className="flex w-full items-center space-x-2 px-4 py-2 text-sm text-red-400 hover:bg-white/5 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <button
                onClick={() => signIn("google")}
                className="bg-white text-black hover:bg-gray-200 px-6 py-2 rounded-full text-sm font-bold transition-all"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
