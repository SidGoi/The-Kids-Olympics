import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const RootPage = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center flex-col gap-5">
      <h1 className="themefont text-4xl font-black">The Kids Olympics</h1>
      <div className="grid grid-cols-2 gap-2 px-10">
        <Link href={"/registration"} className="w-full">
          <Button className="w-full font-bold" size="lg">
            Go to Registration
          </Button>
        </Link>
        <Link href={"/live-score"} className="w-full">
          <Button className="w-full font-bold bg-green-500" size="lg">
            View Live Score
          </Button>
        </Link>
        <Link href={"/games-dashboard"} className="w-full">
          <Button className="w-full font-bold bg-blue-600" size="lg">
            Games Dashboard
          </Button>
        </Link>
        <Link href={"/players"} className="w-full">
          <Button className="w-full font-bold bg-orange-400" size="lg">
            View All Players
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default RootPage;
