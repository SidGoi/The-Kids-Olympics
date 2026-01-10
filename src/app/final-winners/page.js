"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { Medal, Star, ArrowLeft, Crown, Sparkles } from "lucide-react";
import Link from "next/link";

export default function FinalWinnersPage() {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revealStep, setRevealStep] = useState(0);

  useEffect(() => {
    const fetchFinalScores = async () => {
      try {
        const res = await fetch("/api/balak/all");
        const json = await res.json();
        if (json.success) {
          const sorted = [...json.kids].sort((a, b) => b.totalScore - a.totalScore);
          const top3 = sorted.slice(0, 3);
          const podiumOrder = [top3[1], top3[0], top3[2]]; // 2nd, 1st, 3rd
          setWinners(podiumOrder);
        }
      } catch (error) {
        console.error("Error fetching winners:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFinalScores();
  }, []);

  const fireConfetti = (xPos, colors, count = 80) => {
    confetti({
      particleCount: count,
      spread: 80,
      origin: { x: xPos, y: 0.6 },
      colors: colors,
      gravity: 1.2,
      scalar: 1.2,
      zIndex: 1000
    });
  };

  const handleScreenClick = () => {
    if (revealStep < 3) {
      const nextStep = revealStep + 1;
      setRevealStep(nextStep);
      
      // Target confetti origins based on podium layout [2nd, 1st, 3rd]
      if (nextStep === 1) fireConfetti(0.85, ["#fb923c", "#ffffff"]); // 3rd Place (Right)
      if (nextStep === 2) fireConfetti(0.15, ["#cbd5e1", "#ffffff"]); // 2nd Place (Left)
      if (nextStep === 3) {
        fireConfetti(0.5, ["#facc15", "#ec4899"], 150); // 1st Place (Center)
        setTimeout(triggerCelebrationConfetti, 600);
      }
    }
  };

  const triggerCelebrationConfetti = () => {
    const end = Date.now() + 4 * 1000;
    const colors = ["#ec4899", "#facc15", "#3b82f6"];
    (function frame() {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0, y: 0.6 }, colors });
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1, y: 0.6 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#FDFCFD]">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-pink-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div 
      className="h-screen w-screen bg-[#FCF9EA] relative overflow-hidden font-sans text-slate-800 flex flex-col cursor-pointer"
      onClick={handleScreenClick}
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-100/60 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100/60 rounded-full blur-3xl -z-10" />
      
      <div className="relative z-20 flex flex-col h-full max-w-7xl mx-auto w-full px-6 py-6">
        <header className="relative flex flex-col items-center justify-center shrink-0 mb-20 text-center w-full">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2 text-pink-500 text-[10px] font-black uppercase tracking-[0.4em] mb-2">
            <Sparkles size={14} /> Ramatotsav 2026
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-slate-900 leading-none">
            Final Champions
          </h1>
          {revealStep === 0 && (
            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-pink-400 font-bold text-xs uppercase tracking-[0.2em] mt-4"
            >
              Click anywhere to begin reveal...
            </motion.p>
          )}
        </header>

        <div className="flex-1 flex items-center justify-center min-h-0">
          <div className="flex items-end justify-center gap-3 md:gap-8 w-full max-h-[82vh] py-4">
            <AnimatePresence>
              {winners.map((kid, idx) => {
                const isFirst = kid.totalScore === Math.max(...winners.map(w => w.totalScore));
                const isThird = kid.totalScore === Math.min(...winners.map(w => w.totalScore));
                const isSecond = !isFirst && !isThird;

                let shouldShow = false;
                if (isThird && revealStep >= 1) shouldShow = true;
                if (isSecond && revealStep >= 2) shouldShow = true;
                if (isFirst && revealStep >= 3) shouldShow = true;

                if (!shouldShow) return null;

                let config = isFirst 
                  ? { h: "h-[100%]", color: "from-yellow-400 to-yellow-600", label: "Champion", icon: <Crown size={44} className="text-yellow-900" />, rank: "01" }
                  : isSecond 
                  ? { h: "h-[85%]", color: "from-slate-300 to-slate-400", label: "Runner Up", icon: <Medal size={36} className="text-slate-700" />, rank: "02" }
                  : { h: "h-[75%]", color: "from-orange-400 to-orange-500", label: "3rd Place", icon: <Medal size={30} className="text-orange-900" />, rank: "03" };

                return (
                  <motion.div
                    key={kid._id}
                    initial={{ opacity: 0, y: 400, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", damping: 20, stiffness: 100 }}
                    className={`relative flex flex-col items-center justify-end min-w-0 flex-1 ${config.h}`}
                  >
                    <div className={`relative z-30 shrink-0 mb-4 aspect-square shadow-2xl rounded-full ${isFirst ? 'w-[85%] max-w-[210px]' : 'w-[75%] max-w-[155px]'}`}>
                      <div className={`w-full h-full rounded-full bg-gradient-to-tr ${config.color} p-1.5`}>
                        <div className="relative w-full h-full rounded-full overflow-hidden border-[3px] border-white bg-white">
                          <Image src={kid.pictureUrl} fill className="object-cover" alt="winner" priority />
                        </div>
                      </div>
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 bg-slate-900 text-white w-10 h-10 md:w-14 md:h-14 rounded-full flex flex-col items-center justify-center border-4 border-[#FCF9EA] shadow-xl z-40">
                        <span className="text-sm md:text-xl font-black leading-none">{config.rank}</span>
                      </motion.div>
                    </div>

                    <div className="text-center mb-4 z-30 w-full shrink-0 px-2">
                      <p className="text-pink-600 font-black text-[9px] md:text-[11px] uppercase tracking-widest mb-1">{config.label}</p>
                      <h3 className={`font-black uppercase tracking-tight text-slate-900 leading-none ${isFirst ? 'text-lg md:text-3xl' : 'text-xs md:text-xl'}`}>
                        {kid.firstName} {kid.lastName}
                      </h3>
                      <p className="text-[8px] md:text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{kid.sabha}</p>
                    </div>

                    <div className={`w-full flex-[0.7] max-h-[300px] bg-gradient-to-b ${config.color} rounded-t-[2.5rem] shadow-xl flex flex-col items-center justify-start pt-8 relative overflow-hidden border-t-4 border-white/50`}>
                       <div className="relative z-10 flex flex-col items-center">
                          <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3 }}>{config.icon}</motion.div>
                          <div className="mt-4 text-center">
                            <span className={`block font-black text-white leading-none ${isFirst ? 'text-4xl md:text-7xl' : 'text-2xl md:text-4xl'}`}>
                              {kid.totalScore}
                            </span>
                          </div>
                       </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}