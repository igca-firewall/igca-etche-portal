"use client";
import ScratchCards from "@/components/utilities/Scrachcard";
import Unauthorized from "@/components/utilities/Unauthorized";
import { useUserContext } from "@/context/AuthContext";
import { fetchScratchCard } from "@/lib/actions/scratchCard.actions";
import { useEffect, useState } from "react";

const ScratchCardImages = () => {
  const [scratchCards, setScratchCards] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchScratchCard();
      setScratchCards(data);
    };

    fetchData();
  }, []);
  const { user } = useUserContext();
  return (
    <div className=" ">
      {user?.role === "admin" ? (
        <div className="flex flex-wrap gap-6">
          {scratchCards.map((card, index) => (
            <ScratchCards
              key={index}
              frontImageUrl={"/images/t.jpg"}
              backImageUrl="/images/h.jpg"
              code={card.code}
            />
          ))}
        </div>
      ) : (
        <Unauthorized />
      )}
    </div>
  );
};
export default ScratchCardImages;
