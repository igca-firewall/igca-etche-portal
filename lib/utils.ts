
import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";
import qs from "query-string";
import CryptoJS from "crypto-js";
import { z } from "zod";
import { nanoid } from "nanoid";
// import QRCode from "qrcode";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
/* eslint-disable no-prototype-builtins */

// export function getColor(user: any): string {
//   // Example logic to select a color. Customize as needed.
//   const index = Math.floor(Math.random() * colors.length);
//   return colors[index];
// }

// FORMAT DATE TIME
export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    month: "short", // abbreviated month name (e.g., 'Oct')
    day: "numeric", // numeric day of the month (e.g., '25')
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const dateDayOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    year: "numeric", // numeric year (e.g., '2023')
    month: "2-digit", // abbreviated month name (e.g., 'Oct')
    day: "2-digit", // numeric day of the month (e.g., '25')
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "short", // abbreviated month name (e.g., 'Oct')
    year: "numeric", // numeric year (e.g., '2023')
    day: "numeric", // numeric day of the month (e.g., '25')
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const formattedDateTime: string = new Date(dateString).toLocaleString(
    "en-US",
    dateTimeOptions
  );

  const formattedDateDay: string = new Date(dateString).toLocaleString(
    "en-US",
    dateDayOptions
  );

  const formattedDate: string = new Date(dateString).toLocaleString(
    "en-US",
    dateOptions
  );

  const formattedTime: string = new Date(dateString).toLocaleString(
    "en-US",
    timeOptions
  );

  return {
    dateTime: formattedDateTime,
    dateDay: formattedDateDay,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

// export function formatAmount(amount: number): string {
//   const formatter = new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: "USD",
//     minimumFractionDigits: 2,
//   });

//   return formatter.format(amount);
// }

export const parseStringify = <T>(value: T): T =>
  JSON.parse(JSON.stringify(value));

export const removeSpecialCharacters = (value: string) => {
  return value.replace(/[^\w\s]/gi, "");
};

interface UrlQueryParams {
  params: string;
  key: string;
  value: string;
}

export function formUrlQuery({ params, key, value }: UrlQueryParams) {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

// export function getAccountTypeColors(type: AccountTypes) {
//   switch (type) {
//     case "depository":
//       return {
//         bg: "bg-blue-25",
//         lightBg: "bg-blue-100",
//         title: "text-blue-900",
//         subText: "text-blue-700",
//       };

//     case "credit":
//       return {
//         bg: "bg-success-25",
//         lightBg: "bg-success-100",
//         title: "text-success-900",
//         subText: "text-success-700",
//       };

//     default:
//       return {
//         bg: "bg-green-25",
//         lightBg: "bg-green-100",
//         title: "text-green-900",
//         subText: "text-green-700",
//       };
//   }
// }

// export function countTransactionCategories(
//   transactions: Transaction[]
// ): CategoryCount[] {
//   const categoryCounts: { [category: string]: number } = {};
//   let totalCount = 0;

//   // Iterate over each transaction
//   transactions &&
//     transactions.forEach((transaction) => {
//       // Extract the category from the transaction
//       const category = transaction.category;

//       // If the category exists in the categoryCounts object, increment its count
//       if (categoryCounts.hasOwnProperty(category)) {
//         categoryCounts[category]++;
//       } else {
//         // Otherwise, initialize the count to 1
//         categoryCounts[category] = 1;
//       }

//       // Increment total count
//       totalCount++;
//     });

//   // Convert the categoryCounts object to an array of objects
//   const aggregatedCategories: CategoryCount[] = Object.keys(categoryCounts).map(
//     (category) => ({
//       name: category,
//       count: categoryCounts[category],
//       totalCount,
//     })
//   );

//   // Sort the aggregatedCategories array by count in descending order
//   aggregatedCategories.sort((a, b) => b.count - a.count);

//   return aggregatedCategories;
// }

// export function extractCustomerIdFromUrl(url: string) {
//   // Split the URL string by '/'
//   const parts = url.split("/");

//   // Extract the last part, which represents the customer ID
//   const customerId = parts[parts.length - 1];

//   return customerId;
// }

// export function encryptId(id: string) {
//   return btoa(id);
// }

// export function decryptId(id: string) {
//   return atob(id);
// }

// export const getTransactionStatus = (date: Date) => {
//   const today = new Date();
//   const twoDaysAgo = new Date(today);
//   twoDaysAgo.setDate(today.getDate() - 2);

//   return date > twoDaysAgo ? "Processing" : "Success";
// };

export const authFormSchema = (type: string, role: string) => {
  return z
    .object({
      email: z.string().email("Invalid email").min(1, "Email is required"),
      password: z.string().min(6, "Password must be at least 6 characters"),
      role: z.enum(["admin", "teacher", "viewer"]),
      firstName: z.string().min(1, "First Name is required").optional(), // Optional for non-relevant roles
      lastName: z.string().min(1, "Last Name is required").optional(),
      phone: z.string().min(1, "Phone is required").optional(),
      dob: z
      .string()
      .min(1, "Date of Birth is required")
      .optional() // Make it optional if no date is selected
      ,   guardianContact: z
        .string()
        .min(1, "Guardian Contact is required")
        .optional(),
      subject: z
        .string()
        .min(1, "Subject Specialization is required")
        .optional(),
      adminContact: z.string().min(1, "Admin Contact is required").optional(),
      adminCode: z.string().min(1, "Admin Code is required").optional(),
      adminId: z.string().min(1, "Admin ID is required").optional(),
    })
    .refine(
      (data) => {
        if (role === "admin") {
          return (
            data.adminContact &&
            data.adminCode &&
            data.adminId &&
            data.firstName
          );
        }
        if (role === "teacher") {
          return data.phone && data.subject && data.firstName;
        }
        if (role === "viewer") {
          return data.dob && data.guardianContact && data.firstName;
        }
        return true;
      },
      {
        message: "Required fields are missing for the selected role.",
        path: [], // Error applies to the entire object
      }
    );
};

export const PostValidation = z.object({
  location: z
    .string()
    .max(15, { message: "Maximum of 15 characters" })
    .optional(),
  tags: z.string(),
  file: z.custom<File[]>().optional(),
  caption: z.string().min(2, { message: "Invalid Post Details" }).max(2200),
});
export const Profile = z.object({
  file: z.custom<File[]>(),
  caption: z.string().min(2, { message: "Invalid Post Details" }).max(2200),
});

export const generateUniqueId = () => {
  return nanoid();
};

export const storeSessionInLocalStorage = () => {
  if (typeof window !== "undefined") {
    // const sixMonthsInMilliseconds = 183 * 24 * 60 * 60 * 1000; // Approximate milliseconds for 6 months
    // const expirationTime = (Date.now() + sixMonthsInMilliseconds).toString();
    const uniqueId = generateUniqueId();
    localStorage.setItem("cookieFall", uniqueId);
    // Store expiration time as a string
  }
};

export const LocalStorageManager = () => {
  try {
    localStorage.removeItem("cookieSupport");
    localStorage.removeItem("cookieFall");
    localStorage.removeItem("Trash");
    localStorage.removeItem("color");
  } catch (error) {
    console.log("Error locally managing log-out", error);
    return null;
  }
  //
};

export const convertFileToUrl = (
  input: File | string | null | undefined
): string => {
  if (typeof input === "string") {
    // If input is a string, assume it is a URL
    return input;
  } else if (input instanceof File) {
    // If input is a File, create an object URL
    return URL.createObjectURL(input);
  }
  console.warn("Invalid input provided to convertFileToUrl");
  return ""; // Return an empty string or a default URL if necessary
};

export function formatDateString(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("en-US", options);

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${formattedDate} at ${time}`;
}

//
export const multiFormatDateString = (timestamp: string = ""): string => {
  const timestampNum = Math.round(new Date(timestamp).getTime() / 1000);
  const date: Date = new Date(timestampNum * 1000);
  const now: Date = new Date();

  const diff: number = now.getTime() - date.getTime();
  const diffInSeconds: number = diff / 1000;
  const diffInMinutes: number = diffInSeconds / 60;
  const diffInHours: number = diffInMinutes / 60;
  const diffInDays: number = diffInHours / 24;

  switch (true) {
    case Math.floor(diffInDays) >= 30:
      return formatDateString(timestamp);
    case Math.floor(diffInDays) === 1:
      return `${Math.floor(diffInDays)}d`;
    case Math.floor(diffInDays) > 1 && diffInDays < 30:
      return `${Math.floor(diffInDays)}d`;
    case Math.floor(diffInHours) >= 1:
      return `${Math.floor(diffInHours)}h`;
    case Math.floor(diffInMinutes) >= 1:
      return `${Math.floor(diffInMinutes)}m`;
    default:
      return "Just now";
  }
};

// export const checkIsLiked = (likeList: string[], userId: string) => {
//   return likeList.includes(userId);
// };

export function getRandomColor(): string {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
export function generateAvatar(name: string): string {
  const firstLetter = name.trim().charAt(0).toUpperCase() || "?"; // Default to "?" if no valid name

  // Predefined set of 15 colors that complement orange
  const colors = ["#FF5722", "#FF9800", "#FFC107", "#FFEB3B", "#F57C00"];

  const backgroundColor = colors[Math.floor(Math.random() * colors.length)];

  // Create a smaller canvas
  const canvas = document.createElement("canvas");
  const size = 50; // Smaller size
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");

  if (context) {
    // Fill background color
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, size, size);

    // Draw the first letter
    context.font = "bold 20px Arial"; // Smaller font
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "#fff"; // Text color
    context.fillText(firstLetter, size / 2, size / 2);
  }

  return canvas.toDataURL("image/png");
}

// export const generatedImage = generateAvatar(localUserData?.firstName || localUserData?.lastName || "")
export const storeClassAndRest = (
  classRoom: string,
  term: string,
  session: string,
 
) => {
  const userData = { classRoom, session, term };
  // Encrypt the user data
  const encryptedData = encryptKey(JSON.stringify(userData));
  // Store encrypted data in localStorage
  localStorage.setItem("Particles_Class_Stuff_Just_Leave it...", encryptedData);
};
export const store = (color: string) => {
  const userData = { color };
  // Encrypt the user data
  const encryptedData = encryptKey(JSON.stringify(userData));
  // Store encrypted data in localStorage
  localStorage.setItem("color", encryptedData);
};

// export const getCurrentLocation = () => {
//   navigator.geolocation.getCurrentPosition(
//     (position) => {
//       const coord = position.coords;
//       console.log(coord.accuracy);
//       console.log(coord.latitude);
//       console.log(coord.longitude);
//     },
//     (err) => {
//       console.log(`Error: ${err.message}`);
//     },
//     {
//       enableHighAccuracy: true,
//       timeout: 5000,
//       maximumAge: 0,
//     }
//   );
// };
// Encrypt a string using base64 with proper handling for Unicode characters
export function encryptKey(passkey: string) {
  return btoa(
    encodeURIComponent(passkey).replace(/%([0-9A-F]{2})/g, (match, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    )
  );
}

// Decrypt a base64 string back to its original Unicode form
export function decryptKey(passkey: string) {
  return decodeURIComponent(
    atob(passkey)
      .split("")
      .map((char) => "%" + ("00" + char.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
}

// utils/cookieUtils.ts
// export const getCookie = (name: string): string | null => {
//   const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
//   return match ? match[2] : null;
// };

// export const generateCoverImage = () => {
//   // Generate a placeholder cover image with a neutral gray background color
//   return `https://via.placeholder.com/600x200/B0B0B0/B0B0B0`;
// };
// export const generateQRCode = async (
//   userId: string,
//   baseUrl: string
// ): Promise<string | null> => {
//   // Construct the URL for the user
//   const userUrl = `${baseUrl}/${userId}`;
//   // Generate the QR code with the user URL
//   const qrCodeBuffer = await QRCode.toBuffer(userUrl);
//   const qrCodeBase64 = qrCodeBuffer.toString("base64");
//   const qrCodeImageSrc = `data:image/png;base64,${qrCodeBase64}`;
//   console.log("QR code base64 image src:", qrCodeImageSrc);

//   return qrCodeImageSrc;
// };

export const dummyPosts = [
  {
    $id: "1",
    creator: {
      $id: "creator1",
      firstName: "Administrator",
      lastName: "",
      imageUrl: "/images/logo.jpg",
    },
    caption: ` Joy Ezechikamnayo, a proud alumna of Intellectual Giants Christian Academy, makes history as the Governor of Abia State! 🎓✨ From our classrooms to the corridors of leadership, her journey is a testament to the excellence we nurture. Join us at IGCA, where future leaders are made. 🌟📚 #IntellectualGiants #LeadershipStartsHere #ProudAlumni"`,

    location: "Yosemite National Park, USA",
    tags: " #IntellectualGiants #LeadershipStartsHere #ProudAlumni",
    $createdAt: "2024-08-01T10:00:00Z",
    imageUrl: "/images/tenage.jpeg",
    verified: true
  },
  {
    $id: "2",
    creator: {
      $id: "creator2",
      firstName: "Administrator",
      lastName: "",
      imageUrl: "/images/logo.jpg",
    },
    caption:
      "🌟 Meet Our Visionary Leader! 🌟The Director of Intellectual Giants Christian Academy is the driving force behind our commitment to excellence. With a passion for nurturing young minds and shaping future leaders, their guidance ensures every student thrives academically, morally, and socially. Join us on this journey of greatness! 🎓✨ #MeetOurDirector #InspiringLeadership #IntellectualGiants",
    location: "Nigeria",
    tags: "",
    $createdAt: "2024-09-15T14:30:00Z",
    imageUrl: "/images/director.jpeg",
    verified: true
  },
 
];
// themes.ts
// Define the structure of the theme object

// Theming object with improved structure and organization

export const signInSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const signUpSchema = signInSchema.extend({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  role: z.enum(["teacher", "admin", "parent"]),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
export const generateScratchCardCode = (length = 8): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () =>
    characters.charAt(Math.floor(Math.random() * characters.length))
  ).join("");
};
export const generateStudentId = (length = 3): string => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length }, () =>
    characters.charAt(Math.floor(Math.random() * characters.length))
  ).join("");
};
export const subjects = [
  "English Language",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "Economics",
  "Business Studies",
  "History",
  "Geography",
  "Art & Design",
  "Physical Education",
  "Foreign Language (French, Spanish)",
  "Religious Studies",
  "Design & Technology",
  "Music",
];

export const classOrder = [
  // Class options

  "JSS1A",
  "JSS1B",
  "JSS1C",
  "JSS2A",
  "JSS2B",
  "JSS2C",
  "JSS3A",
  "JSS3B",
  "JSS3C",
  "SS1A",
  "SS1B",
  "SS1C",
  "SS2A",
  "SS2B",
  "SS2C",
  "SS3A",
  "SS3B",
  "SS3C",
];
export function generateavatar(name: string, size = 50): string {
  // Get the first two letters and convert them to uppercase
  const firstTwoLetters = name.charAt(0).toUpperCase() + name.charAt(1).toUpperCase() || "?";

  // New bright and vibrant color palette
  const colors = [
    "#FF0000", // Bright Red
    "#FF5733", // Funshi Orange
    "#FF4081", // Bright Pink
    "#FF1F4C", // Bright Red-Pink
    "#D500F9", // Bright Purple
    "#00BFFF", // Deep Sky Blue
    "#FF9800", // Bright Orange
    "#E91E63", // Hot Pink
    "#00FF00", // Neon Green
    "#00BCD4", // Bright Cyan
    "#3F51B5", // Bold Blue
    "#009688", // Sharp Teal
    "#8A2BE2", // Blue-Violet
    "#FF33B5", // Fuchsia Pink
    "#FF6F00", // Amber Orange
    "#FF1493", // Deep Pink
    "#1E90FF", // Dodger Blue
    "#F44336", // Bright Red
    "#FFEB3B", // Bright Yellow
    "#9C27B0", // Vibrant Purple
    "#673AB7", // Deep Purple
    "#2196F3", // Vivid Blue
    "#FF4500", // Orange Red
    "#00FF7F", // Bright Spring Green
    "#FF6600", // Vivid Orange
    "#800080", // Purple
    "#FF00FF", // Magenta
    "#32CD32", // Lime Green
    "#FF8C00", // Dark Orange
    "#00FFFF", // Aqua
  ];

  // Select a random color from the list
  const backgroundColor = colors[Math.floor(Math.random() * colors.length)];

  // Create a canvas element
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }

  // Draw background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, size, size);

  // Draw text (the first two letters of the name)
  ctx.fillStyle = "white";
  ctx.font = `${size / 2}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(firstTwoLetters, size / 2, size / 2); // Use firstTwoLetters here

  
  return canvas.toDataURL("image/png");
}
export const encrypt = (text: string) => {
  return CryptoJS.AES.encrypt(text, "Xed").toString();
};

// Function to decrypt the string
export const decrypt = (encryptedText: string) => {
  const bytes = CryptoJS.AES.decrypt(encryptedText, "Xed");
  return bytes.toString(CryptoJS.enc.Utf8);
};
export function formatSubject(subject: string): string {
  return subject.replace(/([a-z])([A-Z])/g, '$1 $2');
}