"use client";

import { useEffect, useState } from "react";
import { useUserContext } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { decryptKey, multiFormatDateString } from "@/lib/utils";

type PostCardProps = {
  post: any;
  className?: string;
};

const PostCard = ({ post, className = "" }: PostCardProps) => {
  const { user } = useUserContext();
  const [localUserData, setLocalUserData] = useState<any>(null);

  useEffect(() => {
    const storedData = localStorage.getItem("Trash");
    if (storedData) {
      const decryptedData = decryptKey(storedData);
      const parsedData = JSON.parse(decryptedData);
      setLocalUserData(parsedData);
    }
  }, []);

  if (!post.creator) return null;

  const isCurrentUser = (user?.$id || localUserData?.$id) === post.creator.$id;

  return (
    <div
      className={`post-card bg-white font-inter dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="flex items-center p-4">
        <Link href={`/profile/${post.creator.$id}`}>
          <div className="w-14 h-14 rounded-full overflow-hidden mr-3">
            <Image
              src={post.creator.imageUrl || "/images/th.png"}
              alt="Creator"
              width={40}
              height={40}
              className="object-cover w-full h-full"
            />
          </div>
        </Link>
        <div className="flex flex-col">
          <Link href={`/profile/${post.creator.$id}`}>
            <p className="text-sm font-semibold flex gap-2 text-neutral-800 dark:text-neutral-200">
              {post.creator.firstName} {post.creator.lastName}{" "}
              <div className="w-8 h-8 items-center text-center">
                {post.verified && (
                  <Image
                    src="/images/verified-p.png"
                    alt=""
                    height={16}
                    width={16}
                  />
                )}
              </div>{" "}
            </p>
          </Link>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {multiFormatDateString(post.$createdAt)}
          </p>
        </div>
        {isCurrentUser && (
          <div className="ml-auto">
            <Link href={`/update-post/${post.$id}`}>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Edit
              </p>
            </Link>
          </div>
        )}
      </div>

      {/* Image Section - Full Size, Curved Edges */}
      {post.imageUrl && (
        <div className="w-90 h-100 px-2 overflow-hidden rounded-lg">
          <Image
            alt="Post image"
            className="rounded-lg object-cover w-full max-w-full max-h-[600px]"
            src={post.imageUrl}
            width={1}
            height={1}
            quality={100}
            layout="responsive"
            loading="lazy"
          />
        </div>
      )}

      {/* Caption */}
      <div className="p-4">
        <p className="text-sm">
          <span className="font-semibold text-neutral-800 dark:text-neutral-200">
            {post.creator.firstName}:
          </span>{" "}
          {post.caption}
        </p>
        {post.tags && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
            {post.tags}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-neutral-300 dark:border-neutral-700">
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {post.location || "No location provided"}
        </p>
      </div>
      <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-300 dark:border-neutral-700">
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Nigeria @
        </p>
        <Link className="flex items-center gap-1 animate-bounce" href={""}>
          <Image src="" alt="" className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />
          <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
            TPa
          </p>
        </Link>
      </div>
    </div>
  );
};

export default PostCard;
