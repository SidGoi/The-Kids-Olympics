"use client";

import { useEffect, useState, useRef } from "react";
import Pusher from "pusher-js";
import Image from "next/image";
import gsap from "gsap";

export default function LeaderboardPage() {
  const [data, setData] = useState({ kids: [] });
  const [loading, setLoading] = useState(true);

  // Refs for GSAP animations
  const podiumRef = useRef(null);

  const fetchScores = async () => {
    try {
      const res = await fetch("/api/balak/score");
      const json = await res.json();
      // Ensure sorting
      const sorted = (json.kids || []).sort((a, b) => b.totalScore - a.totalScore);
      setData({ kids: sorted });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: "ap2",
    });
    const channel = pusher.subscribe("kids-score");
    channel.bind("score-updated", fetchScores);
    return () => pusher.unsubscribe("kids-score");
  }, []);

  // GSAP Floating Animation
  useEffect(() => {
    if (!loading && podiumRef.current) {
      const ctx = gsap.context(() => {
        // Float animation for all podium items
        gsap.to(".podium-float", {
          y: -15,
          duration: 1.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          stagger: {
            each: 0.2,
            from: "center",
          },
        });
      }, podiumRef);
      return () => ctx.revert();
    }
  }, [loading, data]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-2xl font-bold text-orange-500">Loading Arena...</div>;

  const topThree = [data.kids[0], data.kids[1], data.kids[2]];
  const otherPlayers = data.kids.slice(3);

  return (
    <div className="min-h-screen bg-[#FFF8F0] p-6 md:p-10 font-sans overflow-hidden">
      
      {/* Title */}
      <header className="text-center mb-10">
        <h1 className="text-5xl md:text-6xl font-black text-[#5D4037] drop-shadow-sm tracking-tight">
          LEADER BOARD
        </h1>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 h-full">
        
        {/* --- LEFT SIDE: Top 3 Podium --- */}
        <div ref={podiumRef} className="lg:col-span-2 flex items-end justify-center pb-10 relative">
          {/* Background Decorative Circle */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[120%] h-full bg-orange-100 rounded-full blur-3xl opacity-50 -z-10" />

          <div className="flex items-end space-x-2 md:space-x-4 w-full justify-center">
            
            {/* Rank 2 (Left) */}
            <PodiumPillar 
              kid={topThree[1]} 
              rank={2} 
              color="bg-[#4FC3F7]" // Light Blue
              height="h-48"
              delay={0.2}
            />

            {/* Rank 1 (Center) */}
            <PodiumPillar 
              kid={topThree[0]} 
              rank={1} 
              color="bg-[#FFCA28]" // Amber/Gold
              height="h-64"
              isWinner
            />

            {/* Rank 3 (Right) */}
            <PodiumPillar 
              kid={topThree[2]} 
              rank={3} 
              color="bg-[#FF7043]" // Orange/Red
              height="h-40"
              delay={0.4}
            />
          </div>
        </div>

        {/* --- RIGHT SIDE: List View --- */}
        <div className="lg:col-span-3 bg-white rounded-[2rem] shadow-xl border border-orange-100 overflow-hidden flex flex-col h-[600px]">
          {/* List Header */}
          <div className="grid grid-cols-12 gap-2 bg-[#FFECB3] p-4 font-bold text-[#5D4037] text-sm uppercase tracking-wider border-b border-orange-200">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-2 text-center">Pic</div>
            <div className="col-span-4">Name</div>
            <div className="col-span-1 text-center">Age</div>
            <div className="col-span-2">Sabha</div>
            <div className="col-span-2 text-right">Score</div>
          </div>

          {/* Scrollable List */}
          <div className="overflow-y-auto flex-1 p-2 space-y-2 custom-scrollbar">
            {otherPlayers.map((kid, index) => (
              <div 
                key={kid._id || index} 
                className="grid grid-cols-12 gap-2 items-center bg-orange-50/50 hover:bg-orange-100 p-3 rounded-xl transition-colors duration-200"
              >
                {/* Rank */}
                <div className="col-span-1 text-center font-bold text-gray-400 text-lg">
                  {index + 4}
                </div>
                
                {/* Pic */}
                <div className="col-span-2 flex justify-center">
                  <div className="relative w-10 h-10">
                    <Image
                      src={kid.pictureUrl || "/placeholder.png"}
                      alt={kid.firstName}
                      fill
                      className="rounded-full object-cover border-2 border-white shadow-sm"
                    />
                  </div>
                </div>

                {/* Name */}
                <div className="col-span-4 font-bold text-[#4E342E] truncate">
                  {kid.firstName} {kid.lastName}
                </div>

                {/* Age */}
                <div className="col-span-1 text-center text-gray-600 font-medium">
                  {kid.age || "-"}
                </div>

                {/* Sabha */}
                <div className="col-span-2 text-gray-600 text-sm truncate">
                  {kid.sabha || "Bal Sabha"}
                </div>

                {/* Score */}
                <div className="col-span-2 text-right font-black text-orange-600 text-lg">
                  {kid.totalScore}
                </div>
              </div>
            ))}
            
            {otherPlayers.length === 0 && (
              <div className="text-center py-10 text-gray-400">Waiting for more players...</div>
            )}
          </div>
        </div>

      </div>
      
      {/* Styles for Pop Animation */}
      <style jsx global>{`
        @keyframes pop-glow {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.5; }
          100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
        }
        .animate-pop-glow {
          animation: pop-glow 2s infinite ease-out;
        }
        /* Custom Scrollbar for Right Side */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #FFE082;
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
}

// --- Sub Component: The Piller ---

function PodiumPillar({ kid, rank, color, height, isWinner }) {
  if (!kid) return <div className={`w-1/3 md:w-32 ${height} opacity-10`} />;

  return (
    <div className={`flex flex-col items-center w-1/3 md:w-36 group relative`}>
      
      {/* Moving Part: Avatar & Score */}
      <div className="podium-float flex flex-col items-center relative z-20 mb-2 w-full">
        
        {/* Winner Glow Effect */}
        {isWinner && (
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-yellow-400 rounded-full blur-xl -z-10 animate-pop-glow"></div>
        )}
        {isWinner && (
          <div className="absolute top-1/2 left-1/2 w-28 h-28 bg-white/50 rounded-full -z-10 animate-pulse"></div>
        )}

        {/* Crown for Winner */}
        {isWinner && (
          <div className="text-4xl absolute -top-10 animate-bounce drop-shadow-md">👑</div>
        )}

        {/* Avatar */}
        <div className={`relative ${isWinner ? "w-28 h-28 border-4 border-yellow-300" : "w-20 h-20 border-4 border-white"} rounded-full shadow-lg bg-gray-100 overflow-hidden`}>
          <Image
            src={kid.pictureUrl || "/placeholder.png"}
            alt={kid.firstName}
            fill
            className="object-cover"
          />
        </div>

        {/* Name Bubble */}
        <div className="mt-2 bg-white px-3 py-1 rounded-full shadow-sm text-[#4E342E] font-bold text-sm md:text-base border border-orange-100 whitespace-nowrap z-20">
          {kid.firstName}
        </div>

        {/* Score Bubble */}
        <div className="mt-1 bg-[#4E342E] text-white px-3 py-0.5 rounded-full text-xs font-mono shadow-md z-20">
          {kid.totalScore} pts
        </div>
      </div>

      {/* Static Part: The Pillar */}
      <div className={`w-full ${height} ${color} rounded-t-[2.5rem] shadow-[inset_0_-10px_20px_rgba(0,0,0,0.1)] flex justify-center pt-4 relative z-10 border-b-8 border-black/10`}>
        <span className="text-white/50 text-6xl font-black mix-blend-overlay mt-4">
          {rank}
        </span>
      </div>
    </div>
  );
}