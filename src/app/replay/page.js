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
  const [loadingAll, setLoadingAll] = useState(false); // Separate loading state for "Replay All"

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
      // Optional: Refresh local kid data here if needed
    } else {
      toast.error(data.message || "Something went wrong");
    }
  };

  // ✅ Handle Replay All
  const handleReplayAll = async () => {
    if (!selectedKid) {
      toast.error("Please select a kid first");
      return;
    }

    // Confirmation (Optional but recommended)
    if (!confirm(`Are you sure you want to reset ALL games for ${selectedKid.firstName}?`)) {
        return;
    }

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
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center">🔄 Replay Game</h1>

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
            src={selectedKid.pictureUrl || "https://api.dicebear.com/7.x/adventurer/svg?seed=fallback"}
            width={60}
            height={60}
            className="rounded-lg"
            alt={selectedKid.firstName}
          />
          <div>
            <p className="font-bold">
              {selectedKid.firstName} {selectedKid.lastName}
            </p>
            <p className="text-sm text-gray-500">
              Select action below
            </p>
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
            <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase">OR</span>
            <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* ✅ Replay All Button */}
        <Button
          onClick={handleReplayAll}
          variant="destructive" // Makes it red/alert style
          className="w-full"
          disabled={loadingAll || !selectedKid || loading}
        >
          {loadingAll ? "Resetting All..." : "🔄 Replay All Games"}
        </Button>
      </div>
    </div>
  );
}