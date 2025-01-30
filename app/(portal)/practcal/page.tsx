"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";

const Practical = () => {
  const [me, setme] = useState("");

useEffect(()=>{
},[])
  return (
    <div>
      <Button
        className="bg-purple-800 rounded-full py-64 px-64 ml-64 text-start font-bold hover:scale-110 transition duration-2000 text-[50px]"
        onClick={() => (!me ? setme("Cornerstone") : setme(""))}
      >
        {" "}
        Set me
      </Button>

      {me ? (
        <div className="text-purple-800 rounded-full py-64 px-64 ml-64 text-start font-bold text-[50px]">
          {me}
        </div>
      ) : (
        <div className="text-purple-800 rounded-full py-64 px-64 ml-64 text-start font-bold text-[50px]">
          There is no cornerstone
        </div>
      )}
    </div>
  );
};

export default Practical;
