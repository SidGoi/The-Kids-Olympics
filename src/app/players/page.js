"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import KidCard from "@/components/ui/KidCard";

const KidsPage = () => {
  const [kids, setKids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKids = async () => {
      const res = await fetch("/api/balak/all");
      const data = await res.json();

      if (data.success) {
        setKids(data.kids);
      }
      setLoading(false);
    };

    fetchKids();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">All Kids 🎉</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {kids.map((kid) => (
          <KidCard key={kid._id} kid={kid} />
        ))}
      </div>
    </div>
  );
};

export default KidsPage;
