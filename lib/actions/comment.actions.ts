"use server";
import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { parseStringify } from "../utils";

const {
  //     APPWRITE_POST_COLLECTION_ID: POST_COLLECTION_ID,
  //     APPWRITE_STORAGE_ID: STORAGE_ID,
  APPWRITE_COMPILED_ID: COMPILED_RESULTS_ID,
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_2ND_TERM_COLLECTION_ID: SECOND,
  APPWRITE_3RD_TERM_COLLECTION_ID: THIRD,
  APPWRITE_1ST_TERM_COLLECTION_ID: FIRST,
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
interface Score {
  studentId: string;
  studentName: string;
  comment: string;
}

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
      updatedComments = existingComment.comment.map(
        (existingCommentStr: string) => {
          const existing = JSON.parse(existingCommentStr);
          const newComment = comment.find(
            (c) => c.studentId === existing.studentId
          );

          if (newComment) {
            // If matching student found, update comment text
            return JSON.stringify({
              ...existing,
              comment: newComment.comment,
            });
          }
          return existingCommentStr; // Keep the old comment if no match
        }
      );

      // Add any new comments that weren't found in the existing comments
      const existingStudentIds = existingComment.comment.map((c: string) => {
        const parsed = JSON.parse(c);
        return parsed.studentId;
      });

      // Filter for new comments that don't exist in the current list
      const newComments = comment.filter(
        (c) => !existingStudentIds.includes(c.studentId)
      );
      const newFormattedComments = newComments.map((c) => JSON.stringify(c));

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
  studentId,
}: {
  term: string;
  session: string;
  classRoom: string;
  studentId: string;
}) => {
  try {
    const { database } = await createAdminClient(); // Assuming createAdminClient is correctly implemented

    const index = `${session}_${term}_${classRoom}`;
    console.log("Fetching comments for index:", index);

    const existingComments = await database.listDocuments(
      DATABASE_ID!,
      COMMENTS!,
      [Query.equal("index", index)]
    );

    console.log("Existing comments:", existingComments.documents);

    if (existingComments.documents.length === 0) {
      throw new Error("No results found for the given query.");
    }

    const studentScores = existingComments.documents
      .map((item) => {
        // Skip if no scores available
        if (!item.scores || item.scores.length === 0) {
          return null;
        }

        // Parse the stringified scores
        const parsedScores: Score[] = item.scores
          .map((scoreStr: any) => {
            try {
              const parsed = JSON.parse(scoreStr) as Score; // Cast to Score type
              // Log parsed score
              return parsed;
            } catch (e) {
              console.error("Error parsing score:", e);
              return null;
            }
          })
          .filter((score: Score): score is Score => score !== null); // Type guard for null filtering

        // Find the student by ID within the parsed scores
        const studentScore =
          parsedScores.find((score) => score.studentId === studentId) ?? null;

        if (studentScore) {
          // Add the subject to the filtered result
          return {
            studentName: item.studentName, // Assuming the name is stored in studentName field
            studentId: item.studentId,
            classRoom: item.classRoom, // Assuming studentId is available in the document
            term: item.term,
            session: item.session,
            comment: studentScore.comment,
          };
        }
        return null;
      })
      .filter(
        (
          result
        ): result is {
          classRoom: string;
          term: string;
          session: string;
          studentId: string;
          studentName: string;
          comment: string;
        } => result !== null
      ); // Type guard for null filtering

    return studentScores;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};
