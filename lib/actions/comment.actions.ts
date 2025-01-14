"use server";
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
  const hem = COMMENTS;
  const index = `${session}_${term}_${classRoom}`;

  try {
    const { database } = await createAdminClient();

    // Validate comment format
    if (
      !Array.isArray(comment) ||
      !comment.every(
        (item) =>
          typeof item === "object" &&
          "studentId" in item &&
          "studentName" in item &&
          "comment" in item &&
          typeof item.studentId === "string" &&
          typeof item.studentName === "string" &&
          typeof item.comment === "string"
      )
    ) {
      throw new Error(
        "Invalid 'comment' format. Expected an array of objects with valid fields."
      );
    }

    const formattedComment = comment.map((item) => JSON.stringify(item));

    // Check for existing comments
    const existingComments = await database.listDocuments(DATABASE_ID!, hem!, [
      Query.equal("index", index),
    ]);

    let updatedComments = formattedComment; // Start with new comments

    if (existingComments.documents.length > 0) {
      const documentId = existingComments.documents[0].$id;
      const existingComment = existingComments.documents[0];

      // Update comments for each existing student
      updatedComments = existingComment.comment.map((existingCommentStr: string) => {
        const existing = JSON.parse(existingCommentStr);
        const newComment = comment.find(c => c.studentId === existing.studentId);
        
        if (newComment) {
          // If matching student found, update comment text
          return JSON.stringify({
            ...existing,
            comment: newComment.comment,
          });
        }
        return existingCommentStr; // Keep the old comment if no match
      });

      // Add any new comments that weren't found in the existing comments
      const existingStudentIds = existingComment.comment.map((c: string) => {
        const parsed = JSON.parse(c);
        return parsed.studentId;
      });

      // Filter for new comments that don't exist in the current list
      const newComments = comment.filter(c => !existingStudentIds.includes(c.studentId));
      const newFormattedComments = newComments.map(c => JSON.stringify(c));

      // Combine existing updated comments with new comments
      updatedComments = [...updatedComments, ...newFormattedComments];

      // Log the final array of all comments (both updated and new)
      console.log("All comments (updated + new):", updatedComments);

      // Update the document with the combined comments
      const updatedDocument = await database.updateDocument(
        DATABASE_ID!,
        hem!,
        documentId,
        {
          comment: updatedComments,
        }
      );

      console.log("Updated successfully the existing comment", updatedDocument);
      return parseStringify(updatedDocument);
    } else {
      // If no existing comments, create a new document with all comments
      const addedComment = await database.createDocument(
        DATABASE_ID!,
        hem!,
        ID.unique(),
        {
          session,
          term,
          index,
          classRoom,
          comment: updatedComments,
        }
      );
      console.log("Comment added successfully", addedComment);
      return parseStringify(addedComment);
    }
  } catch (error) {
    console.error(
      "Error processing teacher comment",
      error,
      hem,
      index,
      classRoom,
      session,
      term,
      comment
    );
    throw error;
  }
};

export const fetchComments = async ({
  term,
  session,
  classRoom,
}: {
  term: string;
  session: string;
  classRoom: string;
}) => {
  const hem = COMMENTS;
  const index = `${session}_${term}_${classRoom}`;

  try {
    const { database } = await createAdminClient();

    // Fetch existing comments based on the index
    const existingComments = await database.listDocuments(DATABASE_ID!, hem!, [
      Query.equal("index", index),
    ]);

    if (existingComments.documents.length > 0) {
      // If comments exist, return the first matching document's comments
      console.log("Comments fetched successfully", existingComments.documents);
      return existingComments.documents.map((doc) => {
        // Parsing the comment field back from JSON
        return {
          ...doc,
          comment: doc.comment.map((item: string) => JSON.parse(item)),
        };
      });
    } else {
      console.log("No comments found for this session, term, and classRoom");
      return [];
    }
  } catch (error) {
    console.error("Error fetching comments", error);
    throw error;
  }
};
