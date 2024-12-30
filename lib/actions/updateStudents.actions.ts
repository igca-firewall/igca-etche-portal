"use server"
import { Query } from "appwrite";
import { createAdminClient } from "../appwrite";
import { parseStringify } from "../utils";
import { getStudentsByClass, listAllStudents } from "./studentsData.actions";
import { addresults } from "./results.actions";


const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const STUDENTS_COLLECTION_ID = process.env.  APPWRITE_STUDENTS_COLLECTION_ID;
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
    const response = await database.listDocuments(
      DATABASE_ID!,
      collectionId,
      [
        Query.limit(limit),
        Query.offset(offset),
      ]
    );

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
export const updateScoresWithClassRoom = async ({ classRoom }: { classRoom: string }) => {
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
      // Step 1: Fetch all students in the selected class
      const students = await getStudentsByClass({ classRoom });
      console.log("All students in the class:", students);
  
      // Step 2: Fetch scores for each student based on class, subject, session, and term
      const allScores = await Promise.all(
        students.map(async (student) => {
          const studentId = student.studentId;
          const scores = await listAllScores({
            studentId,
           
          });
  
          // Format each score as an object (not stringified)
          return scores.map((score) => ({
            studentId: studentId,
            studentName: student.name, // Assuming `name` is part of the student data
            firstTest: score.firstTest || "0", // Default to "0" if undefined
            secondTest: score.secondTest || "0",
            project: score.project || "0",
            bnb: score.bnb || "0",
            assignment: score.assignment || "0",
            exam: score.exam || "0",
            total: score.total || "0",
            grade: score.grade || "F", // Default to "F" if grade is not available
          }));
        })
      );
  
      // Flatten the nested array of score objects
      const scores = allScores.flat();
  
      // Step 3: Call the addresults function with the gathered data
      const result = await addresults({
        classRoom,
        session,
        term,
        subject,
        scores,
      });
  
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
          Query.equal('studentId', [studentId]), // Filter scores by studentId
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
  