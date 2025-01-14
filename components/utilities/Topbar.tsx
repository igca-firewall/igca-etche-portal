"use client";
import { useEffect, useState } from "react";
import { useUserContext } from "@/context/AuthContext";
import Image from "next/image";
import React from "react";
// import { decryptKey } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SheetComponent from "./Sheet";

interface LinkItem {
  route: string;
  label: string;
  imgURL: string;
  hasNotification?: boolean; // New property to indicate notification
}

interface xee {
  links: LinkItem[];
 
}

const Topbar: React.FC<xee> = ({ links}) => {
  const [isVisible, setIsVisible] = useState(true);
   let lastScrollTop = 0;

  // const router = useRouter(); // Use router to programmatically navigate
   const { user } = useUserContext();
  // useEffect(() => {
  //   const fetchUserInfo = async () => {
  //     const userInformation = await getUserInfo();
  //     if (userInformation) (userInformation);
  //   };
  //   fetchUserInfo();
  // }, []);

  // useEffect(() => {
  //   const fetchUserName = async () => {
  //     const name = await getUserName();
  //     if (name) setUserName(name);
  //   };
  //   fetchUserName();
  // }, []);

  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setIsVisible(scrollTop <= lastScrollTop);
      lastScrollTop = scrollTop;
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Check for notifications and update count
  // useEffect(() => {
  //   const count = links.filter((link) => link.hasNotification).length;
  //   setNotificationCount(count); // Update notification count

  //   if (count > 0) {
  //     setShowNotification(true); // Show notification if there are any

  //     // Start the timer to hide the notification after 6 seconds
  //     const notificationTimeout = setTimeout(() => {
  //       setShowNotification(false);
  //     }, 6000);

  //     // Clear timeout when the component unmounts or notifications change
  //     return () => clearTimeout(notificationTimeout);
  //   } else {
  //     setShowNotification(false); // Hide notification if no notifications
  //   }
  // }, [links]); // Re-run this effect when `links` change

  // Handle click on the notification indicator
  // const handleNotificationClick = () => {
  //   const firstNotificationLink = links.find((link) => link.hasNotification);
  //   if (firstNotificationLink) {
  //     router.push(firstNotificationLink.route); // Navigate to the first notification route
  //   }
  // };
 
  const userImage = user.image
  return (
    <>
      {/* Notification Banner */}

      <div
        className={`fixed xl:hidden md:hidden top-0 left-0 right-0 h-auto bg-neutral-200 dark:bg-neutral-800 shadow-md z-50 transition-transform duration-300 `}
      >
        <div className="flex flex-col items-center justify-between px-4 py-2">
          {/* Top Row: Hamburger menu and profile */}
          <div className="flex justify-between items-center w-full">
           <SheetComponent/>
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
            <Link href="/personalization">
              {userImage ? (
                <div className="flex items-center">
                  <div className="w-8 h-8 overflow-hidden rounded-full">
                    <Image
                      src={user.image}
                      alt="User Image"
                      width={38}
                      height={38}
                      className="w-8 h-8 rounded-full object-cover"
                      layout="responsive"
                      quality={100}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center">
                  <div className="w-8 h-8 overflow-hidden rounded-full">
                    <Image
                      src="/images/th.jpg"
                      alt="User Image"
                      width={38}
                      height={38}
                      className="w-8 h-8 rounded-full object-cover"
                      layout="responsive"
                      quality={100}
                    />
                  </div>
                </div>
              )}
            </Link>
          </div>

          {/* Bordered Input Section */}
  
        </div>
      </div>
    </>
  );
};

export default Topbar;
