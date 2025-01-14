"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import Logout from "./Logout";

const Footer = ({ user, type = "desktop" }: FooterProps) => {
  return (
    <footer className="py-3 px-2 md:px-1">
      <div className="flex items-center gap-4 md:gap-2">
        {/* User Image Section */}
        <div>
          <Link href="/personalization">
            <div className="flex items-center">
              <div className="w-10 h-10 overflow-hidden rounded-full">
                <Image
                  src={user.image ? user.image : "/images/th.jpg"}
                  alt="User Image"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                  layout="intrinsic"
                  quality={100}
                />
              </div>
            </div>
          </Link>
        </div>

        {/* User Info Section */}
        <div className="flex flex-col justify-center">
          <div className="block  max-lg:block xl:block md:hidden">
            <h1 className="text-sm font-semibold text-gray-700 dark:text-neutral-300 truncate">
              {user?.name}
            </h1>
            <p className="text-xs font-normal text-gray-600 dark:text-neutral-300 truncate">
              {user?.guardianContact ||
              user.adminContact ||
              user?.email.length > 16
                ? `${user.email.slice(0, 16)}...`
                : user.email}
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <div className="ml-auto">
          <Logout />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
