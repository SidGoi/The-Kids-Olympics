"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { Search, X, CheckCircle, ListTodo } from "lucide-react"; // Added Icons
import KidButton from "@/components/ui/KidButton";

export default function ReplayPage() {
  const [kids, setKids] = useState([]);
  const [selectedKid, setSelectedKid] = useState(null);
  const [loadingAll, setLoadingAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  // Fetch kids
  useEffect(() => {
    fetch("/api/balak/all")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setKids(data.kids);
      });
  }, []);

  // Filter kids based on search
  const filteredKids = kids.filter((kid) => {
    const fullName = `${kid.firstName} ${kid.lastName}`.toLowerCase();
    const search = searchTerm.toLowerCase();
    return fullName.includes(search);
  });

  // Logic for Replay All
  const executeReplayAll = async () => {
    if (!selectedKid) return;

    setShowConfirm(false);
    setLoadingAll(true);

    const res = await fetch("/api/game/replay-all", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kidId: selectedKid._id,
      }),
    });

    const data = await res.json();
    setLoadingAll(false);

    if (data.success) {
      toast.success("All games reset successfully! 🔄");
      // Update local state to reflect changes immediately
      const updatedKid = {
        ...selectedKid,
        games: selectedKid.games.map((g) => ({ ...g, played: false })),
      };
      setSelectedKid(updatedKid);
    } else {
      toast.error(data.message || "Something went wrong");
    }
  };

  // Helper: Get Unplayed Games
  const getUnplayedGames = () => {
    if (!selectedKid) return [];
    return selectedKid.games.filter((game) => !game.played);
  };

  const unplayedGames = getUnplayedGames();
  const isAllPlayed = selectedKid && unplayedGames.length === 0;

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6 relative min-h-screen">
      {/* 🛑 Custom UI Alertbox Overlay */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="text-center">
              <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">
                Are you sure?
              </h3>
              <p className="text-slate-500 mb-8 leading-relaxed">
                This will reset{" "}
                <span className="font-bold text-red-600">ALL</span> games for{" "}
                <br />
                <span className="font-bold text-slate-800">
                  {selectedKid?.firstName} {selectedKid?.lastName}
                </span>
                .
              </p>

              <div className="flex flex-col gap-3">
                <Button
                  onClick={executeReplayAll}
                  variant="destructive"
                  className="w-full h-12 rounded-xl font-bold text-lg"
                >
                  Yes, Reset all games
                </Button>
                <Button
                  onClick={() => setShowConfirm(false)}
                  variant="ghost"
                  className="w-full h-12 rounded-xl font-bold text-slate-400 hover:text-slate-600"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Link href={"/"}>
        <Button className={"flex items-center justify-center gap-1 mb-4"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#FFFFFF"
          >
            <path d="m314-440 114 114q12 12 11.5 28T428-270q-12 12-28.5 12.5T371-269L188-452q-12-12-12-28t12-28l183-183q12-12 28.5-11.5T428-690q11 12 11.5 28T428-634L314-520h446q17 0 28.5 11.5T800-480q0 17-11.5 28.5T760-440H314Z" />
          </svg>{" "}
          Back to Home
        </Button>
      </Link>

      <header className="mb-6">
        <h1 className="text-4xl font-bold text-pink-600">Replay Games</h1>
      </header>

      {/* --- Search Section --- */}
      <div className="w-full max-w-2xl mb-6 sticky top-4 z-20">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-pink-300 group-focus-within:text-pink-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search name of Balak..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-12 py-3 bg-white border-2 border-pink-100 text-slate-700 rounded-full focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all shadow-sm placeholder:text-pink-200 font-bold"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-pink-300 hover:text-pink-600 transition-colors"
              aria-label="Clear search"
            >
              <X className="h-5 w-5 border-2 border-pink-100 rounded-full p-0.5 bg-pink-50" />
            </button>
          )}
        </div>
      </div>

      {/* Kid Selection Dropdown List */}
      {searchTerm && !selectedKid && (
        <div className="bg-white border border-pink-100 rounded-2xl shadow-lg max-h-60 overflow-y-auto z-30">
          {filteredKids.length > 0 ? (
            filteredKids.map((kid) => (
              <div
                key={kid._id}
                onClick={() => {
                  setSelectedKid(kid);
                  setSearchTerm("");
                }}
                className="p-3 hover:bg-pink-50 cursor-pointer border-b border-pink-50 last:border-0 font-medium text-slate-700"
              >
                {kid.firstName} {kid.lastName}
              </div>
            ))
          ) : (
            <div className="p-3 text-slate-400 text-center">
              No results found
            </div>
          )}
        </div>
      )}

      {/* Selected Kid Card */}
      {selectedKid && (
        <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow border border-pink-50 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-4">
            <Image
              src={
                selectedKid.pictureUrl ||
                "https://api.dicebear.com/7.x/adventurer/svg?seed=fallback"
              }
              width={60}
              height={60}
              className="rounded-lg bg-slate-100"
              alt={selectedKid.firstName}
            />
            <div>
              <p className="font-bold text-slate-800 text-lg">
                {selectedKid.firstName} {selectedKid.lastName}
              </p>
              <p className="text-sm text-gray-500">
                {isAllPlayed ? (
                  <span className="text-green-600 flex items-center gap-1 font-medium">
                    <CheckCircle className="w-4 h-4" /> All Games Played
                  </span>
                ) : (
                  <span className="text-orange-500 flex items-center gap-1 font-medium">
                    <ListTodo className="w-4 h-4" /> {unplayedGames.length}{" "}
                    Games Remaining
                  </span>
                )}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedKid(null);
            }}
            className="text-pink-400 hover:text-pink-600 font-bold text-xs uppercase tracking-widest px-3 py-2 hover:bg-pink-50 rounded-lg transition-colors"
          >
            Change
          </button>
        </div>
      )}

      {/* --- Conditional Logic Section --- */}
      {selectedKid && (
        <div className="pt-4">
          {isAllPlayed ? (
            // ✅ CASE 1: All Games Played -> Show Replay All Button
            <div className="space-y-4 animate-in zoom-in duration-300">
              <div className="bg-green-50 border border-green-200 p-4 rounded-xl text-center text-green-800">
                <p className="font-medium">
                  🎉 Great job! This kid has completed all games.
                </p>
                <p className="text-sm opacity-80 mt-1">
                  You can now reset all games to play again.
                </p>
              </div>

              <div disabled={loadingAll} onClick={() => setShowConfirm(true)}>
                <KidButton
                  label={
                    loadingAll ? "Resetting All..." : "🔄 Replay All Games"
                  }
                  color="#FF5555"
                />
              </div>
            </div>
          ) : (
            // ✅ CASE 2: Games Remaining -> Show List of Remaining Games
            <div className="space-y-4 animate-in zoom-in duration-300">
              <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl text-center text-orange-800 mb-4">
                <p className="font-bold text-lg">
                  ⚠️ Finish these games first!
                </p>
                <p className="text-sm opacity-80">
                  Replay option will appear once all games are done.
                </p>
              </div>

              <h3 className="font-bold text-slate-700 ml-1 mb-2">
                Remaining Games:
              </h3>
              <div className="grid gap-3">
                {unplayedGames.map((game) => (
                  <div
                    key={game.name}
                    className="bg-white p-4 rounded-xl border-l-4 border-orange-400 shadow-sm flex items-center justify-between"
                  >
                    <span className="font-bold text-slate-700">
                      {game.name}
                    </span>
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-bold uppercase">
                      Pending
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
