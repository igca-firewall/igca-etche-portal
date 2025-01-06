"use server"
import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { parseStringify } from "../utils";

const {
  //     APPWRITE_POST_COLLECTION_ID: POST_COLLECTION_ID,
  //     APPWRITE_STORAGE_ID: STORAGE_ID,
  APPWRITE_COMPILED_ID: COMPILED_RESULTS_ID,
  APPWRITE_DATABASE_ID: DATABASE_ID,
  //     NEXT_PUBLIC_APPWRITE_ENDPOINT: ENDPOINT,
  //     NEXT_PUBLIC_APPWRITE_PROJECT: PROJECT_ID,
  //     APPWRITE_STUDENTS_COLLECTION_ID: APPWRITE_STUDENTS_COLLECTION_ID,
  APPWRITE_RESULT_COLLECTION_ID: RESULTS_ID,
  //     APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  //     APPWRITE_TRANSACTION_COLLECTION_ID: TRANSACTIONS_ID,
  APPWRITE_SCORES_COLLECTION_ID: SCORES_ID,
  TEACHERS_COLLECTION_ID: COMMENTS,
  //     APPWRITE_SCRATCHCARD_COLLECTION_ID: SCRATCHCARD_COLLECION_ID,
  // APPWRITE_SUBJECT_COLLECTION_ID: SUBJECTS_ID,
} = process.env;
export const addComment = async ({
  term,
  session,
  classRoom,
  comment,
}: {
  term: string;
  session: string;
  classRoom: string;
  comment: Array<{
    studentName: string;
    studentId: string;
    comment: string;
  }>;
}) => {
  try {
    const { database } = await createAdminClient();
    const formattedComment = comment.map((score) => JSON.stringify(score));

    const addedComment = await database.createDocument(
      DATABASE_ID!,
      COMMENTS!,
      ID.unique(),
      {
        session,
        term,
        index: `${session}_${term}`,
        classRoom,
        comment: formattedComment,
      }
    );
    console.log("comment added successfully:", addedComment);
    return addedComment;
  } catch (error) {
    console.log("error during teacher comment processing:", error);
  }
};
