"use client";

import { rightBarLinks, sidebarLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import Footer from "../utilities/Footer";

import { useUserContext } from "@/context/AuthContext";
import DarkModeToggle from "./DarkModeToggle";

const LeftSidebar = () => {
  const pathname = usePathname();
  const { user } = useUserContext();

  return (
    <section className="fixed custom-scrollbar leftsidebar h-screen">
      <div className="flex flex-col h-full gap-6 px-4">
        <Link href="/" className="mb-3 cursor-pointer items-center gap-2">
          <div className="flex gap-2 items-center">
            <div className="w-8 h-8">
              <Image
                src="/images/logo.jpg"
                alt=""
                width={20}
                height={10}
                className=""
                layout="responsive"
                quality={90}
              />
            </div>
            {/* Conditionally hide logo text when collapsed */}
            <div className={`w-[100px] h-full md:hidden max-lg:block xl:block`}>
              <Image
                src="/images/particlesa.jpg"
                alt=""
                width={20}
                height={10}
                className="dark:invert-white w-[100px] h-[70px]"
                layout="responsive"
                quality={90}
              />
            </div>
          </div>
        </Link>

        {/* Sidebar Links */}
        {sidebarLinks.map((item) => {
          const isActive =
            pathname === item.route || pathname?.startsWith(`${item.route}/`);
          return (
            <Link
              href={item.route}
              key={item.label}
              className={`leftsidebar_link items-center ${
                isActive ? "bg-purple-500" : "hover:bg-purple-400"
              }`}
            >
              <div className="relative size-4">
                <Image
                  src={item.imgURL}
                  alt={item.label}
                  width={20}
                  height={20}
                  priority
                  className={`${
                    isActive
                      ? "brightness-[3] invert-white"
                      : "hover:invert-white"
                  }`}
                />
              </div>
              {/* Only show text when not collapsed */}
              <p
                className={`text-neutral-600 text-sm dark:text-neutral-100 md:hidden max-lg:block xl:block`}
              >
                {item.label}
              </p>
            </Link>
          );
        })}

        {/* Admin Links */}
        {user.role === "admin" &&
          rightBarLinks.map((item) => {
            const isActive =
              pathname === item.route || pathname?.startsWith(`${item.route}/`);
            return (
              <Link
                href={item.route}
                key={item.label}
                className={`rightbar_link items-center ${
                  isActive ? "bg-purple-500" : "hover:bg-purple-400"
                }`}
              >
                <div className="relative size-4">
                  <Image
                    src={item.imgURL}
                    alt={item.label}
                    width={20}
                    height={20}
                    priority
                    className={`${
                      isActive ? "invert-white" : "hover:invert-white"
                    }`}
                  />
                </div>
                {/* Only show text when not collapsed */}
                <p
                  className={`text-neutral-600 text-sm dark:text-neutral-100 md:hidden max-lg:block xl:block`}
                >
                  {item.label}
                </p>
              </Link>
            );
          })}

        <div className="w-full mt-auto">
          {" "}
          <div className="p-3 mt-12 items-center">
            <DarkModeToggle />
            <hr />
          </div>
          <Footer user={user} />
        </div>
      </div>
    </section>
  );
};

export default LeftSidebar;
