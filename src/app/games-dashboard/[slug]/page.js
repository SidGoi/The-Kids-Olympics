<<<<<<< HEAD
import React from "react";
import { notFound } from "next/navigation";
import initialGames from "@/data/Games";
import GameCard from "@/components/ui/GameCard";
=======
"use client";

import React, { useState, useEffect } from "react";
import { notFound, useParams } from "next/navigation";
import initialGames from "@/data/Games";
import GameCard from "@/components/ui/GameCard";
import { Spinner } from "@/components/ui/spinner";

export default function GamePage() {
  const params = useParams(); 
  const [kids, setKids] = useState([]);
  const [loading, setLoading] = useState(true);

  const gameInfo = initialGames.find((g) => g.slug === params.slug);

  const fetchKids = async () => {
    try {
      const response = await fetch("/api/balak/all");
      const data = await response.json();
      if (data.success) {
        setKids(data.kids);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!gameInfo) return;

    // Initial load
    fetchKids();

    // High-frequency polling (1.2 seconds)
    const interval = setInterval(fetchKids, 1200);

    return () => clearInterval(interval);
  }, [gameInfo]);
>>>>>>> 1c309704b63d7b108a9075b97db1b16fbd1801b7

  if (!gameInfo) return notFound();
<<<<<<< HEAD

  let kids = [];
  try {
    // Ensure you use your real API URL or localhost for dev
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/balak/all`, {
      cache: "no-store",
    });
    const data = await response.json();
    kids = data.success ? data.kids : [];
  } catch (error) {
    console.error("Fetch Error:", error);
  }
=======
  if (loading) return <div className="flex justify-center mt-20"><Spinner /></div>;
>>>>>>> 1c309704b63d7b108a9075b97db1b16fbd1801b7

  return (
    <div className="min-h-screen bg-pink-50 p-4 md:p-12 flex flex-col items-center">
      <h1 className="text-3xl md:text-5xl font-black text-pink-600 mb-8 uppercase tracking-tight text-center">
        {gameInfo.name}
      </h1>
<<<<<<< HEAD
       <div className="w-full max-w-2xl flex flex-col gap-4">
        {kids.map((kid) => {
          // IMPORTANT: Extract the played status for THIS specific game from the DB
          const currentProgress = kid.games?.find(
            (g) => g.name === gameInfo.name
          );

=======

      <div className="w-full max-w-2xl flex flex-col gap-3">
        {kids.map((kid) => {
          const currentProgress = kid.games?.find(g => g.name === gameInfo.name);
>>>>>>> 1c309704b63d7b108a9075b97db1b16fbd1801b7
          return (
            <GameCard
              key={kid._id}
              kidId={kid._id}
              gameName={gameInfo.name}
              userName={`${kid.firstName} ${kid.lastName}`}
              sabhaName={kid.sabha}
              userImage={kid.pictureUrl}
              isPlayedInitially={currentProgress?.played || false}
              initialStars={currentProgress ? currentProgress.score / 1000 : 0}
            />
          );
        })}
      </div>
    </div>
  );
}
