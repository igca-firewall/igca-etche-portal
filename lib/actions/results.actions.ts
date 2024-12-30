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
  //     APPWRITE_SCRATCHCARD_COLLECTION_ID: SCRATCHCARD_COLLECION_ID,
  // APPWRITE_SUBJECT_COLLECTION_ID: SUBJECTS_ID,
} = process.env;
export const addresults = async ({
  classRoom,
  session,
  term,
  subject,
  scores,
}: {
  classRoom: string;
  session: string;
  term: string;
  subject: string;
  scores: Array<{
    studentId: string;
    studentName: string;
    firstTest: string;
    secondTest: string;
    project: string;
    bnb: string;
    assignment: string;
    exam: string;
    total: string;
    grade: string;
  }>;
}) => {
  const hem =
    term === "1st Term" ? FIRST : term === "2nd Term" ? SECOND : THIRD;
  const index = `${session}_${term}_${classRoom}_${subject}`;

  try {
    const { database } = await createAdminClient();

    // Validate scores format
    if (
      !Array.isArray(scores) ||
      !scores.every(
        (item) =>
          typeof item === "object" &&
          "studentId" in item &&
          "studentName" in item &&
          "firstTest" in item &&
          "secondTest" in item &&
          "project" in item &&
          "bnb" in item &&
          "assignment" in item &&
          "exam" in item &&
          "total" in item &&
          "grade" in item &&
          typeof item.studentId === "string" &&
          typeof item.studentName === "string" &&
          typeof item.firstTest === "string" &&
          typeof item.secondTest === "string" &&
          typeof item.project === "string" &&
          typeof item.bnb === "string" &&
          typeof item.assignment === "string" &&
          typeof item.exam === "string" &&
          typeof item.total === "string" &&
          typeof item.grade === "string"
      )
    ) {
      throw new Error("Invalid 'scores' format. Expected an array of objects with valid fields.");
    }
    const formattedScores = scores.map((score) => JSON.stringify(score));

    // Check for existing results
    const existingResults = await database.listDocuments(DATABASE_ID!, hem!, [
      Query.equal("index", index),
    ]);

    if (existingResults.documents.length > 0) {
      // Update existing document
      const updatedExistingResults = await database.updateDocument(
        DATABASE_ID!,
        hem!,
        existingResults.documents[0].$id,
        {
          scores: formattedScores,
        }
      );
      console.log(
        "Updated Successfully the existing results",
        updatedExistingResults
      );
      return parseStringify(updatedExistingResults);
    } else {
      // Create a new document
      const formattedScores = scores.map((score) => JSON.stringify(score));

      const resultCollection = await database.createDocument(
        DATABASE_ID!,
        hem!,
        ID.unique(),
        {
          index,
          classRoom,
          session,
          term,
          subject,
          scores: formattedScores,
        }
      );
      console.log("Result created successfully", resultCollection);
      return parseStringify(resultCollection);
    }
  } catch (error) {
    console.error(
      "Error uploading results array results",
      error,
      hem,
      index,
      classRoom,
      session,
      term,
      subject,
      scores
    );
    throw error;
  }
};

export const fetchResultData = async ({
  classRoom,
  session,
  term,
  subject,
}: {
  classRoom: string;
  session: string;
  term: string;
  subject: string;
}) => {
  const { database } = await createAdminClient();
  const hem =
    term === "1st Term" ? FIRST : term === "2nd Term" ? SECOND : THIRD;
  const index = `${session}_${term}_${classRoom}_${subject}`;
  const fetchedResults = await database.listDocuments(DATABASE_ID!, hem!, [
    Query.equal("index", index),
  ]);
  if (fetchedResults) {
    console.log("Rerieved the result data", fetchedResults);
    return parseStringify(fetchedResults.documents);
  }
  console.log("Nothing like such", fetchedResults);
  return null;
};
export const deleteClassResult = async ({
  classRoom,
  session,
  term,
  subject,
  scores,
}: {
  classRoom: string;
  session: string;
  term: string;
  subject: string;
  scores: string[];
}) => {
  const { database } = await createAdminClient();
  const hem =
    term === "1st Term" ? FIRST : term === "2nd Term" ? SECOND : THIRD;

  const dataToDelete = await fetchResultData({
    classRoom,
    session,
    term,
    subject,
  });
  if (dataToDelete) {
    console.log("Metadata retrieved successfully:", dataToDelete);
    await database.deleteDocument(DATABASE_ID!, hem!, dataToDelete[0].$id);
    console.log("Class scores deleted successfullt");
  }
  console.log("Nothing found ");
};
export const editResults = async ({
  classRoom,
  session,
  term,
  subject,
  scores,
}: {
  classRoom: string;
  session: string;
  term: string;
  subject: string;
  scores: string[]; // Array of new scores
}) => {
  const { database } = await createAdminClient();

  // Determine the correct term constant (FIRST, SECOND, THIRD)
  const hem =
    term === "1st Term" ? FIRST : term === "2nd Term" ? SECOND : THIRD;

  // Fetch the existing data for the given class, session, term, and subject
  const dataToEdit = await fetchResultData({
    classRoom,
    session,
    term,
    subject,
  });

  if (dataToEdit) {
    // Assuming the dataToEdit is an array of student records with studentId and current scores
    const studentRecords = dataToEdit;

    // Update the scores in each student record
    const updatedStudents = studentRecords.map((student, index) => {
      return {
        ...student, // Copy existing student data
        scores: scores[index], // Replace the old score with the new one from the scores[] array
      };
    });

    // Loop through each updated student and update their record in the database
    for (const student of updatedStudents) {
      const updatedResult = await database.updateDocument(
        DATABASE_ID!,
        hem!, // Term identifier (FIRST, SECOND, or THIRD)
        dataToEdit[0].$id, // Update the document by its ID
        {
          scores: student.scores, // Only update the scores for the student
        }
      );

      // Optionally handle the result for each student or log it
      console.log(`Updated result for student ${student.$id}`, updatedResult);
    }
  }
};
export const fetchResults = async ({
  classRoom,
  session,
  term,
  subject,
}: {
  classRoom: string;
  session: string;
  term: string;
  subject: string;
}) => {
  const hem =
    term === "1st Term" ? FIRST : term === "2nd Term" ? SECOND : THIRD;
  const index = `${session}_${term}_${classRoom}_${subject}`;

  try {
    const { database } = await createAdminClient();

    // Query the database for existing results
    const existingResults = await database.listDocuments(DATABASE_ID!, hem!, [
      Query.equal("index", index),
    ]);

    if (existingResults.documents.length === 0) {
      throw new Error("No results found for the given query.");
    }

    // Parse the result to return the desired format
    const result = existingResults.documents[0]; // assuming you want to fetch the first result

    console.log("Fetched results:", result);
    return result;

  } catch (error) {
    console.error("Error fetching results:", error);
    throw error;
  }
};