import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
interface ScratchCardProps {
  frontImageUrl: string;  // Front image URL
  backImageUrl: string;   // Back image URL
  code: string;
}

const ScratchCards: React.FC<ScratchCardProps> = ({ frontImageUrl, backImageUrl, code }) => {
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
    <div
      className="relative bg-white dark:bg-neutral-800 dark:text-white text-neutral-800  w-full sm:w-80 h-80 cursor-pointer rounded-lg shadow-lg transition-transform duration-500 hover:scale-105"

    >
 <div className="w-[180px] h-full max-h-20 md:hidden max-lg:block xl:block justify-center">
              <Image
                src="/images/particles.png"
                alt=""
                width={20}
                height={3}
                className="w-[100px] h-[70px]"
                layout="responsive"
                quality={90}
              />
            </div>
      {/* Front Side */}
   
      {/* Back Side */}
      <div
        className="absolute w-full h-full bg-black bg-opacity-70 flex items-center justify-center "
       
      >
        <div className="text-center space-y-4">
          <div
            className="text-2xl sm:text-3xl font-bold cursor-pointer"
            onClick={handleCopyCode}
            aria-label="Copy code"
          >
            {copied ? (
              <span className="text-green-500">Copied!</span>
            ) : (
              code
            )}
          </div>
          <div
            className="text-sm text-gray-300"
            style={{ opacity: copied ? 0.7 : 1 }}
          >
            Click to copy the code
          </div>
        </div>
      </div>
       <div className="w-[120px] h-full justify-center">
                             <Image
                               src="/images/particlesm.png"
                               alt="Particles"
                               width={14}
                               height={3}
                               className="w-[80px] h-[50px] dark:invert"
                               layout="responsive"
                               quality={90}
                             />
                           </div>
    </div>
  );
};

export default ScratchCards;
