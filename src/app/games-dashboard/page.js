import React from 'react';
import Link from 'next/link'; // 1. Import the Link component
import initialGames from '@/data/Games';
import { Button } from "@/components/ui/button";

const GamesDashboards = () => {
  return (
    <div className="min-h-screen bg-pink-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-pink-600 mb-2">
            Games Dashboard
          </h1>
          <p className="text-pink-400">Select a game to get started</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {initialGames.map((game, index) => (
            /* 2. Wrap the Button in a Link using the game's slug */
            <Link href={`/games-dashboard/${game.slug}`} key={index} className="w-full">
              <Button
                variant="outline"
                className="w-full h-24 text-lg font-semibold border-2 border-pink-200 hover:border-pink-500 hover:bg-pink-500 hover:text-white transition-all duration-300 shadow-sm bg-white text-pink-600 rounded-xl"
              >
                {game.name}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GamesDashboards;