"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import toast, { Toaster } from "react-hot-toast"; // ✅ 1. Import Toast
import {
  motion,
  AnimatePresence,
  useSpring,
  useTransform,
} from "framer-motion";

// --- Helper: Smooth Number Animation ---
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
  const [poppingIds, setPoppingIds] = useState([]);

  const lastLeaderId = useRef(null);
  const prevScores = useRef({});
  const coinAudioRef = useRef(null);

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  useEffect(() => {
    coinAudioRef.current = new Audio("/coin.aac");
    coinAudioRef.current.preload = "auto";
    coinAudioRef.current.volume = 0.6;
  }, []);

  const playCoinSound = () => {
    if (coinAudioRef.current) {
      const soundClone = coinAudioRef.current.cloneNode();
      soundClone.volume = 0.6;
      soundClone.play().catch(() => {});
    }
  };

  const playSuccessSound = () => {
    const audio = new Audio("/success.mp3");
    audio.volume = 0.6;
    audio.play().catch((err) => console.log("Audio autoplay blocked:", err));
  };

  const speakAnnouncement = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 1.1;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const fetchScores = async () => {
    try {
      const res = await fetch("/api/balak/all");
      const json = await res.json();

      if (json.success) {
        const newKidsData = json.kids;
        let globalScoreIncreased = false;
        const currentPoppers = [];

        newKidsData.forEach((kid) => {
          const oldScore = prevScores.current[kid._id];

          // ✅ 2. Toast Logic Check
          // We check if oldScore is NOT undefined (to skip initial load toasts)
          if (oldScore !== undefined && kid.totalScore > oldScore) {
            globalScoreIncreased = true;
            currentPoppers.push(kid._id);
            
            // Calculate the specific gain (e.g., +50)
            const diff = kid.totalScore - oldScore;

            // ✅ 3. Trigger the Custom Toast
            toast.custom((t) => (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className={`${
                  t.visible ? 'animate-enter' : 'animate-leave'
                } max-w-md w-full bg-white shadow-lg rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
              >
                <div className="flex-1 w-0 p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      {/* Using the Kid's actual image in the toast */}
                      <img
                        className="h-10 w-10 rounded-full object-cover border border-slate-200"
                        src={kid.pictureUrl || "https://api.dicebear.com/7.x/adventurer/svg?seed=fallback"}
                        alt=""
                      />
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-black text-slate-800">
                        {kid.firstName}
                      </p>
                      <p className="mt-1 text-sm text-slate-500 font-medium">
                        Got <span className="text-yellow-600 font-bold">+{diff} Stars!</span> ⭐  
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ), { duration: 2000 });
          }

          // Update Ref
          prevScores.current[kid._id] = kid.totalScore;
        });

        if (currentPoppers.length > 0) {
           setPoppingIds(prev => [...prev, ...currentPoppers]);
           setTimeout(() => { setPoppingIds([]); }, 600);
        }

        if (Object.keys(prevScores.current).length > 0 && globalScoreIncreased) {
          playCoinSound();
        }

        const sortedKids = [...newKidsData].sort((a, b) => {
          if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
          return a.age - b.age;
        });

        setKids(sortedKids);
      }
    } catch (error) {
      console.error("Leaderboard Sync Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (kids.length > 0) {
      const currentLeader = kids[0];
      if (lastLeaderId.current === null) {
        lastLeaderId.current = currentLeader._id;
        return;
      }
      if (lastLeaderId.current !== currentLeader._id) {
        speakAnnouncement(`${currentLeader.firstName} is Leading the Game!`);
        lastLeaderId.current = currentLeader._id;
        playSuccessSound();
        triggerConfetti();
      }
    }
  }, [kids]);

  useEffect(() => {
    fetchScores();
    const liveInterval = setInterval(fetchScores, 1200);
    return () => clearInterval(liveInterval);
  }, []);

  const cardVariants = {
    idle: { scale: 1, backgroundColor: "rgba(255, 255, 255, 1)", borderColor: "rgba(241, 245, 249, 1)" },
    pop: { 
        scale: [1, 1.05, 1], 
        backgroundColor: ["rgba(255, 255, 255, 1)", "rgba(254, 249, 195, 1)", "rgba(255, 255, 255, 1)"], 
        borderColor: ["rgba(241, 245, 249, 1)", "rgba(250, 204, 21, 1)", "rgba(241, 245, 249, 1)"], 
        transition: { duration: 0.5, ease: "easeInOut" }
    }
  };

  const getRankStyles = (index) => {
    switch (index) {
      case 0: return { rankColor: "text-yellow-600", badge: "/Rank1.svg" };
      case 1: return { rankColor: "text-slate-600", badge: "/Rank2.svg" };
      case 2: return { rankColor: "text-orange-600", badge: "/Rank3.svg" };
      default: return { rankColor: "text-slate-300", badge: null };
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#FDFCFD]"><div className="w-12 h-12 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div></div>;

  return (
    <div className="font-primary h-screen cursor-pointer text-slate-800 font-sans p-4 md:p-8" onClick={() => { if (window.speechSynthesis.paused) window.speechSynthesis.resume(); const silent = new Audio(); silent.play().catch(() => {}); }}>
      {/* ✅ 4. Add the Toaster Component here */}
      <Toaster position="top-right" reverseOrder={false} gutter={8} />

      <Image src={"/fairbg.jpg"} alt="bgImage" fill className="h-screen w-screen object-cover fixed top-0 left-0 -z-10" />

      <div className="max-w-4xl mx-auto border-2 border-slate-200 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden relative flex flex-col h-[90vh]">
        {/* ... (Existing UI Code remains exactly the same below here) ... */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

        <div className="relative z-10 flex justify-between items-center p-6 border-b border-slate-100 bg-white/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 md:w-16 md:h-16 relative bg-slate-100 rounded-full border-2 border-slate-200 overflow-hidden"></div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-slate-800 leading-none">The Kids</h1>
              <span className="text-sm md:text-base font-bold text-slate-400 tracking-wide">Olympus</span>
            </div>
          </div>
          <div className="text-right">
            <span className="block text-3xl md:text-5xl font-black text-slate-800 leading-none"><AnimatedCounter value={kids.length} /></span>
            <span className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest">Total Players</span>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col relative z-10">
          <div className="grid grid-cols-12 gap-4 px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 border-b border-slate-100 shrink-0">
            <div className="col-span-2 md:col-span-1">Rank</div>
            <div className="col-span-7 md:col-span-8">Player</div>
            <div className="col-span-3 text-right">Score</div>
          </div>

          <div className="overflow-y-auto custom-scrollbar p-4 space-y-3 flex-1">
            <AnimatePresence mode="popLayout">
              {kids.map((kid, index) => {
                const styles = getRankStyles(index);
                const isPopping = poppingIds.includes(kid._id);

                return (
                  <motion.div layout key={kid._id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ type: "spring", stiffness: 350, damping: 25 }} className="relative">
                    <motion.div variants={cardVariants} animate={isPopping ? "pop" : "idle"} className={`grid grid-cols-12 gap-4 items-center p-3 md:p-4 rounded-2xl border shadow-sm`} style={{ backgroundColor: "white" }}>
                        <div className={`col-span-2 md:col-span-1 text-xl font-black pl-2 flex items-center ${styles.rankColor}`}>{index + 1}</div>
                        <div className="col-span-7 md:col-span-8 flex items-center gap-3 md:gap-4 relative">
                            <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden bg-white border-2 border-white/50 shadow-sm flex-shrink-0 z-10">
                                <Image src={kid.pictureUrl || "https://api.dicebear.com/7.x/adventurer/svg?seed=fallback"} alt={kid.firstName} fill className="object-cover" />
                            </div>
                            <div className="min-w-0 z-10">
                                <h3 className="font-bold text-slate-800 text-sm md:text-base truncate">{kid.firstName} {kid.lastName}</h3>
                                <p className="text-[10px] text-slate-500 font-bold uppercase truncate opacity-80">Age: {kid.age} • {kid.sabha || "Sabha"}</p>
                            </div>
                            {styles.badge && (
                                <div className="absolute left-[-10px] md:left-[-15px] top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 opacity-100 pointer-events-none z-20 -ml-12">
                                <Image src={styles.badge} width={40} height={40} alt="Rank Badge" className="drop-shadow-sm" />
                                </div>
                            )}
                        </div>
                        <div className="col-span-3 text-right pr-2">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-black shadow-sm border bg-white/80 border-slate-200 text-slate-800`}>
                                <AnimatedCounter value={kid.totalScore} />
                                <span className="ml-1 text-yellow-500">⭐</span>
                            </span>
                        </div>
                    </motion.div>
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