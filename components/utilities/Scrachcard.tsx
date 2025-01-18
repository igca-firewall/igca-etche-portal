import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
interface ScratchCardProps {
  frontImageUrl: string; // Front image URL
  backImageUrl: string; // Back image URL
  code: string;
}

const ScratchCards: React.FC<ScratchCardProps> = ({
  frontImageUrl,
  backImageUrl,
  code,
}) => {
  const [copied, setCopied] = useState(false);
  const [flipped, setFlipped] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    });
  };

  const handleCardClick = () => {
    setFlipped((prev) => !prev); // Toggle flipped state on click
  };

  return (
    <div className="relative w-[400px] h-[200px] rounded-[25px] bg-white dark:bg-neutral-800 dark:text-white text-neutral-800  flex-col  cursor-pointer  shadow-2xl transition-transform duration-500 hover:scale-105">
      {/* Left Section */}

      {/* Middle Section (Clickable Overlay) */}
      <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center">
  
        {/* <div className="w-[80px] h-full flex items-center justify-center">
      <Image
        src="/images/particles.png"
        alt=""
        width={180}
        height={80}
        className="object-cover"
        quality={90}
      />
    </div> */}{" "}
        <div className="text-center space-y-4">
          <div
            className="text-2xl sm:text-3xl font-bold font-sans cursor-pointer"
            onClick={handleCopyCode}
            aria-label="Copy code"
          >
            {copied ? <span className="text-green-500">Copied!</span> : code}
          </div>
          <div
            className="text-sm text-gray-300"
            style={{ opacity: copied ? 0.7 : 1 }}
          >
            Click to copy the code
          </div>
        </div>
        <div className="">
          <Image
            src="/images/particlesm.png"
            alt="Particles"
            width={120}
            height={50}
            className="object-cover dark:invert"
            quality={90}
          />
        </div>
      </div>

      {/* Right Section */}
    </div>
  );
};

export default ScratchCards;
