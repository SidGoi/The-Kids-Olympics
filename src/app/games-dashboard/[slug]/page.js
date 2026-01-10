// "use client";
// import React, { useState, useEffect } from "react";
// import { notFound, useParams } from "next/navigation";
// import initialGames from "@/data/Games";
// import GameCard from "@/components/ui/GameCard";
// import { Spinner } from "@/components/ui/spinner";
// import { Search, X } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";

// export default function GamePage() {
//   const params = useParams();
//   const [kids, setKids] = useState([]);
//   const [loading, setLoading] = useState(true);
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
//     // Live update every 1.2 seconds
//     const interval = setInterval(fetchKids, 1200);
//     return () => clearInterval(interval);
//   }, []);

//   // --- Calculate Live Played Count ---
//   const playedCount = kids.reduce((count, kid) => {
//     const gameData = kid.games?.find((g) => g.name === gameInfo.name);
//     return gameData?.played ? count + 1 : count;
//   }, 0);

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
//     <div className="min-h-screen font-primary bg-[#FCF9EA] px-6 py-10 md:p-12 flex flex-col">
//       <Link href={"/games-dashboard"}>
//         <Button className={"flex items-center justify-center gap-1 mb-6"}>
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             height="24px"
//             viewBox="0 -960 960 960"
//             width="24px"
//             fill="#FFFFFF"
//           >
//             <path d="m314-440 114 114q12 12 11.5 28T428-270q-12 12-28.5 12.5T371-269L188-452q-12-12-12-28t12-28l183-183q12-12 28.5-11.5T428-690q11 12 11.5 28T428-634L314-520h446q17 0 28.5 11.5T800-480q0 17-11.5 28.5T760-440H314Z" />
//           </svg>{" "}
//           Back to Games
//         </Button>
//       </Link>
      
//       {/* Title */}
//       <h1 className="text-4xl md:text-5xl font-black mb-2 uppercase tracking-tight text-primary">
//         {gameInfo.name}
//       </h1>

//       {/* --- LIVE COUNT LINE --- */}
//       <p className="text-lg md:text-xl font-bold text-slate-600 mb-6">
//         {playedCount} Kids Played {gameInfo.name} till now!
//       </p>

//       {/* --- Search Section --- */}
//       <div className="w-full max-w-2xl mb-6 sticky top-4 z-20">
//         <div className="relative group">
//           <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//             <Search className="h-5 w-5 text-pink-300 group-focus-within:text-pink-500 transition-colors" />
//           </div>
//           <input
//             type="text"
//             placeholder="Search by name or sabha..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-11 pr-12 py-3 bg-white border-2 border-pink-100 text-slate-700 rounded-full focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all shadow-sm placeholder:text-pink-200 font-bold"
//           />
//           {searchTerm && (
//             <button
//               onClick={() => setSearchTerm("")}
//               className="absolute inset-y-0 right-0 pr-4 flex items-center text-pink-300 hover:text-pink-600 transition-colors"
//               aria-label="Clear search"
//             >
//               <X className="h-5 w-5 border-2 border-pink-100 rounded-full p-0.5 bg-pink-50" />
//             </button>
//           )}
//         </div>
//       </div>

//       <div className="w-full max-w-2xl flex flex-col gap-3">
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
import { notFound, useParams, useRouter } from "next/navigation";
import initialGames from "@/data/Games";
import GameCard from "@/components/ui/GameCard";
import { Spinner } from "@/components/ui/spinner";
import { Search, X, Lock } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function GamePage() {
  const params = useParams();
  const router = useRouter();
  const [kids, setKids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [authorized, setAuthorized] = useState(false);

  // Find game info by slug from your data/Games.js
  const gameInfo = initialGames.find((g) => g.slug === params.slug);

  useEffect(() => {
    if (!gameInfo) return;

    // ✅ AUTHORIZATION CHECK: Ensure user entered the password in the dashboard
    const savedPass = sessionStorage.getItem(`auth_${params.slug}`);
    if (savedPass === gameInfo.password) {
      setAuthorized(true);
      fetchKids();
      // Live update every 1.5 seconds
      const interval = setInterval(fetchKids, 1500);
      return () => clearInterval(interval);
    } else {
      setLoading(false); 
    }
  }, [params.slug, gameInfo]);

  const fetchKids = async () => {
    try {
      const response = await fetch("/api/balak/all", { cache: "no-store" });
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

  if (!gameInfo) { notFound(); return null; }
  if (loading) return <div className="flex justify-center mt-20"><Spinner /></div>;

  // ✅ ACCESS DENIED UI
  if (!authorized) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#FCF9EA] p-6 text-center font-primary">
        <div className="bg-white p-10 rounded-[3rem] shadow-xl border-2 border-pink-100 flex flex-col items-center max-w-sm">
          <div className="bg-pink-50 p-5 rounded-full mb-4">
            <Lock className="h-12 w-12 text-pink-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2 uppercase">Access Locked</h2>
          <p className="text-slate-500 mb-6 font-medium">You are not authorized to manage <br/><span className="text-pink-600 font-bold">{gameInfo.name}</span>.</p>
          <Link href="/games-dashboard">
            <Button className="bg-slate-900 hover:bg-pink-600 font-bold px-8 h-12 rounded-2xl transition-all">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const playedCount = kids.reduce((count, kid) => {
    const gameData = kid.games?.find((g) => g.name === gameInfo.name);
    return gameData?.played ? count + 1 : count;
  }, 0);

  const filteredKids = kids.filter((kid) => {
    const fullName = `${kid.firstName} ${kid.lastName}`.toLowerCase();
    const search = searchTerm.toLowerCase();
    return fullName.includes(search) || (kid.sabha || "").toLowerCase().includes(search);
  });

  return (
    <div className="min-h-screen font-primary bg-[#FCF9EA] px-6 py-10 md:p-12 flex flex-col">
      <Link href={"/games-dashboard"}>
        <Button className="flex items-center justify-center gap-1 mb-6">
          Back to Games
        </Button>
      </Link>
      
      <h1 className="text-4xl md:text-5xl font-black mb-2 uppercase tracking-tight text-primary">
        {gameInfo.name}
      </h1>

      <p className="text-lg md:text-xl font-bold text-slate-600 mb-6">
        {playedCount} Kids Played till now!
      </p>

      <div className="w-full max-w-2xl mb-6 sticky top-4 z-20">
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
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="absolute inset-y-0 right-0 pr-4 flex items-center">
              <X className="h-5 w-5 border-2 border-pink-100 rounded-full p-0.5 bg-pink-50 text-pink-300" />
            </button>
          )}
        </div>
      </div>

      <div className="w-full max-w-2xl flex flex-col gap-3">
        {filteredKids.length > 0 ? (
          filteredKids.map((kid) => {
            const currentProgress = kid.games?.find((g) => g.name === gameInfo.name);
            return (
              <GameCard
                key={kid._id}
                kidId={kid._id}
                gameName={gameInfo.name} // ✅ Passes the exact name from Games list
                userName={`${kid.firstName} ${kid.lastName}`}
                sabhaName={kid.sabha}
                userImage={kid.pictureUrl}
                isPlayedInitially={currentProgress?.played || false}
                initialStars={currentProgress?.played ? currentProgress.score / 1000 : 0}
              />
            );
          })
        ) : (
          <div className="text-center py-10 text-pink-300 font-bold italic">
            No players found matching "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
}