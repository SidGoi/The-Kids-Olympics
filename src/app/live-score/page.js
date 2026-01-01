"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
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

  // 1. Ref to store the ID of the previous leader
  const lastLeaderId = useRef(null);

  // 2. Ref to store previous SCORES (id -> score) to detect increments
  const prevScores = useRef({});

  // 3. Audio Ref for Preloading
  const coinAudioRef = useRef(null);

  // --- Initialize Audio on Mount (Prevents Delay) ---
  useEffect(() => {
    // Preload the audio object once
    coinAudioRef.current = new Audio("/coin.aac");
    coinAudioRef.current.preload = "auto";
    coinAudioRef.current.volume = 0.6;
  }, []);

  // --- Audio Helper: Instant Playback ---
  const playCoinSound = () => {
    if (coinAudioRef.current) {
      // cloneNode() allows overlapping sounds (fire-and-forget)
      // This removes the delay if the sound is already playing
      const soundClone = coinAudioRef.current.cloneNode(); 
      soundClone.volume = 0.6;
      soundClone.play().catch((err) => {
        // Ignore autoplay errors (user hasn't interacted yet)
      });
    }
  };

  const playSuccessSound = () => {
    const audio = new Audio("/success.mp3");
    audio.volume = 0.6; 
    audio.play().catch((err) => console.log("Audio autoplay blocked:", err));
  };

  // --- TTS Helper ---
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
        
        // --- 1. Check for ANY Score Increment ---
        let scoreIncreased = false;
        
        newKidsData.forEach((kid) => {
          const oldScore = prevScores.current[kid._id];

          // If oldScore exists AND new score is higher
          if (oldScore !== undefined && kid.totalScore > oldScore) {
            scoreIncreased = true;
          }
          
          // Update the ref immediately for the next loop
          prevScores.current[kid._id] = kid.totalScore;
        });

        // If score increased (and it's not the very first load), Play Sound
        if (Object.keys(prevScores.current).length > 0 && scoreIncreased) {
          playCoinSound();
        }

        // --- 2. Sort Data ---
        const sortedKids = [...newKidsData].sort((a, b) => {
          if (b.totalScore !== a.totalScore) {
            return b.totalScore - a.totalScore;
          }
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

  // --- Effect to monitor Leader changes ---
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
      }
    }
  }, [kids]);

  useEffect(() => {
    fetchScores();
    const liveInterval = setInterval(fetchScores, 1200);
    return () => clearInterval(liveInterval);
  }, []);

  const getRankStyles = (index) => {
    switch (index) {
      case 0: // Gold
        return {
          card: "bg-yellow-50 border-yellow-400 hover:bg-yellow-100 hover:border-yellow-500",
          rankColor: "text-yellow-600",
          badge: "/Rank1.svg",
        };
      case 1: // Silver
        return {
          card: "bg-slate-100 border-slate-400 hover:bg-slate-200 hover:border-slate-500",
          rankColor: "text-slate-600",
          badge: "/Rank2.svg",
        };
      case 2: // Bronze
        return {
          card: "bg-orange-50 border-orange-300 hover:bg-orange-100 hover:border-orange-400",
          rankColor: "text-orange-600",
          badge: "/Rank3.svg",
        };
      default: // Others
        return {
          card: "bg-white border-slate-100 hover:border-pink-300 hover:bg-white hover:shadow-md",
          rankColor: "text-slate-300",
          badge: null,
        };
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFCFD]">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div
      className="font-primary h-screen cursor-pointer text-slate-800 font-sans p-4 md:p-8"
      // Click handler unlocks Audio Context for browsers
      onClick={() => {
        if (window.speechSynthesis.paused) window.speechSynthesis.resume();
        // create a silent audio to unlock audio engine if needed
        const silent = new Audio();
        silent.play().catch(() => {});
      }}
    >
      {/* Background */}
      <Image
        src={"/fairbg.jpg"}
        alt="bgImage"
        height={500}
        width={500}
        className="h-screen w-screen object-cover fixed top-0 left-0 -z-10"
      />

      <div className="max-w-4xl mx-auto border-2 border-slate-200 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden relative flex flex-col h-[90vh]">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

        {/* --- Header --- */}
        <div className="relative z-10 flex justify-between items-center p-6 border-b border-slate-100 bg-white/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 md:w-16 md:h-16 relative bg-slate-100 rounded-full border-2 border-slate-200 overflow-hidden">
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

        {/* --- Unified List View --- */}
        <div className="flex-1 overflow-hidden flex flex-col relative z-10">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 border-b border-slate-100 shrink-0">
            <div className="col-span-2 md:col-span-1">Rank</div>
            <div className="col-span-7 md:col-span-8">Player</div>
            <div className="col-span-3 text-right">Score</div>
          </div>

          {/* Scrollable List */}
          <div className="overflow-y-auto custom-scrollbar p-4 space-y-3 flex-1">
            <AnimatePresence mode="popLayout">
              {kids.map((kid, index) => {
                const styles = getRankStyles(index);

                return (
                  <motion.div
                    layout
                    key={kid._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className={`grid grid-cols-12 gap-4 items-center p-3 md:p-4 rounded-2xl border shadow-sm transition-colors ${styles.card}`}
                  >
                    {/* 1. Rank Column */}
                    <div
                      className={`col-span-2 md:col-span-1 text-xl font-black pl-2 flex items-center ${styles.rankColor}`}
                    >
                      {index + 1}
                    </div>

                    {/* 2. Player Info Column */}
                    <div className="col-span-7 md:col-span-8 flex items-center gap-3 md:gap-4 relative">
                      {/* Avatar */}
                      <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden bg-white border-2 border-white/50 shadow-sm flex-shrink-0 z-10">
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

                      {/* Name & Details */}
                      <div className="min-w-0 z-10">
                        <h3 className="font-bold text-slate-800 text-sm md:text-base truncate">
                          {kid.firstName} {kid.lastName}
                        </h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase truncate opacity-80">
                          Age: {kid.age} • {kid.sabha || "Sabha"}
                        </p>
                      </div>

                      {/* Rank Badge */}
                      {styles.badge && (
                        <div className="absolute left-[-10px] md:left-[-15px] top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 opacity-100 pointer-events-none z-20 -ml-12">
                          <Image
                            src={styles.badge}
                            width={40}
                            height={40}
                            alt="Rank Badge"
                            className="drop-shadow-sm"
                          />
                        </div>
                      )}
                    </div>

                    {/* 3. Score Column */}
                    <div className="col-span-3 text-right pr-2">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-black shadow-sm border bg-white/80 border-slate-200 text-slate-800`}
                      >
                        <AnimatedCounter value={kid.totalScore} />
                        <span className="ml-1 text-yellow-500">⭐</span>
                      </span>
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
