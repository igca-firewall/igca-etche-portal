"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { parseStringify } from "../utils";

const {
  //     APPWRITE_POST_COLLECTION_ID: POST_COLLECTION_ID,
  //     APPWRITE_STORAGE_ID: STORAGE_ID,
  APPWRITE_DATABASE_ID: DATABASE_ID,
  //     NEXT_PUBLIC_APPWRITE_ENDPOINT: ENDPOINT,
  //     NEXT_PUBLIC_APPWRITE_PROJECT: PROJECT_ID,
  //     APPWRITE_STUDENTS_COLLECTION_ID: APPWRITE_STUDENTS_COLLECTION_ID,
  APPWRITE_RESULT_COLLECTION_ID: RESULTS_ID,
  //     APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  //     APPWRITE_TRANSACTION_COLLECTION_ID: TRANSACTIONS_ID,
  //     APPWRITE_CLASS_COLLECTION_ID: CLASSES,
  //     APPWRITE_SCRATCHCARD_COLLECTION_ID: SCRATCHCARD_COLLECION_ID,
  // APPWRITE_SUBJECT_COLLECTION_ID: SUBJECTS_ID,
} = process.env;

export const fetchResult = async ({ classRoom, id, term }: ResultParams) => {
  const { database } = await createAdminClient();
  const result = await database.listDocuments(DATABASE_ID!, RESULTS_ID!, [
    Query.equal("studentId", id),
    Query.equal("classRoom", classRoom),
    Query.equal("term", term),
  ]);
  if (!result) {
    console.log("No results found:", result);
    return false
  }
  console.log("Result retrieved Successfully 😁😁😁", result);
  return parseStringify(result.documents[0]);
};

export const updateResults = async ({
  id,
  scores,
  classRoom,
  term,
}: {
  id: string;
  scores: string[];
  classRoom: string;
  term: string;
}) => {
  const { database } = await createAdminClient();

  const fetchedToUpdate = await fetchResult({
    classRoom: classRoom,
    id: id,
    term: term,
  });
  if (!fetchedToUpdate) {
    console.log("No document to update in results collection", fetchedToUpdate);
    return false;
  }
  const updatedResults = await database.updateDocument(
    DATABASE_ID!,
    RESULTS_ID!,
    fetchedToUpdate.$id,
    {
      scores,
    }
  );
  if (!updatedResults) {
    console.log(
      "Update of results failed rexults.actions.ts: ",
      updatedResults
    );
    return false;
  }
  console.log("Updated results", updatedResults);
};

export const uploadResults =  async({
  id,
  scores,
  classRoom,
  term,
}: {
  id: string;
  scores: string[];
  classRoom: string;
  term: string;
}) => {
  const {database} =  await createAdminClient()



  const upload = await database.createDocument(
    DATABASE_ID!,
    RESULTS_ID!,
    ID.unique(),
    {
      studentId : id,
      scores,
      classRoom,
      term,
    }
  )
  if (!upload) {
    console.log("Error uploading results", upload);
    return false;
  }
  console.log("Results uploaded successfully", upload);
  return parseStringify(upload)
};