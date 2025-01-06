"use server";
import { createAdminClient } from "../appwrite";
import { ID, Query } from "node-appwrite";
import { parseStringify, generateStudentId } from "../utils";
// import { nanoid } from "nanoid";
const {
  // APPWRITE_POST_COLLECTION_ID: POST_COLLECTION_ID,
  // APPWRITE_STORAGE_ID: STORAGE_ID,
  APPWRITE_DATABASE_ID: DATABASE_ID,
  // NEXT_PUBLIC_APPWRITE_ENDPOINT: ENDPOINT,
  // APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  // NEXT_PUBLIC_APPWRITE_PROJECT: PROJECT_ID,
  APPWRITE_STUDENTS_COLLECTION_ID: STUDENTS_COLLECTION_ID,
  // APPWRITE_RESULT_COLLECTION_ID: RESULTS_ID,
  // APPWRITE_TRANSACTION_COLLECTION_ID: TRANSACTIONS_ID,
  // APPWRITE_CLASS_COLLECTION_ID: CLASSES,
  // APPWRITE_SCRATCHCARD_COLLECTION_ID: SCRATCHCARD_COLLECION_ID,
} = process.env;

// async function processStudentsInBatches(students, batchSize = 100) {
//   const total = students.length;
//   let processed = 0;

//   for (let i = 0; i < total; i += batchSize) {
//     const batch = students.slice(i, i + batchSize);
//     console.log("Processing batch", Math.ceil(i / batchSize) + 1, batch.length , students...);

//     const results = await createStudentDocumentsBatch(batch);
//     processed += batch.length;

//     results.forEach(({ success, student, error }) => {
//       if (success) {
//         console.log("✔ Successfully added:", student);
//       } else if (error){
//         console.error("❌ Failed to add: ",student, error);
//       }
//     });

//     console.log("Processed", processed , total ,students.);
//   }

//   console.log("All batches processed!");
// }

// async function createStudentDocumentsBatch(batch) {
//   const results = [];
//   for (const student of batch) {
//     try {
//       const { database } = await createAdminClient();
//       const response = await database.createDocument(
//         DATABASE_ID!,
//         STUDENTS_COLLECTION_ID!,
//         ID.unique(), // Generate a unique document ID
//         student
//       );
//       results.push({ success: true, student: student.fullName, response });
//     } catch (error) {
//       results.push({ success: false, student: student.fullName, error });
//     }
//   }
//   return results;
// }
export const inputStudentInfo = async ({
  name,
  classRoom,
  dateOfBirth,
  expirationTime,
  guardianInfo,
  studentId,
}: StudentInfoProps) => {
  try {
    const { database } = await createAdminClient();
    if (
      name.length === 0 ||
      dateOfBirth.length === 0 ||
      guardianInfo.length === 0
    ) {
      console.error(
        "Something is missing in this StudentsInfo",
        name,
        dateOfBirth,
        guardianInfo,
        classRoom,
        studentId,
        expirationTime
      );
    }
    const newStudentInfo = await database.createDocument(
      DATABASE_ID!,
      STUDENTS_COLLECTION_ID!,
      ID.unique(),
      {
        name,
        classRoom,
        dateOfBirth,
        guardianInfo,
        expirationTime,
        studentId,
      }
    );
    return parseStringify(newStudentInfo);
  } catch (error) {
    console.log("error Inputing the Students Info", error);
  }
};

export const deleteStudent = async ({ id }: { id: string }) => {
  try {
    const { database } = await createAdminClient();
    const deletedStudent = await database.deleteDocument(
      DATABASE_ID!,
      STUDENTS_COLLECTION_ID!,
      id
    );

    if (!deletedStudent) {
      throw new Error("Failed to delete -this User😭.");
    }
  } catch (error) {
    console.log("Error deleting the selected User:", error);
  }
};
export const editStudent = async ({
  id,
  updates,
}: {
  id: string;
  updates: Record<string, any>;
}) => {
  const { database } = await createAdminClient();

  try {
    const updatedStudent = await database.updateDocument(
      DATABASE_ID!,
      STUDENTS_COLLECTION_ID!,
      id,
      updates
    );

    return parseStringify(updatedStudent);
  } catch (error) {
    console.error("Error updating student:", error);
    throw new Error("Failed to update student.");
  }
};

export async function getStudentById(id: string) {
  try {
    const { database } = await createAdminClient();
    const result = await database.listDocuments(
      DATABASE_ID!,
      STUDENTS_COLLECTION_ID!,
      [Query.equal("studentId", id)]
    );
 if(!result){
   console.log("No student found with this ID.");
   return null;
 }
 console.log("the student found with this ID:", result.documents)
    return parseStringify(result.documents[0]);
  } catch (error) {
    console.log(error);
  }
}
export const listAllStudents = async () => {
  const { database } = await createAdminClient();
  
  const limit = 1000;             // Max number of documents per page
  const maxRecords = 10000;      // Maximum number of students to fetch (10,000 students in this case)
  let allStudents: any[] = [];   // Array to hold all fetched students
  let offset = 0;                // Start from the first document
  let totalFetched = 0;          // Keep track of how many records have been fetched
  
  while (totalFetched < maxRecords) {
    const newStudentInfo = await database.listDocuments(
      DATABASE_ID!,
      STUDENTS_COLLECTION_ID!,
      [
        Query.limit(limit),    // Limit the number of students per request
        Query.offset(offset),
        Query.notEqual("classRoom","GRADUATE")  // Skip the records we have already fetched
      ]
    );
    
    const students = newStudentInfo.documents; // Get the documents (students)
    
    allStudents = [...allStudents, ...students]; // Append to the results array
    totalFetched += students.length;  // Update the total count of fetched students
    
    // If the number of documents returned is less than the limit, we've reached the end
    if (students.length < limit) {
      break;  // Exit the loop when there are no more students to fetch
    }
    
    // Increment the offset for the next page
    offset += limit;
    
    // If we've already fetched the maximum number of students, exit the loop
    if (totalFetched >= maxRecords) {
      break;
    }
  }
  
  return allStudents;  // Return the full list of students (up to 10,000)
};
export const getStudentsByClass = async ({classRoom}: {classRoom: string}) => {
  const { database } = await createAdminClient();
  
  const limit = 100;             // Max number of documents per page
  const maxRecords = 10000;      // Maximum number of students to fetch (10,000 students in this case)
  let allStudents: any[] = [];   // Array to hold all fetched students
  let offset = 0;                // Start from the first document
  let totalFetched = 0;          // Keep track of how many records have been fetched
  
  while (totalFetched < maxRecords) {
    const newStudentInfo = await database.listDocuments(
      DATABASE_ID!,
      STUDENTS_COLLECTION_ID!,
      [
        Query.limit(limit),    // Limit the number of students per request
        Query.offset(offset),
        Query.equal("classRoom",classRoom)
          // Skip the records we have already fetched
      ]
    );
    
    const students = newStudentInfo.documents; // Get the documents (students)
    
    allStudents = [...allStudents, ...students]; // Append to the results array
    totalFetched += students.length;  // Update the total count of fetched students
    
    // If the number of documents returned is less than the limit, we've reached the end
    if (students.length < limit) {
      break;  // Exit the loop when there are no more students to fetch
    }
    
    // Increment the offset for the next page
    offset += limit;
    
    // If we've already fetched the maximum number of students, exit the loop
    if (totalFetched >= maxRecords) {
      break;
    }
  }
  
  return allStudents;  // Return the full list of students (up to 10,000)
};

export const getStudentsByClassRoom = async () => {
  const { database } = await createAdminClient();
  
  const limit = 100;             // Max number of documents per page
  const maxRecords = 10000;      // Maximum number of students to fetch (10,000 students in this case)
  let allStudents: any[] = [];   // Array to hold all fetched students
  let offset = 0;                // Start from the first document
  let totalFetched = 0;          // Keep track of how many records have been fetched
  
  while (totalFetched < maxRecords) {
    const newStudentInfo = await database.listDocuments(
      DATABASE_ID!,
      STUDENTS_COLLECTION_ID!,
      [
        Query.limit(limit),    // Limit the number of students per request
        Query.offset(offset),
        Query.equal("classRoom","JSS2B")  // Skip the records we have already fetched
      ]
    );
    //676984a00023abe907c6
    const students = newStudentInfo.documents; // Get the documents (students)
    
    allStudents = [...allStudents, ...students]; // Append to the results array
    totalFetched += students.length;  // Update the total count of fetched students
    
    // If the number of documents returned is less than the limit, we've reached the end
    if (students.length < limit) {
      break;  // Exit the loop when there are no more students to fetch
    }
    
    // Increment the offset for the next page
    offset += limit;
    
    // If we've already fetched the maximum number of students, exit the loop
    if (totalFetched >= maxRecords) {
      break;
    }
  }
  
  return allStudents;  // Return the full list of students (up to 10,000)
};
