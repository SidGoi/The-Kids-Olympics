import Image from "next/image";
import { Star } from "lucide-react";

const KidCard = ({ kid }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex gap-4 hover:scale-[1.02] transition">
      <div className="relative w-20 h-20 rounded-lg overflow-hidden border">
        <Image
          src={kid.pictureUrl}
          alt={kid.firstName}
      width={100}
      height={100}
          className="object-cover"
        />
      </div>

      <div className="flex-1">
        <h3 className="text-lg font-bold">
          {kid.firstName} {kid.lastName}
        </h3>

        <p className="text-sm text-muted-foreground">
          Age: {kid.age} • Sabha: {kid.sabha}
        </p>

        <div className="flex items-center gap-2 mt-2">
          <Star className="text-yellow-500 fill-yellow-500 w-4 h-4" />
          <span className="font-semibold">
            {kid.totalScore} Points
          </span>
        </div>
      </div>
    </div>
  );
};

export default KidCard;
