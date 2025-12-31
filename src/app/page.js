import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const RootPage = () => {
  return (
    <div>
      <Link href={'/registration'}>
      <Button className={"font-bold"} size="lg">
        Go to Registration
      </Button>
      </Link>
    </div>
  );
};

export default RootPage;
