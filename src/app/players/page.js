
"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import KidCard from "@/components/ui/KidCard";

const KidsPage = () => {
  const [kids, setKids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We define the fetch function inside useEffect so it can be reused
    const fetchKids = async () => {
      try {
        const res = await fetch("/api/balak/all");
        const data = await res.json();

        if (data.success) {
          // Update the state with fresh data from Atlas
          setKids(data.kids);
        }
      } catch (error) {
        console.error("Live update error:", error);
      } finally {
        setLoading(false);
      }
    };

    // 1. Initial fetch on page load
    fetchKids();

    // 2. Set up polling: Fetch again every 3000ms (3 seconds)
    // This is what makes it "Live" without a manual reload
    const liveInterval = setInterval(fetchKids, 3000);

    // 3. Cleanup: Stop fetching when the user leaves the page
    return () => clearInterval(liveInterval);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-6 bg-pink-50 min-h-screen">
      <h1 className="text-3xl font-black text-pink-600 mb-6 uppercase tracking-widest text-center sm:text-left">
        Live Leaderboard 🎉
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {kids.map((kid) => (
          <KidCard key={kid._id} kid={kid} />
        ))}
      </div>
    </div>
  );
};

export default KidsPage;