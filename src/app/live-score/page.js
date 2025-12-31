"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function LeaderboardPage() {
  const [kids, setKids] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchScores = async () => {
    try {
      const res = await fetch("/api/balak/all");
      const json = await res.json();
      if (json.success) {
        // --- Age Advantage Sorting Logic ---
        const sorted = [...json.kids].sort((a, b) => {
          // 1. First, compare total scores (Descending)
          if (b.totalScore !== a.totalScore) {
            return b.totalScore - a.totalScore;
          }
          // 2. If scores are EQUAL, prioritize the younger child (Ascending Age)
          return a.age - b.age;
        });
        
        setKids(sorted);
      }
    } catch (error) {
      console.error("Leaderboard Sync Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
    const liveInterval = setInterval(fetchScores, 1200);
    return () => clearInterval(liveInterval);
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-12 h-12 border-4 border-pink-100 border-t-pink-500 rounded-full animate-spin"></div>
    </div>
  );

  const topThree = [kids[0] || null, kids[1] || null, kids[2] || null];
  const otherPlayers = kids.slice(3);

  return (
    <div className="min-h-screen bg-[#FDFCFD] text-slate-800 font-sans overflow-x-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-100 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-50 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative max-w-7xl mx-auto p-4 md:p-10">
        <header className="flex flex-col items-center mb-10 md:mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-white shadow-sm border border-pink-50 text-pink-500 text-[10px] font-black uppercase tracking-[0.25em]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
            </span>
            Live Competition
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tight leading-none">
            Hall of <span className="text-pink-500">Champions</span>
          </h1>
          <p className="mt-4 text-slate-400 text-xs font-bold uppercase tracking-widest italic">
            Tie-breaker: Younger kids rank higher
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-5 flex flex-col md:flex-row items-center md:items-end justify-center gap-8 md:gap-4 lg:gap-6 min-h-[450px] pb-10">
            <PodiumPillar 
              kid={topThree[1]} 
              rank={2} 
              height="h-[180px]" 
              color="bg-gradient-to-b from-slate-200 to-slate-300 shadow-[0_10px_40px_-15px_rgba(148,163,184,0.5)]" 
              textColor="text-slate-500"
              delay="0.1s"
              order="order-2 md:order-1"
            />
            <PodiumPillar 
              kid={topThree[0]} 
              rank={1} 
              height="h-[240px] md:h-[260px]" 
              color="bg-gradient-to-b from-yellow-300 via-amber-400 to-yellow-500 shadow-[0_20px_50px_-10px_rgba(234,179,8,0.4)]" 
              isWinner
              textColor="text-yellow-700"
              delay="0s"
              order="order-1 md:order-2"
            />
            <PodiumPillar 
              kid={topThree[2]} 
              rank={3} 
              height="h-[140px]" 
              color="bg-gradient-to-b from-orange-200 to-orange-300 shadow-[0_10px_40px_-15px_rgba(194,65,12,0.4)]" 
              textColor="text-orange-600"
              delay="0.2s"
              order="order-3"
            />
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white/80 backdrop-blur-md border border-white rounded-[2.5rem] shadow-2xl shadow-pink-100/50 overflow-hidden">
              <div className="p-6 md:p-8 border-b border-slate-50 flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-black text-slate-800">Rankings</h2>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Real-time Leaderboard</p>
                </div>
                <div className="text-right">
                   <span className="text-3xl font-black text-slate-200">{kids.length}</span>
                </div>
              </div>

              <div className="h-[550px] overflow-y-auto custom-scrollbar p-4 md:p-6 space-y-4">
                {otherPlayers.map((kid, index) => (
                  <div 
                    key={kid._id} 
                    className="animate-slide-up group flex items-center gap-3 md:gap-5 p-3 md:p-4 rounded-[1.5rem] bg-white border border-slate-50 hover:border-pink-200 hover:shadow-lg hover:shadow-pink-50/50 transition-all duration-500"
                  >
                    <div className="w-6 md:w-8 text-lg md:text-xl font-black text-slate-200 group-hover:text-pink-200 transition-colors">
                      {index + 4}
                    </div>
                    
                    <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-2xl overflow-hidden shadow-inner bg-slate-50 flex-shrink-0">
                      <Image src={kid.pictureUrl || "https://api.dicebear.com/7.x/adventurer/svg?seed=fallback"} alt={kid.firstName} fill className="object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-700 text-base md:text-lg leading-none mb-1.5 truncate">
                        {kid.firstName} {kid.lastName} <span className="text-slate-300 font-medium text-sm ml-1">(Age {kid.age})</span>
                      </h3>
                      <p className="text-[9px] md:text-[10px] text-slate-400 font-black uppercase tracking-widest truncate">{kid.sabha}</p>
                    </div>

                    <div className="bg-slate-50 px-3 md:px-4 py-1.5 md:py-2 rounded-2xl group-hover:bg-pink-500 transition-colors duration-500 flex-shrink-0 text-center">
                      <div className="text-lg md:text-xl font-black text-slate-800 group-hover:text-white leading-none">{kid.totalScore}</div>
                      <div className="text-[8px] uppercase font-bold text-slate-400 group-hover:text-pink-100 mt-0.5">Points</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #F1F5F9; border-radius: 10px; }
      `}</style>
    </div>
  );
}

function PodiumPillar({ kid, rank, height, color, isWinner, textColor, delay, order }) {
  if (!kid) return <div className={`hidden md:block w-full ${height} ${order} bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-100`} />;

  return (
    <div 
      className={`animate-float flex flex-col items-center w-full md:w-auto md:min-w-[140px] max-w-[160px] transition-all duration-1000 ${order}`}
      style={{ animationDelay: delay }}
    >
      <div className="flex flex-col items-center mb-6 w-full">
        <div className="relative mb-3">
          {isWinner && <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-4xl drop-shadow-lg z-30 animate-bounce text-yellow-500">👑</div>}
          <div className={`
            relative rounded-[2rem] overflow-hidden bg-white shadow-2xl transition-all duration-500
            ${isWinner ? 'w-28 h-28 md:w-36 md:h-36 border-[6px] border-yellow-400 scale-110' : 'w-20 h-20 md:w-24 md:h-24 border-4 border-white'}
          `}>
            <Image src={kid.pictureUrl || "https://api.dicebear.com/7.x/adventurer/svg?seed=fallback"} alt={kid.firstName} fill className="object-cover" />
          </div>
        </div>
        
        <div className="text-center">
          <h4 className={`font-black text-slate-800 uppercase tracking-tighter ${isWinner ? 'text-lg md:text-xl' : 'text-sm'}`}>
            {kid.firstName}
          </h4>
          <p className="text-[10px] text-slate-400 font-bold mb-1">Age: {kid.age}</p>
          <div className={`inline-block px-4 py-1 rounded-full font-bold shadow-sm ${isWinner ? 'bg-yellow-400 text-yellow-900 text-xs' : 'bg-slate-900 text-white text-[10px]'}`}>
            {kid.totalScore} PTS
          </div>
        </div>
      </div>

      <div className={`
        w-full ${height} ${color} rounded-[2.5rem] flex items-start justify-center pt-8 border-t-2 border-white/50 relative
        ${isWinner ? 'md:scale-105 z-10' : 'opacity-90'}
      `}>
        <span className={`text-6xl md:text-7xl font-black italic tracking-tighter ${textColor} opacity-30`}>
          {rank}
        </span>
      </div>
    </div>
  );
}