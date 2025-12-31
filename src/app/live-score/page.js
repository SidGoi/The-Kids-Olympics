"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
// 1. Import Framer Motion
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";

// --- Helper Component for Smooth Numbers ---
function AnimatedCounter({ value }) {
  const spring = useSpring(value, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) => Math.round(current));

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span>{display}</motion.span>;
}

export default function LeaderboardPage() {
  const [kids, setKids] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchScores = async () => {
    try {
      const res = await fetch("/api/balak/all");
      const json = await res.json();
      if (json.success) {
        const sorted = [...json.kids].sort((a, b) => {
          if (b.totalScore !== a.totalScore) {
            return b.totalScore - a.totalScore;
          }
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

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFCFD]">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );

  const topThree = [kids[0] || null, kids[1] || null, kids[2] || null];
  const otherPlayers = kids.slice(3);

  return (
    <div className="font-primary h-screen text-slate-800 font-sans p-4 md:p-8">
      <Image
        src={"/fairbg.jpg"}
        alt="bgImage"
        height={500}
        width={500}
        className="h-screen w-screen object-cover fixed top-0 left-0 -z-10"
      />

      <div className="max-w-5xl mx-auto border-2 border-slate-200 bg-white rounded-3xl shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

        {/* --- Header --- */}
        <div className="relative z-10 flex justify-between items-center p-6 md:p-8 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 md:w-16 md:h-16 relative bg-slate-100 rounded-full border-2 border-slate-200 overflow-hidden">
               {/* Placeholder Logo */}
              <div className="w-full h-full bg-slate-200"></div> 
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-slate-800 leading-none">
                The Kids
              </h1>
              <span className="text-sm md:text-base font-bold text-slate-400 tracking-wide">
                Olympus
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="block text-3xl md:text-5xl font-black text-slate-800 leading-none">
              <AnimatedCounter value={kids.length} />
            </span>
            <span className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest">
              Total Players
            </span>
          </div>
        </div>

        <div className="relative z-10 px-4 md:px-10 pb-10">
          {/* --- Top 3 Podium --- */}
          <div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-8 mb-12 min-h-[220px]">
            {/* Note: Podium animations are tricky because position logic is different per rank. 
               We simply animate the Score counter here.
            */}
            <PodiumCard
              kid={topThree[1]}
              rank={2}
              badgeSrc="/Rank2.svg"
              scale="scale-90"
              color="border-slate-300"
            />
            <PodiumCard
              kid={topThree[0]}
              rank={1}
              badgeSrc="/Rank1.svg"
              scale="scale-110 -translate-y-4"
              color="border-yellow-400"
              isWinner={true}
            />
            <PodiumCard
              kid={topThree[2]}
              rank={3}
              badgeSrc="/Rank3.svg"
              scale="scale-90"
              color="border-orange-200"
            />
          </div>

          {/* --- List View (The Rest) --- */}
          <div className="space-y-3">
            <div className="grid grid-cols-12 gap-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
              <div className="col-span-2 md:col-span-1">Rank</div>
              <div className="col-span-7 md:col-span-8">Player</div>
              <div className="col-span-3 text-right">Score</div>
            </div>

            <div className="h-[400px] overflow-y-auto custom-scrollbar space-y-3 pr-2">
              {/* 2. AnimatePresence handles items entering/leaving */}
              <AnimatePresence mode="popLayout">
                {otherPlayers.map((kid, index) => (
                  // 3. motion.div replaces div
                  <motion.div
                    // IMPORTANT: layout prop creates the smooth swap animation
                    layout 
                    key={kid._id} // Must be unique ID, not index!
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className="grid grid-cols-12 gap-4 items-center p-3 md:p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-pink-300 hover:bg-white hover:shadow-md"
                  >
                    <div className="col-span-2 md:col-span-1 text-lg font-black text-slate-300 pl-2">
                      {index + 4}
                    </div>

                    <div className="col-span-7 md:col-span-8 flex items-center gap-3 md:gap-4">
                      <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden bg-white border-2 border-white shadow-sm flex-shrink-0">
                        <Image
                          src={
                            kid.pictureUrl ||
                            "https://api.dicebear.com/7.x/adventurer/svg?seed=fallback"
                          }
                          alt={kid.firstName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-700 text-sm md:text-base truncate">
                          {kid.firstName} {kid.lastName}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase truncate">
                          Age: {kid.age} • {kid.sabha || "Sabha"}
                        </p>
                      </div>
                    </div>

                    <div className="col-span-3 text-right pr-2">
                      <span className="inline-block bg-white border border-slate-200 px-3 py-1 rounded-full text-sm font-black text-slate-800 shadow-sm">
                        {/* 4. Use AnimatedCounter instead of raw number */}
                        <AnimatedCounter value={kid.totalScore} />
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      {/* ... styles ... */}
    </div>
  );
}

// --- Updated Podium Card to use AnimatedCounter ---
function PodiumCard({ kid, rank, badgeSrc, scale, color, isWinner }) {
  if (!kid)
    return (
      <div className={`w-full md:w-1/3 h-48 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200`}></div>
    );

  return (
    <div className={`relative w-full md:w-1/3 bg-white rounded-3xl border-[3px] p-4 flex flex-col items-center transition-transform duration-500 ${color} ${scale} shadow-xl`}>
      {/* Badge Image */}
      <div className="absolute -top-6 -right-4 w-16 h-16 md:w-20 md:h-20 z-20 drop-shadow-lg">
        <div className="relative w-full h-full">
           {/* Replace with your Image when ready */}
           <Image
            height={300}
            width={300}
            src={badgeSrc}
            alt="Badge"
            className="w-45 h-auto"
          />
        </div>
      </div>

      {/* Profile Image */}
      <div className="relative mb-3 mt-2">
        <div className={`relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-slate-100`}>
          <Image
            src={kid.pictureUrl || "https://api.dicebear.com/7.x/adventurer/svg?seed=fallback"}
            alt={kid.firstName}
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="text-center w-full">
        <h3 className="font-black text-slate-800 text-lg md:text-xl truncate px-2">
          {kid.firstName}
        </h3>
        <p className="text-xs font-bold text-slate-400 mb-3">Age: {kid.age}</p>

        <div className={`mx-auto w-full py-2 rounded-xl font-black text-lg ${isWinner ? "bg-yellow-50 text-yellow-700" : "bg-slate-50 text-slate-600"}`}>
          {/* Animated Score Here Too */}
          <AnimatedCounter value={kid.totalScore} />{" "}
          <span className="text-[10px] uppercase opacity-60">PTS</span>
        </div>
      </div>
    </div>
  );
}