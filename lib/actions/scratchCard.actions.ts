"use server";
import { ID, Query } from "node-appwrite";
import {
  generateUniqueId,
  parseStringify,
  generateScratchCardCode,
} from "../utils";
import { createAdminClient } from "../appwrite";
const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  // APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  //   APPWRITE_STUDENTS_COLLECTION_ID: APPWRITE_STUDENTS_COLLECTION_ID,
  //   APPWRITE_RESULT_COLLECTION_ID: RESULTS_ID,
  //   APPWRITE_TRANSACTION_COLLECTION_ID: TRANSACTIONS_ID,
  APPWRITE_SCRATCHCARD_COLLECTION_ID: SCRATCHCARD_COLLECTION_ID,
} = process.env;

export const createScratchCard = async ({ amount }: { amount: number }) => {
  const { database } = await createAdminClient();
  try {
    // Number of cards to create

    const scratchCard = Array.from({ length: amount }, () => {
      return database.createDocument(
        DATABASE_ID!,
        SCRATCHCARD_COLLECTION_ID!,
        ID.unique(),
        {
          code: generateScratchCardCode(),
          id: generateUniqueId(),
          status: "unUsed",
        }
      );
    });
    if (!scratchCard) {
      console.log("No new ScratchCard created");
    }
    return parseStringify(scratchCard);
  } catch (error) {
    console.error("An error occurred while creating a scratch card:", error);
  }
};
export const updateScratchCardStatusCode = async ({
  id,
  usedFor,
  usedBy,
}: {
  id: string;
  usedFor: string;
  usedBy: string;
}) => {
  try {
    const { database } = await createAdminClient();
    const updatedScratchCard = await database.updateDocument(
      DATABASE_ID!,
      SCRATCHCARD_COLLECTION_ID!,
      id,
      {
        status: "used",
        usedFor: usedFor,
        usedBy: usedBy, // No need for template literal
      }
    );

    if (!updatedScratchCard) {
      throw new Error("Failed to update Scratch Card Status.");
    }

    return parseStringify(updatedScratchCard); // Directly use the returned object
  } catch (error) {
    console.error("Error Updating the Scratch Card Status:", error);
    throw error; // Re-throw the error for better debugging
  }
};

export const deleteScratchCard = async ({ id }: { id: string }) => {
  try {
    const { database } = await createAdminClient();
    const deleteScratchCard = await database.deleteDocument(
      DATABASE_ID!,
      SCRATCHCARD_COLLECTION_ID!,
      id
    );

    if (!deleteScratchCard) {
      throw new Error("Failed to delete Scratch Card😭.");
    }
  } catch (error) {
    console.log("Error Deleting the Scratch Card😭:", error);
  }
};
export const useScratchCards = async ({
  code,
  usedFor,
  usedBy,
}: {
  code: string;
  usedBy: string;
  usedFor: string;
}) => {
  const { database } = await createAdminClient();
  try {
    const gotten = await database.listDocuments(
      DATABASE_ID!,
      SCRATCHCARD_COLLECTION_ID!,
      [Query.equal("code", code)]
    );
    console.log("code gottten🧡🧡🧡", gotten);
    if (!gotten) {
      console.log("That is an invalid scratch card pin", gotten);
      return null;
    }
    if (
      gotten.documents[0].status === "used" &&
      gotten.documents[0].usedFor !== (usedFor || null)
    ) {
      return null;
    }
    if (gotten) {
      const deletedScratchcard = await updateScratchCardStatusCode({
        id: gotten.documents[0].$id,
        usedFor: usedFor,
        usedBy: usedBy,
      });
      if (deletedScratchcard) {
        console.log("Fetched and Updated the status of the card All-Done");
        return parseStringify(deletedScratchcard); // This line seems incorrect
      }
    }
  } catch (error) {
    console.log("There was an error in the scratchcard logic:", error);
  }
};
export const fetchScratchCard = async () => {
  const { database } = await createAdminClient();
  const allScratchCards = await database.listDocuments(
    DATABASE_ID!,
    SCRATCHCARD_COLLECTION_ID!,
    [Query.notEqual("status", "used"), Query.limit(200)]
  );
  return parseStringify(allScratchCards.documents);
};
