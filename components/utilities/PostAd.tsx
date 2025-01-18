"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FaTiktok } from "react-icons/fa";
import Link from "next/link";

const PostAd = () => {
  return (
    <div className="post-card bg-white font-inter dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-[20px] overflow-hidden shadow-lg">
      {/* Header */}
      <div className="flex items-center p-4">
        <div className="w-14 h-14 rounded-full overflow-hidden mr-3">
          <Image
            src="/images/sabinus.jpeg"
            alt="Creator"
            width={56}
            height={56}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-md flex gap-2 items-center font-semibold text-neutral-800 dark:text-neutral-200">
            sabinus_1{" "}
            <Image src="/images/verified-p.png" alt="" height={16} width={16} />
          </div>
          <p className="text-xs flex items-center gap-1 text-neutral-500 dark:text-neutral-400">
        ~  TikTok
          </p>
        </div>
      </div>

      {/* Video Section */}
      <div className="w-full h-auto px-4 mb-4">
        <video
          className="rounded-lg object-cover w-full max-w-full max-h-[600px]"
          src="/videos/add.mp4"
          controls
          playsInline
          preload="metadata"
        />
      </div>

      {/* Caption */}
      <div className="px-4 pb-4">
        <p className="text-sm leading-6 text-neutral-700 dark:text-neutral-300">
          <span className="font-semibold text-neutral-800 dark:text-neutral-200">
            sabinus_1
          </span>{" "}
          🎥😂 Oga Sabinus says it all! Intellectual Giants Christian Academy
          isn’t just a school—it’s the foundation for greatness. Watch as the
          comedy king himself shares why this is the best place for your child
          to learn, grow, and lead. Enroll today and join the journey to
          excellence! 🌟📚
          <span className="font-medium">
            #IntellectualGiants #SabinusEndorses #FutureLeaders
          </span>
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-300 dark:border-neutral-700">
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Nigeria @
        </p>
        <Link className="flex items-center gap-1 animate-bounce" href={""}>
          <FaTiktok className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />
          <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
            TikTok
          </p>
        </Link>
      </div>
    </div>
  );
};

export default PostAd;
