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

export const createScratchCard = async () => {
  const { database } = await createAdminClient();
  try {
    const Cardnumber = 500; // Number of cards to create

    const scratchCard = Array.from({ length: Cardnumber }, () => {
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
export const updateScratchCardStatusCode = async ({ id }: { id: string }) => {
  try {
    const { database } = await createAdminClient();
    const updateScratchCard = await database.updateDocument(
      DATABASE_ID!,
      SCRATCHCARD_COLLECTION_ID!,
      id,
      {
        status: "used",
      }
    );

    if (!updateScratchCard) {
      throw new Error("Failed to update Scratch Card Status.");
    }

    return parseStringify(updateScratchCard.documents[0]);
  } catch (error) {
    console.log("Error Updating the Scratch Card Status:", error);
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
export const useScratchCards = async ({ code }: { code: string }) => {
  const { database } = await createAdminClient();
  try {
    const gotten = await database.listDocuments(
      DATABASE_ID!,
      SCRATCHCARD_COLLECTION_ID!,
      [Query.equal("code", code)]
    );
    if (!gotten) {
      console.log("That is an invalid scratch card pin", gotten);
      return null;
    }
    if (gotten) {
    const deletedScratchcard=  await deleteScratchCard({ id: gotten.documents[0].$id });
    
      console.log("Fetched and Updated the status of the card All-Done");
      return parseStringify(gotten.documents);
    }
  } catch (error) {
    console.log("There was an error in the scratchcard logic:", error);
  }
};
export const fetchScratchCard = async () => {
  const { database } = await createAdminClient();
  const allScratchCards = await database.listDocuments(
    DATABASE_ID!,
    SCRATCHCARD_COLLECTION_ID!
  );
  return parseStringify(allScratchCards.documents);
};
