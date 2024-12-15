"use client";

import { sidebarLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import Footer from "../utilities/Footer";
import { useUserContext } from "@/context/AuthContext";
import { Sheet, SheetTrigger, SheetContent } from '../ui/sheet';
import { HiMenu } from 'react-icons/hi'; // Hamburger icon for the trigger button

const LeftSidebar = () => {
  const pathname = usePathname();
  const { user } = useUserContext();

  const [isOpen, setIsOpen] = useState(false); // To track if sheet is open
  const sheetRef = useRef<HTMLDivElement | null>(null);

  // Variables to handle swipe gesture
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Handle swipe start
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  // Handle swipe move
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  // Handle swipe end
  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 150) {
      // Swiped left, close the sheet
      setIsOpen(false);
    } else if (touchEndX.current - touchStartX.current > 150) {
      // Swiped right, open the sheet
      setIsOpen(true);
    }
  };

  // Close sidebar on pathname change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div>
      {/* Sheet Component wrapping the Trigger */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        {/* Hamburger Button to trigger the Sheet */}
        <SheetTrigger asChild>
          <button className="p-1 text-neutral-500 rounded-md focus:outline-none">
            <HiMenu size={30} />
          </button>
        </SheetTrigger>

        {/* Sheet Content that slides in from the right */}
        <SheetContent
          ref={sheetRef}
          // position="right"
          size="lg"
          className="bg-gray-100 p-6 overflow-y-auto"
          onTouchStart={handleTouchStart} 
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Sidebar Content */}
          <div className="flex flex-col h-full gap-6 px-4">
            <Link href="/" className="mb-8 cursor-pointer items-center gap-2">
              <div className="flex gap-2 items-center">
                <div className="w-8 h-8">
                  <Image
                    src="/images/logo.jpg"
                    alt="Logo"
                    width={20}
                    height={10}
                    className="w-full"
                    layout="responsive"
                    quality={90}
                  />
                </div>
                <div className="w-[100px] h-full md:hidden max-lg:block xl:block">
                  <Image
                    src="/images/particlesa.jpg"
                    alt="Logo"
                    width={20}
                    height={10}
                    className="dark:invert-white w-[100px] h-[70px]"
                    layout="responsive"
                    quality={90}
                  />
                </div>
              </div>
            </Link>
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
                        isActive ? "brightness-[3] invert-white" : "hover:invert-white"
                      }`}
                    />
                  </div>
                  <p className="text-neutral-600 text-sm dark:text-neutral-100 md:hidden max-lg:block xl:block">
                    {item.label}
                  </p>
                </Link>
              );
            })}
          </div>
          <div className="p-3 items-center">
            <hr />
          </div>
          <div className="w-full mt-auto">
            <Footer user={user} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default LeftSidebar;
