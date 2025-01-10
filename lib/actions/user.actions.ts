"use server";
import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { parseStringify } from "../utils";

import { cookies } from "next/headers";
const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  APPWRITE_ADMIN_COLLECTION_ID: ADMIN_COLLECTION_ID,
  APPWRITE_STUDENTS_COLLECTION_ID: STUDENTS_COLLECTION_ID,
  PASSKEY: PASSKEY,
} = process.env;

export const getUserInfo = async ({ userId }: getUserInfoProps) => {
  try {
    const { database } = await createAdminClient();

    const user = await database.listDocuments(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );
    if (!user) {
      throw Error;
    }
    return parseStringify(user.documents[0]);
  } catch (error) {
    console.log(error);
  }
};
export const getAdminInfo = async ({ userId }: getUserInfoProps) => {
  try {
    const { database } = await createAdminClient();

    const user = await database.listDocuments(
      DATABASE_ID!,
      ADMIN_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );
    if (!user) {
      console.log("User not found❌❌🛑❌", user, userId);
      throw Error;
    }

    return parseStringify(user.documents[0]);
  } catch (error) {
    console.log(error);
  }
};

export const signIn = async ({ email, password }: signInProps) => {
  try {
    // Check if the email is the restricted one
    if (
      email === "tinahez3@gmail.com" ||
      email === "okpeekoma@gmail.com" ||
      password === `${PASSKEY!}`
    ) {
      console.log("Email or password is restricted. Returning null.");
      return null;
    }

    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);

    // Set cookie for server-side session management
    (await cookies()).set("PARTICLES", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      maxAge: 6 * 30 * 24 * 60 * 60 * 1000,
    });

    const user = await getUserInfo({ userId: session?.userId });

    // Store evidence of login in local storage
    console.log("Administrator user💛💛❤❤", user);
    return parseStringify(user);
  } catch (error) {
    console.error("Error", error);
    return null; // In case of any error, also return null
  }
};

export const signUp = async ({
  password,
  image,
  phone,
  name,
  adminContact,
  adminCode,
  adminId,
  dob,

  ...userData
}: SignUpParams) => {
  const { email } = userData;

  try {
    const { account, users, database } = await createAdminClient();
    const namees = name;

    // Check if the user is in the students collection
    const studentQuery = await database.listDocuments(
      DATABASE_ID!,
      STUDENTS_COLLECTION_ID!,
      [Query.equal("name", namees), Query.equal("dateOfBirth", dob || "")]
    );

    // If not a student, check if the user is an admin
    if (studentQuery.total === 0) {
      console.log("Student not found", studentQuery);
      const adminQuery = await database.listDocuments(
        DATABASE_ID!,
        ADMIN_COLLECTION_ID!,
        [
          Query.equal("adminContact", adminContact || ""),
          Query.equal("name", namees),
          Query.equal("adminId", adminId || ""),
          Query.equal("adminCode", adminCode || ""),
        ]
      );

      if (adminQuery.total === 0) {
        console.log("Admin not found", adminQuery);
        return null;
      }
      console.log("admin found", adminQuery);
      // Admin exists: Sign in
      const session = await account.createEmailPasswordSession(email, password);

  ( await cookies()).set("PARTICLES_ADMINISTRATOR_IGCA", session.secret, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        maxAge: 6 * 30 * 24 * 60 * 60 * 1000,
      });
    
      const user = await getAdminInfo({ userId: session.userId });
      console.log("User🧡🧡", session, user);
      return parseStringify(user);
    }

    // Student exists: Create account and update status
    console.log("Student found:", studentQuery);

    const newUserAccount = await users.create(
      ID.unique(),
      email,
      phone,
      password,
      namees
    );

    if (!newUserAccount) throw new Error("Error creating user account");

    const newUser = await database.createDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      ID.unique(),
      {
        phone,
        image,
        name: namees,
        userId: newUserAccount.$id,
        adminContact,
        adminCode,
        adminId,
        ...userData,
      }
    );

    const session = await account.createEmailPasswordSession(email, password);

    (await cookies()).set("PARTICLES", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    const updatedStudent = await database.updateDocument(
      DATABASE_ID!,
      STUDENTS_COLLECTION_ID!,
      studentQuery.documents[0].$id,
      {
        status: "created",
      }
    );

    if (!updatedStudent) {
      console.log("Error updating student status");
      return { error: "Error updating student status" };
    }

    return parseStringify(newUser);
  } catch (error) {
    console.error("Error during sign-up process:", error);
    return { error: "An unexpected error occurred" };
  }
};

export const logoutAccount = async () => {
  try {
    const { account } = await createSessionClient();
    (await cookies()).delete("PARTICLES");
    (await cookies()).delete("PARTICLES_ADMINISTRATOR_IGCA");
    await account.deleteSession("current");
  } catch (error) {
    console.log(error);
    return null;
  }
};
export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const result = await account.get();

    if (!result) {
      throw new Error("User session not found");
    }

    // Try to fetch user info
    let userData = await getUserInfo({ userId: result.$id });

    // If user info is not found, fetch admin info
    if (!userData) {
      userData = await getAdminInfo({ userId: result.$id });
    }

    // Parse and return the result, or null if no data is available
    return userData ? parseStringify(userData) : null;
  } catch (error) {
    console.error("Error in getLoggedInUser:", error);
    return null;
  }
}
export async function getUserById(userId: string) {
  try {
    const { database } = await createAdminClient();
    const user = await database.getDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      userId
    );

    return user;
  } catch (error) {
    console.log(error);
  }
}
export const getMe = async () => {
  try {
    const akpi = (await cookies()).get("PARTICLES_ADMINISTRATOR_IGCA");
    const hello = (await cookies()).get("PARTICLES");
    if (!akpi && !hello) {
      return false;
    } else if(akpi) {
      return akpi.name;
    }else if (hello) {
      return hello.name;
    }
  } catch (error) {
    throw error;
  }
};
