"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

const Practical = () => {
  const [ogbuagu, setOgbuagu] = useState(false);

  return (
    <div>
      <Button
        className="bg-purple-500 rounded-full py-8 px-5"
        onClick={() => 
           !ogbuagu ? setOgbuagu(true): setOgbuagu(false)}
      > Set Ogbuagu</Button>

      {ogbuagu ? (
        <div>Ogbuagu has been set to true</div>
      ) : (
        <div>Ogbuagu was set to false</div>
      )}
    </div>
  );
};

export default Practical;
