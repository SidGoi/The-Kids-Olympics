"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import KidCard from "@/components/ui/KidCard";

const KidsPage = () => {
  const [kids, setKids] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchKids = async () => {
    try {
      const res = await fetch("/api/balak/all");
      const data = await res.json();
      if (data.success) {
        setKids(data.kids);
      }
    } catch (error) {
      console.error("Live update error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKids();

    // High-frequency polling (1.2 seconds)
    const liveInterval = setInterval(fetchKids, 1200);

    return () => clearInterval(liveInterval);
  }, []);

  if (loading) return <div className="flex justify-center mt-20"><Spinner /></div>;

  return (
    <div className="p-4 md:p-8 bg-pink-50 min-h-screen">
      <div className="max-w-7xl mx-auto text-center sm:text-left">
        <h1 className="text-3xl font-black text-pink-600 mb-8 uppercase tracking-widest">
          Live Leaderboard 🎉
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {kids.map((kid) => (
            <KidCard key={kid._id} kid={kid} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default KidsPage;