"use client";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import KidCard from "@/components/ui/KidCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const KidsPage = () => {
  const [kids, setKids] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchKids = async () => {
    try {
      const res = await fetch("/api/balak/all");
      const data = await res.json();
      if (data.success) {
        // ✅ Sort kids by totalScore in descending order (top to down)
        const sortedKids = data.kids.sort((a, b) => b.totalScore - a.totalScore);
        setKids(sortedKids);
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
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <h1 className="text-3xl font-black text-pink-600 uppercase tracking-widest">
            Live Leaderboard 🎉
          </h1>
          <Link href={"/"}>
            <Button className={"flex items-center justify-center gap-1"}>
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
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {kids.map((kid) => (
            <KidCard key={kid._id} kid={kid} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default KidsPage;