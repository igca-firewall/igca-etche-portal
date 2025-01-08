import { logoutAccount } from "@/lib/actions/user.actions";
// import { useSignOutAccount } from "@/lib/react-query/queriesAndMutation";
import { LocalStorageManager } from "@/lib/utils";
import Image from "next/image";
import { redirect } from "next/navigation";
// import { redirect, useRouter } from "next/navigation";
import React from "react";

const Logout = () => {

  const handleLogOut = async () => {
    LocalStorageManager();
    logoutAccount()
   //  loggedOut();
    redirect("/sign-in");
  };

  return (
    <div className="cursor-pointer">
      <Image
        onClick={handleLogOut}
        src="/icons/logout.svg"
        height={20}
        width={20}
        alt="Logout"
      />
    </div>
  );
};

export default Logout;
