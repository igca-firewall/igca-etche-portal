"use server";
import { Query } from "appwrite";
import { createAdminClient } from "../appwrite";
import { generateavatar, generateAvatar, parseStringify } from "../utils";
import { getStudentsByClass, listAllStudents } from "./studentsData.actions";
import { addresults } from "./results.actions";

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const STUDENTS_COLLECTION_ID = process.env.APPWRITE_STUDENTS_COLLECTION_ID;
const SCORES_COLLECTION_ID = process.env.APPWRITE_SCORES_COLLECTION_ID;
// const {
//     //     APPWRITE_POST_COLLECTION_ID: POST_COLLECTION_ID,
//     //     APPWRITE_STORAGE_ID: STORAGE_ID,
//     APPWRITE_COMPILED_ID : COMPILED_RESULTS_ID,

//     //     NEXT_PUBLIC_APPWRITE_ENDPOINT: ENDPOINT,
//     //     NEXT_PUBLIC_APPWRITE_PROJECT: PROJECT_ID,
//          APPWRITE_STUDENTS_COLLECTION_ID: APPWRITE_STUDENTS_COLLECTION_ID,
//     APPWRITE_RESULT_COLLECTION_ID: RESULTS_ID,
//     //     APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
//     //     APPWRITE_TRANSACTION_COLLECTION_ID: TRANSACTIONS_ID,
//     APPWRITE_SCORES_COLLECTION_ID: SCORES_ID,
//     //     APPWRITE_SCRATCHCARD_COLLECTION_ID: SCRATCHCARD_COLLECION_ID,
//     // APPWRITE_SUBJECT_COLLECTION_ID: SUBJECTS_ID,
//   } = process.env;

export const listAllDocuments = async (collectionId: string) => {
  const { database } = await createAdminClient();

  const limit = 1000;
  const maxRecords = 10000;
  let allDocuments: any[] = [];
  let offset = 0;
  let totalFetched = 0;

  while (totalFetched < maxRecords) {
    const response = await database.listDocuments(DATABASE_ID!, collectionId, [
      Query.limit(limit),
      Query.offset(offset),
    ]);

    const documents = response.documents;

    allDocuments = [...allDocuments, ...documents];
    totalFetched += documents.length;

    if (documents.length < limit) {
      break;
    }

    offset += limit;
  }

  return allDocuments;
};
export const updateScoresWithClassRoom = async ({
  classRoom,
}: {
  classRoom: string;
}) => {
  const { database } = await createAdminClient();

  // Step 1: List all students in the specified class
  const students = await getStudentsByClass({ classRoom });
  console.log("AllStudents", students);

  // Step 2: Create a mapping of student IDs to classRoom values
  const studentClassRoomMap = students.reduce((map, student) => {
    map[student.studentId] = student.classRoom;
    return map;
  }, {} as Record<string, string>);

  // Step 3: Gather all scores requiring updates in one step
  const allScores = await Promise.all(
    students.map(async (student) => {
      const studentId = student.studentId;
      const scores = await listAllScores({ studentId });
      return scores
        .filter((score) => score.classRoom !== studentClassRoomMap[studentId]) // Filter scores that need updates
        .map((score) => ({
          id: score.$id,
          classRoom: studentClassRoomMap[studentId], // Map score to its updated classRoom
        }));
    })
  );

  // Flatten the nested array of scores
  const updatedScores = allScores.flat();

  // Step 4: Update scores one by one
  let updatedCount = 0;

  for (const score of updatedScores) {
    try {
      await database.updateDocument(
        DATABASE_ID!,
        SCORES_COLLECTION_ID!,
        score.id,
        { classRoom: score.classRoom } // Update the classRoom field
      );
      console.log(`Successfully updated score with ID: ${score.id}`);
      updatedCount++;
    } catch (error) {
      console.error(`Failed to update score with ID: ${score.id}`, error);
    }
  }

  if (updatedCount === 0) {
    console.log("No updates were required.");
    return null;
  }

  // Update completed successfully
  console.log(`${updatedCount} updates were successful.`);

  // Optionally perform other actions after the update is done, like updating UI or state
  // For example, you could display a success message, refresh the data, or redirect

  // Example: Set a success state if you're using React state for UI feedback

  // You can also trigger any additional side effects, such as navigating or updating other UI components
  return updatedCount;
  // Return the count of updated scores
};

export const prepareAndAddResults = async ({
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
  try {
    // Step 1: Fetch all scores for the given class, term, session, and subject
    const scores = await listAllScoresBy({
      classRoom,
      session,
      term,
      subject,
    });
    console.log("Scores", scores);
    // Step 2: Format the scores
    const formattedScores = scores.map((score) => ({
      studentId: score.studentId,
      studentName: score.name || "Unknown", // Assuming `studentName` is part of the scores
      firstTest: score.firstTest || "0",
      secondTest: score.secondTest || "0",
      project: score.project || "0",
      bnb: score.bnb || "0",
      assignment: score.assignment || "0",
      exam: score.exam || "0",
      total: score.total || "0",
      grade: score.grade || "F",
    }));
    console.log("formatted", formattedScores);
    // Step 3: Add the results
    const result = await addresults({
      classRoom,
      session,
      term,
      subject,
      scores: formattedScores,
    });
    console.log("Results", result);
    return result; // Return the result of addresults
  } catch (error) {
    console.error("Error preparing and adding results:", error);
    throw error;
  }
};

export const listAllScores = async ({ studentId }: { studentId: string }) => {
  const { database } = await createAdminClient();

  const limit = 3630; // Max number of documents per page
  const maxRecords = 3630; // Maximum number of records to fetch
  let allScores: any[] = []; // Array to hold all fetched scores
  let offset = 0; // Start from the first document
  let totalFetched = 0; // Keep track of how many records have been fetched

  while (totalFetched < maxRecords) {
    const newScoresInfo = await database.listDocuments(
      DATABASE_ID!,
      SCORES_COLLECTION_ID!,
      [
        Query.limit(limit), // Limit the number of students per request
        Query.offset(offset), // Skip the records we have already fetched
        Query.equal("studentId", [studentId]),
    ]
    );

    const scores = newScoresInfo.documents; // Get the documents (scores)

    allScores = [...allScores, ...scores]; // Append to the results array
    totalFetched += scores.length; // Update the total count of fetched students

    // If the number of documents returned is less than the limit, we've reached the end
    if (scores.length < limit) {
      break; // Exit the loop when there are no more scores to fetch
    }

    // Increment the offset for the next page
    offset += limit;

    // If we've already fetched the maximum number of students, exit the loop
    if (totalFetched >= maxRecords) {
      break;
    }
  }

  return allScores; // Return the full list of scores for the given studentId
};
export const listAllScoresBy = async ({
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

  const limit = 3630; // Max number of documents per page
  const maxRecords = 6630; // Maximum number of records to fetch
  let allScores: any[] = []; // Array to hold all fetched scores
  let offset = 0; // Start from the first document
  let totalFetched = 0; // Keep track of how many records have been fetched

  while (totalFetched < maxRecords) {
    const newScoresInfo = await database.listDocuments(
      DATABASE_ID!,
      SCORES_COLLECTION_ID!,
      [
        Query.limit(limit), // Limit the number of students per request
        Query.offset(offset), // Skip the records we have already fetched
        Query.equal("classRoom", [classRoom]),
        Query.equal("term", [term]),
        Query.equal("session", [session]),
        Query.equal("subject", [subject]), // Filter scores by studentId
      ]
    );

    const scores = newScoresInfo.documents; // Get the documents (scores)

    allScores = [...allScores, ...scores]; // Append to the results array
    totalFetched += scores.length; // Update the total count of fetched students

    // If the number of documents returned is less than the limit, we've reached the end
    if (scores.length < limit) {
      break; // Exit the loop when there are no more scores to fetch
    }

    // Increment the offset for the next page
    offset += limit;

    // If we've already fetched the maximum number of students, exit the loop
    if (totalFetched >= maxRecords) {
      break;
    }
  }

  return allScores; // Return the full list of scores for the given studentId
};
export const updateStudentsImages = async ({
  classRoom,
  imageMap, // Map of student ids to image URLs
}: {
  classRoom: string;
  imageMap: { [studentId: string]: string }; // Student ID to image URL mapping
}) => {
  const { database } = await createAdminClient();

  // Step 1: Fetch all students in the specified class
  const students = await getStudentsByClass({ classRoom });
  console.log("Fetched Students:", students);

  if (students.length === 0) {
    console.log("No students found in the specified class.");
    return { updatedCount: 0, failed: [] }; // Return empty results when no students are found
  }

  // Sequentially generate and update each student's image
  let updatedCount = 0;
  const failed = [];

  for (const student of students) {
    try {
      // Get the image URL for the current student from the imageMap
      const imageUrl = imageMap[student.$id]; // Find the image based on the student's ID

      if (!imageUrl) {
        throw new Error(
          `No image URL found for student with ID: ${student.$id}`
        );
      }

      // Update the student's document with the new image URL
      await database.updateDocument(
        DATABASE_ID!,
        STUDENTS_COLLECTION_ID!,
        student.$id,
        { image: imageUrl } // Update the image attribute
      );

      console.log(
        `Successfully updated student with ID: ${student.$id} with image: ${imageUrl}`
      );
      updatedCount++;
    } catch (error) {
      console.error(`Failed to update student with ID: ${student.$id}`, error);
      failed.push(student.$id); // Record the failed student IDs
    }
  }

  if (updatedCount === 0) {
    console.log("No updates were performed.");
    return { updatedCount: 0, failed }; // Return failed updates
  }

  console.log(`Successfully updated ${updatedCount} student documents.`);
  return { updatedCount, failed }; // Return count of successful updates and list of failed updates
};

// export function generateAvatar(name: string): string {
//   const firstLetter = name.trim().charAt(0).toUpperCase() || "?"; // Default to "?" if no valid name

//   // Predefined set of 15 colors that complement orange
//   const colors = ["#FF5722", "#FF9800", "#FFC107", "#FFEB3B", "#F57C00"];

//   const backgroundColor = colors[Math.floor(Math.random() * colors.length)];

//   // Create a smaller canvas
//   const size = 50; // Smaller size
//   const canvas = createCanvas(size, size);
//   const context = canvas.getContext("2d");

//   if (context) {
//     // Fill background color
//     context.fillStyle = backgroundColor;
//     context.fillRect(0, 0, size, size);

//     // Draw the first letter
//     context.font = "bold 20px Arial"; // Smaller font
//     context.textAlign = "center";
//     context.textBaseline = "middle";
//     context.fillStyle = "#fff"; // Text color
//     context.fillText(firstLetter, size / 2, size / 2);
//   }

//   // Return the avatar as a Base64-encoded PNG
//   return canvas.toDataURL("image/png");
// }
