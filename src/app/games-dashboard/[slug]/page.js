// "use client";
// import React, { useState, useEffect } from "react";
// import { notFound, useParams } from "next/navigation";
// import initialGames from "@/data/Games";
// import GameCard from "@/components/ui/GameCard";
// import { Spinner } from "@/components/ui/spinner";
// // 1. Import icons for search
// import { Search } from "lucide-react";

// export default function GamePage() {
//   const params = useParams();
//   const [kids, setKids] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // 2. Add Search State
//   const [searchTerm, setSearchTerm] = useState("");

//   const gameInfo = initialGames.find((g) => g.slug === params.slug);

//   if (!gameInfo) {
//     notFound();
//     return null;
//   }

//   const fetchKids = async () => {
//     try {
//       const response = await fetch("/api/balak/all", {
//         cache: "no-store",
//       });
//       const data = await response.json();

//       if (data.success) {
//         setKids(data.kids);
//       }
//     } catch (error) {
//       console.error("Fetch Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchKids();
//     const interval = setInterval(fetchKids, 1200);
//     return () => clearInterval(interval);
//   }, []);

//   // 3. Filter Logic
//   // We check First Name, Last Name, or Sabha
//   const filteredKids = kids.filter((kid) => {
//     const fullName = `${kid.firstName} ${kid.lastName}`.toLowerCase();
//     const sabha = (kid.sabha || "").toLowerCase();
//     const search = searchTerm.toLowerCase();

//     return fullName.includes(search) || sabha.includes(search);
//   });

//   if (loading) {
//     return (
//       <div className="flex justify-center mt-20">
//         <Spinner />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-pink-50 p-4 md:p-12 flex flex-col items-center">
//       <h1 className="text-3xl md:text-5xl font-black text-pink-600 mb-6 uppercase tracking-tight text-center">
//         {gameInfo.name}
//       </h1>

//       {/* --- 4. Search Section --- */}
//       <div className="w-full max-w-2xl mb-8 sticky top-4 z-20">
//         <div className="relative group">
//           <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//             <Search className="h-5 w-5 text-pink-300 group-focus-within:text-pink-500 transition-colors" />
//           </div>
//           <input
//             type="text"
//             placeholder="Search by name or sabha..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-11 pr-4 py-3 bg-white border-2 border-pink-100 text-slate-700 rounded-full focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all shadow-sm placeholder:text-pink-200 font-bold"
//           />
//         </div>
//       </div>

//       <div className="w-full max-w-2xl flex flex-col gap-3">
//         {/* 5. Render filtered list OR 'No results' message */}
//         {filteredKids.length > 0 ? (
//           filteredKids.map((kid) => {
//             const currentProgress = kid.games?.find(
//               (g) => g.name === gameInfo.name
//             );

//             return (
//               <GameCard
//                 key={kid._id}
//                 kidId={kid._id}
//                 gameName={gameInfo.name}
//                 userName={`${kid.firstName} ${kid.lastName}`}
//                 sabhaName={kid.sabha}
//                 userImage={kid.pictureUrl}
//                 isPlayedInitially={currentProgress?.played || false}
//                 // FIXED LOGIC: Pass score even if not played so Replay badge works
//                 initialStars={
//                   currentProgress
//                     ? !currentProgress?.played
//                       ? 0
//                       : currentProgress.score / 1000
//                     : 0
//                 }
//               />
//             );
//           })
//         ) : (
//           <div className="text-center py-10 text-pink-300 font-bold">
//             No players found matching &quot;{searchTerm}&quot;
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";
import React, { useState, useEffect } from "react";
import { notFound, useParams } from "next/navigation";
import initialGames from "@/data/Games";
import GameCard from "@/components/ui/GameCard";
import { Spinner } from "@/components/ui/spinner";
// 1. Import Search and X icons
import { Search, X } from "lucide-react";

export default function GamePage() {
  const params = useParams();
  const [kids, setKids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const gameInfo = initialGames.find((g) => g.slug === params.slug);

  if (!gameInfo) {
    notFound();
    return null;
  }

  const fetchKids = async () => {
    try {
      const response = await fetch("/api/balak/all", {
        cache: "no-store",
      });
      const data = await response.json();

      if (data.success) {
        setKids(data.kids);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKids();
    const interval = setInterval(fetchKids, 1200);
    return () => clearInterval(interval);
  }, []);

  const filteredKids = kids.filter((kid) => {
    const fullName = `${kid.firstName} ${kid.lastName}`.toLowerCase();
    const sabha = (kid.sabha || "").toLowerCase();
    const search = searchTerm.toLowerCase();

    return fullName.includes(search) || sabha.includes(search);
  });

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen font-primary bg-[#FCF9EA] p-4 md:p-12 flex flex-col">
      <h1 className="text-3xl md:text-5xl font-black mb-6 uppercase tracking-tight">
        {gameInfo.name}
      </h1>

      {/* --- Search Section --- */}
      <div className="w-full max-w-2xl mb-8 sticky top-4 z-20">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-pink-300 group-focus-within:text-pink-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search by name or sabha..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-12 py-3 bg-white border-2 border-pink-100 text-slate-700 rounded-full focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all shadow-sm placeholder:text-pink-200 font-bold"
          />
          {/* --- Clear Button ("X") --- */}
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-pink-300 hover:text-pink-600 transition-colors"
              aria-label="Clear search"
            >
              <X className="h-5 w-5 border-2 border-pink-100 rounded-full p-0.5 bg-pink-50" />
            </button>
          )}
        </div>
      </div>

      <div className="w-full max-w-2xl flex flex-col gap-3">
        {filteredKids.length > 0 ? (
          filteredKids.map((kid) => {
            const currentProgress = kid.games?.find(
              (g) => g.name === gameInfo.name
            );

            return (
              <GameCard
                key={kid._id}
                kidId={kid._id}
                gameName={gameInfo.name}
                userName={`${kid.firstName} ${kid.lastName}`}
                sabhaName={kid.sabha}
                userImage={kid.pictureUrl}
                isPlayedInitially={currentProgress?.played || false}
                initialStars={
                  currentProgress
                    ? !currentProgress?.played
                      ? 0
                      : currentProgress.score / 1000
                    : 0
                }
              />
            );
          })
        ) : (
          <div className="text-center py-10 text-pink-300 font-bold">
            No players found matching &quot;{searchTerm}&quot;
          </div>
        )}
      </div>
    </div>
  );
}