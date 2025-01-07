"use server";

import { ID, Models, Query } from "node-appwrite";
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
      throw new Error(
        "Invalid 'scores' format. Expected an array of objects with valid fields."
      );
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
export const getStudentResults = async (
  studentId: string | undefined,
  term: string,
  classRoom: string
) => {
  try {
    const { database } = await createAdminClient();

    // Fetch all collections for terms
    const hem =
      term === "1st Term" ? FIRST : term === "2nd Term" ? SECOND : THIRD;

    const listStudentsResults = await database.listDocuments(
      DATABASE_ID!,
      hem!,
      [
        Query.equal("scores.*.studentName", studentId || ""),
        Query.equal("term", term),
        Query.equal("classRoom", classRoom),
      ]
    );

    // Return compiled results
    console.log(
      `Compiled results for student ${studentId}:`,
      listStudentsResults
    );
    return parseStringify(listStudentsResults);
  } catch (error) {
    console.error(`Error fetching results for student ${studentId}:`, error);
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
    console.log("Retrieved the result data", fetchedResults);
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
    console.log("Class scores deleted successful");
  }
  console.log("Nothing found ");
};
export const editResults = async ({
  classRoom,
  session,
  term,
  subject,
  action,
  studentId,
  newScore,
}: {
  classRoom: string;
  session: string;
  term: string;
  subject: string;
  action: "edit" | "delete"; // Action type: edit or delete
  studentId: string; // Unique ID of the student
  newScore?: string; // New score for editing (JSON stringified)
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

  if (dataToEdit?.length) {
    const studentRecord = dataToEdit.find(
      (record) => record.studentId === studentId
    );

    if (!studentRecord) {
      console.error(`Student with ID ${studentId} not found.`);
      return;
    }

    let updatedScores: any[] = JSON.parse(studentRecord.scores || "[]");

    if (action === "edit") {
      // Ensure valid newScore JSON string
      if (!newScore) {
        console.error("No new score provided for editing.");
        return;
      }

      let updatedScoreObj;
      try {
        updatedScoreObj = JSON.parse(newScore);
      } catch (error) {
        console.error("Invalid newScore JSON format.");
        return;
      }

      updatedScores = updatedScores.map((score) =>
        score.studentId === studentId ? { ...score, ...updatedScoreObj } : score
      );

      console.log(`Updated scores for student ${studentId}`, updatedScores);
    } else if (action === "delete") {
      // Remove the specific student's score
      updatedScores = updatedScores.filter(
        (score) => score.studentId !== studentId
      );

      console.log(`Deleted scores for student ${studentId}`, updatedScores);
    }

    // Update the database with the modified scores
    const updatedResult = await database.updateDocument(
      DATABASE_ID!,
      hem!,
      studentRecord.$id,
      {
        scores: JSON.stringify(updatedScores), // Save the updated scores back to the database
      }
    );

    console.log(
      `${
        action === "edit" ? "Edited" : "Deleted"
      } result for student ${studentId}`,
      updatedResult
    );

    // Optionally return updated data
    return updatedResult;
  } else {
    console.error(
      "No data found to edit or delete for the provided parameters."
    );
    return null;
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
interface Score {
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
}

export const myArray = async ({
  term,
  session,
  classRoom,
  studentId,
}: {
  term: string;
  classRoom: string;
  session: string;
  studentId: string;
}) => {
  try {
    const { database } = await createAdminClient();
    const hem =
      term === "1st Term" ? FIRST : term === "2nd Term" ? SECOND : THIRD;

    const AllResults = await database.listDocuments(DATABASE_ID!, hem!, [
      Query.equal("classRoom", classRoom),
      Query.equal("session", session),
      Query.equal("term", term),
    ]);

    if (AllResults.documents.length === 0) {
      throw new Error("No results found for the given query.");
    }

    console.log("All Results:", AllResults.documents);

    const studentScores = AllResults.documents
      .map((item) => {
        // Skip if no scores available
        if (!item.scores || item.scores.length === 0) {
          return null;
        }

        // Parse the stringified scores
        const parsedScores: Score[] = item.scores
          .map((scoreStr) => {
            try {
              const parsed = JSON.parse(scoreStr) as Score; // Cast to Score type
              console.log("Parsed Score:", parsed); // Log parsed score
              return parsed;
            } catch (e) {
              console.error("Error parsing score:", e);
              return null;
            }
          })
          .filter((score: Score): score is Score => score !== null); // Type guard for null filtering

        console.log("Parsed Scores for Document:", parsedScores); // Log parsed scores

        // Find the student by ID within the parsed scores
        const studentScore = parsedScores.find((score) => score.studentId === studentId) ?? null;

        if (studentScore) {
          // Add the subject to the filtered result
          return { subject: item.subject, score: studentScore };
        }
        return null;
      })
      .filter((result): result is { subject: string; score: Score } => result !== null); // Type guard for null filtering

    console.log("Filtered Student Scores with Subject:", studentScores);

    return studentScores;
  } catch (error) {
    console.error("Error:", error);
  }
};


// export const getStudentData = async (
//   dataArray: Models.Document[], // Array of Document objects, not stringified
//   studentId: string // The specific studentId
// ) => {
//   // Step 1: Filter out any invalid or null items
//   const validData = dataArray.filter(item => item !== null && item !== undefined);

//   // Step 2: Find the specific student by studentId
//   const student = validData.find((item) => item?.studentId === studentId);

//   // Step 3: Return the student as a stringified JSON, or undefined if not found
//   return student ? JSON.stringify(student) : undefined;
// };

