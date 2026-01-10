// import React from "react";
// import Link from "next/link"; // 1. Import the Link component
// import initialGames from "@/data/Games";
// import { Button } from "@/components/ui/button";
// import { color } from "framer-motion";

// const GamesDashboards = () => {
//   return (
//     <div className="font-primary min-h-screen bg-[#FCF9EA] p-8">
//       <div className="">
//         <Link href={"/"}>
//           <Button className={"flex items-center justify-center gap-1 mb-4"}>
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               height="24px"
//               viewBox="0 -960 960 960"
//               width="24px"
//               fill="#FFFFFF"
//             >
//               <path d="m314-440 114 114q12 12 11.5 28T428-270q-12 12-28.5 12.5T371-269L188-452q-12-12-12-28t12-28l183-183q12-12 28.5-11.5T428-690q11 12 11.5 28T428-634L314-520h446q17 0 28.5 11.5T800-480q0 17-11.5 28.5T760-440H314Z" />
//             </svg>{" "}
//             Back to Home
//           </Button>
//         </Link>
//         <header className="mb-6">
//           <h1 className="text-4xl font-bold text-pink-600">
//             Games Dashboards!
//           </h1>
//           <p className="text-pink-400">Select a game to get started</p>
//         </header>

//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
//           {initialGames.map((game, index) => (
//             <Link
//               href={`/games-dashboard/${game.slug}`}
//               key={index}
//               className="w-full"
//             >
//               <Button
//                 variant="outline"
//                 // 1. Remove the dynamic bg class from className
//                 className="w-full h-20 text-xl font-bold text-white transition-all duration-300"
//                 // 2. Use the style prop for dynamic hex colors
//                 style={{ backgroundColor: game.themeColor }}
//               >
//                 {game.name}
//               </Button>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GamesDashboards;








"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import initialGames from "@/data/Games";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { LockKeyhole } from "lucide-react";
import Link from "next/link";

const GamesDashboards = () => {
  const router = useRouter();
  const [selectedGame, setSelectedGame] = useState(null);
  const [passInput, setPassInput] = useState("");

  const handleGameClick = (game) => {
    setSelectedGame(game);
  };

  const handleVerify = () => {
    if (passInput === selectedGame.password) {
      sessionStorage.setItem(`auth_${selectedGame.slug}`, selectedGame.password);
      router.push(`/games-dashboard/${selectedGame.slug}`);
    } else {
      toast.error("Incorrect Password!");
      setPassInput("");
    }
  };

  return (
    <div className="font-primary min-h-screen bg-[#FCF9EA] p-8">
      <Link href={"/"}>
        <Button className="flex items-center justify-center gap-1 mb-4">
           Back to Home
        </Button>
      </Link>

      <header className="mb-6">
        <h1 className="text-4xl font-bold text-pink-600">Games Dashboards!</h1>
        <p className="text-pink-400 font-medium">Enter game password to manage players</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {initialGames.map((game, index) => (
          <Button
            key={index}
            variant="outline"
            className="w-full h-20 text-xl font-bold text-white transition-all duration-300 rounded-2xl"
            style={{ backgroundColor: game.themeColor }}
            onClick={() => handleGameClick(game)}
          >
            {game.name}
          </Button>
        ))}
      </div>

      <Dialog open={!!selectedGame} onOpenChange={() => { setSelectedGame(null); setPassInput(""); }}>
        <DialogContent className="sm:max-w-[380px] p-0 overflow-hidden rounded-[3rem] border-none shadow-2xl bg-white/95 backdrop-blur-md [&>button]:scale-[1.8] [&>button]:top-6 [&>button]:right-6 [&>button]:opacity-40">
          <div className="p-8 flex flex-col items-center">
            <div className="w-16 h-16 bg-pink-50 rounded-3xl flex items-center justify-center mb-6">
              <LockKeyhole className="text-pink-500" size={32} />
            </div>

            <DialogHeader className="text-center space-y-1">
              <DialogTitle className="text-2xl font-black text-slate-800 uppercase tracking-tight">Secure Entry</DialogTitle>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Code for {selectedGame?.name}</p>
            </DialogHeader>

            <div className="w-full space-y-6 mt-8">
              <Input
                type="password"
                inputMode="numeric"
                maxLength={4}
                placeholder="0000"
                className="h-20 text-center text-5xl font-black tracking-[0.5em] rounded-[2rem] border-2 border-slate-200 focus-visible:border-pink-400 focus-visible:ring-4 focus-visible:ring-pink-50 transition-all placeholder:text-slate-100"
                value={passInput}
                autoFocus
                onChange={(e) => setPassInput(e.target.value.replace(/\D/g, ""))}
                onKeyDown={(e) => e.key === "Enter" && handleVerify()}
              />
              <Button onClick={handleVerify} className="w-full h-16 bg-slate-900 hover:bg-pink-600 text-white rounded-[1.8rem] font-black text-lg active:scale-95 transition-all">
                UNLOCK DASHBOARD
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GamesDashboards;