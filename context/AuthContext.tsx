"use client";
import { getLoggedInUser, getMe } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

export const INITIAL_USER: User = {
  $id: "",
  email: "",
  phone: "",
  userId: "",
  adminCode: "",
  adminContact: "",
  adminId: "",
  name: "",
  role: "",
  guardianContact: "",
  image: "",
};

const INITIAL_STATE: IContextType = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

// Utility function to get cookies by name
// function getCookie(name: string): string | undefined {
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) {
//     const cookieValue = parts.pop();
//     if (cookieValue) {
//       return cookieValue.split(";").shift();
//     }
//   }
//   return undefined;
// }

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(INITIAL_USER);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const checkAuthUser = async () => {
    setIsLoading(true);
    try {
      const currentAccount = await getLoggedInUser();
      if (currentAccount) {
        setUser({
          $id: currentAccount.$id,
          name: currentAccount.name,
          adminCode: currentAccount.adminCode,
          adminContact: currentAccount.adminContact,
          adminId: currentAccount.adminId,
          email: currentAccount.email,
          phone: currentAccount.phone,
          userId: currentAccount.userId,
          role: currentAccount.role,
          image: currentAccount.image,
          guardianContact: currentAccount.guardianContact,
        });
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      const xed = await getMe(); // Assuming getMe is asynchronous
      if (!xed) {
        redirect("/sign-in");
      } else {
        await checkAuthUser(); // Assuming checkAuthUser is asynchronous
      }
    };

    checkAuthentication();
  }, []);

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

export const useUserContext = () => useContext(AuthContext);
