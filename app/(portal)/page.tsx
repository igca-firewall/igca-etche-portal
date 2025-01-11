// pages/home.tsx
"use client";
import React, { useEffect } from "react";

import { getMe } from "@/lib/actions/user.actions";
// import { dummyPosts } from "@/lib/utils";
// import Link from "next/link";
import { redirect } from "next/navigation";
// import PostCard from "@/components/utilities/PostCard";
// import InputForm from "@/components/utilities/ScoreSheet";
// import StudentForm from "@/components/utilities/StudentsForm";
import { dummyPosts } from "@/lib/utils";
import PostCard from "@/components/utilities/PostCard";
import PostAd from "@/components/utilities/PostAd";
import { PinIcon } from "lucide-react";

const Home = () => {
  // const [isSplashVisible, setIsSplashVisible] = useState(false); // State for splash screen visibility
  useEffect(() => {
    const checkAuthentication = async () => {
      const xed = await getMe(); // Assuming getMe is asynchronous
      if (!xed) {
        redirect("/sign-in")
      }
    };

    checkAuthentication();
  }, []);

  // const {
  //   data: posts,
  //   isLoading: isPostLoading,
  //   isError: isErrorCreate,
  // } = useGetRecentPosts();
  // const { user } = useUserContext();
  // const { data: userDetails } = useGetUserDetails({ userId: user.$id });

  // useEffect(() => {
  //   // Check if splash screen has been shown before
  // //   const hasSeenSplash = localStorage.getItem("hasSeenSplash");

  //   if (!hasSeenSplash) {
  //     setIsSplashVisible(true); // Show splash screen if not seen before
  //     localStorage.setItem("hasSeenSplash", "true"); // Set flag in localStorage
  //   }
  // }, []);

  // useEffect(() => {
  //   const splashTimeout = setTimeout(() => {
  //     setIsSplashVisible(false); // Hide splash after 3 seconds
  //   }, 3000);

  //   return () => clearTimeout(splashTimeout); // Clean up timeout
  // }, [isSplashVisible]);

  // useEffect(() => {
  //   userDetails && store(userDetails?.color);
  // }, [userDetails]);

  // // if (isSplashVisible) {
  // //   return <SplashScreen />; // Show splash screen
  // // }

  return (
    <div className="flex xl:mr-32 md:mr-2">
      <div className="home-container">
        <div className="home-posts">
          {
           <ul className="flex flex-col gap-9 items-center justify-center w-full">
            <p className="font-semibold items-center justify-center flex gap-3 text-2xl ">
         <PinIcon className="rotate-45 w-6 h-6"/>  Pinned Posts:  
           </p>   
              <PostAd/>
              {dummyPosts && dummyPosts.length > 0 ? (
                dummyPosts.map((post: dummyPosts) => (
                  <PostCard post={post} key={post.$id} />
                ))
              ) : (
                <div className="flex-col h-[500px] justify-center items-center gap-3 rounded-lg">
                  <div className="flex flex-col gap-3 items-center ">
                    <p className="font-serif font-bold text-neutral-700 dark:text-neutral-200 text-[80px] md:text-[90px] xl:text-[100px]">
                      !
                    </p>
                    <p className="items-center justify-center text-center font-regular text-[12px] md:text-[16px] xl:text-[20px] text-neutral-500 dark:text-neutral-400">
                      Error fetching posts!
                    </p>
                    <p className="items-center justify-center text-center font-regular text-[9px] md:text-[12px] xl:text-[15px] text-neutral-500">
                      Please check your internet connection or reload
                    </p>
                    <button
                      className="bg-neutral-200 transition-transform duration-500 dark:bg-neutral-800 border-neutral-500 border-2 text-xs rounded-lg hover:bg-neutral-400 hover:text-white dark:hover:text-black-2 dark:hover:bg-neutral-400 hover:scale-110 text-neutral-800 dark:text-neutral-200 font-bold xl:w-56 md:w-48 w-36 py-4 px-6 ml-2"
                      onClick={() => location.reload()}
                    >
                      Reload
                    </button>
                  </div>
                </div>
              )}
            </ul>
          }
        </div>
      </div>
      {/* <StudentForm/> */}
      {/* <RightSideBar /> */}
    </div>
  );
};

export default Home;
