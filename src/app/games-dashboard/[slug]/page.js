import React from "react";
import { notFound } from "next/navigation";
import initialGames from "@/data/Games";
import GameCard from "@/components/ui/GameCard";

export default async function GamePage({ params }) {
  const { slug } = await params;
  const gameInfo = initialGames.find((g) => g.slug === slug);
  if (!gameInfo) return notFound();

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

  return (
    <div className="min-h-screen bg-pink-50 p-6 md:p-12 flex flex-col items-center">
      <h1 className="text-4xl font-black text-pink-600 mb-10 uppercase tracking-tight">
        {gameInfo.name}
      </h1>
       <div className="w-full max-w-2xl flex flex-col gap-4">
        {kids.map((kid) => {
          // IMPORTANT: Extract the played status for THIS specific game from the DB
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
              // This is the key to persistence on reload
              isPlayedInitially={currentProgress?.played || false}
            />
          );
        })}
      </div>
    </div>
  );
}
