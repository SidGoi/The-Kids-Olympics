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

  if (!gameInfo) {
    notFound();
    return null;
  }

  const fetchKids = async () => {
    try {
      const response = await fetch("/api/balak/all", {
        cache: "no-store",
      });
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
    // initial fetch
    fetchKids();

    const interval = setInterval(fetchKids, 1200);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 p-4 md:p-12 flex flex-col items-center">
      <h1 className="text-3xl md:text-5xl font-black text-pink-600 mb-8 uppercase tracking-tight text-center">
        {gameInfo.name}
      </h1>

      <div className="w-full max-w-2xl flex flex-col gap-3">
        {kids.map((kid) => {
          const currentProgress = kid.games?.find(
            (g) => g.name === gameInfo.name
          );

          return (
            <GameCard
              key={kid._id}
              kidId={kid._id}
              gameName={gameInfo.name}
              userName={`${kid.firstName} ${kid.lastName}`}
              sabhaName={kid.sabha}
              userImage={kid.pictureUrl}
              isPlayedInitially={currentProgress?.played || false}
              initialStars={
                currentProgress ? currentProgress.score / 1000 : 0
              }
            />
          );
        })}
      </div>
    </div>
  );
}
