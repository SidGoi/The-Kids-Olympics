"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function ReplayPage() {
  const [kids, setKids] = useState([]);
  const [selectedKid, setSelectedKid] = useState(null);
  const [selectedGame, setSelectedGame] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingAll, setLoadingAll] = useState(false);
  
  // ✅ State to control the Custom UI Alertbox
  const [showConfirm, setShowConfirm] = useState(false);

  // Fetch kids
  useEffect(() => {
    fetch("/api/balak/all")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setKids(data.kids);
      });
  }, []);

  // Handle Single Replay
  const handleReplay = async () => {
    if (!selectedKid || !selectedGame) {
      toast.error("Please select kid and game");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/game/replay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kidId: selectedKid._id,
        gameName: selectedGame,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      toast.success("Game replay enabled 🎮");
      setSelectedGame("");
    } else {
      toast.error(data.message || "Something went wrong");
    }
  };

  // ✅ Actual logic for Replay All
  const executeReplayAll = async () => {
    setShowConfirm(false); // Close the custom alertbox
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
      setSelectedGame("");
    } else {
      toast.error(data.message || "Something went wrong");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6 relative">
      
      {/* 🛑 Custom UI Alertbox Overlay */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="text-center">
              <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Are you sure?</h3>
              <p className="text-slate-500 mb-8 leading-relaxed">
                This will reset <span className="font-bold text-red-600">ALL</span> games for <br/>
                <span className="font-bold text-slate-800">{selectedKid?.firstName} {selectedKid?.lastName}</span>.
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

      <Button className={"flex items-center justify-center gap-1 mb-8"}>
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
      
      <header className="mb-6">
        <h1 className="text-4xl font-bold text-pink-600">Replay Games</h1>
      </header>

      {/* Kid Select */}
      <Select
        onValueChange={(kidId) => {
          const kid = kids.find((k) => k._id === kidId);
          setSelectedKid(kid);
          setSelectedGame("");
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Kid" />
        </SelectTrigger>
        <SelectContent>
          {kids.map((kid) => (
            <SelectItem key={kid._id} value={kid._id}>
              {kid.firstName} {kid.lastName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Kid Card */}
      {selectedKid && (
        <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow">
          <Image
            src={
              selectedKid.pictureUrl ||
              "https://api.dicebear.com/7.x/adventurer/svg?seed=fallback"
            }
            width={60}
            height={60}
            className="rounded-lg"
            alt={selectedKid.firstName}
          />
          <div>
            <p className="font-bold">
              {selectedKid.firstName} {selectedKid.lastName}
            </p>
            <p className="text-sm text-gray-500">Select action below</p>
          </div>
        </div>
      )}

      {/* Game Select */}
      <Select
        onValueChange={setSelectedGame}
        disabled={!selectedKid}
        value={selectedGame}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Single Game" />
        </SelectTrigger>
        <SelectContent>
          {selectedKid?.games.map((game) => (
            <SelectItem
              key={game.name}
              value={game.name}
              disabled={!game.played}
            >
              {game.name} {game.played ? "🔁" : "Already Available"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="space-y-3 pt-4">
        {/* Single Replay Button */}
        <Button
          onClick={handleReplay}
          className="w-full"
          disabled={loading || !selectedGame || loadingAll}
        >
          {loading ? "Processing..." : "Replay Single Game"}
        </Button>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase">
            OR
          </span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* ✅ Replay All Button - Now triggers Custom Alertbox */}
        <Button
          onClick={() => {
            if (!selectedKid) return toast.error("Please select a kid first");
            setShowConfirm(true);
          }}
          variant="destructive"
          className="w-full"
          disabled={loadingAll || !selectedKid || loading}
        >
          {loadingAll ? "Resetting All..." : " Replay All Games"}
        </Button>
      </div>
    </div>
  );
}