import React from "react";
import Link from "next/link"; // 1. Import the Link component
import initialGames from "@/data/Games";
import { Button } from "@/components/ui/button";
import { color } from "framer-motion";

const GamesDashboards = () => {
  return (
    <div className="font-primary min-h-screen bg-[#FCF9EA] p-8">
      <div className="">
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
          <h1 className="text-4xl font-bold text-pink-600">
            Games Dashboards!
          </h1>
          <p className="text-pink-400">Select a game to get started</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {initialGames.map((game, index) => (
            <Link
              href={`/games-dashboard/${game.slug}`}
              key={index}
              className="w-full"
            >
              <Button
                variant="outline"
                // 1. Remove the dynamic bg class from className
                className="w-full h-20 text-xl font-bold text-white transition-all duration-300"
                // 2. Use the style prop for dynamic hex colors
                style={{ backgroundColor: game.themeColor }}
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
