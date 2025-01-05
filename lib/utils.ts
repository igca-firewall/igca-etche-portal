
import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";
import qs from "query-string";

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
      dob: z.string().min(1, "Date of Birth is required").optional(),
      guardianContact: z
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
export const storeSessionInLocal = (
  firstName: string,
  lastName: string,
  email: string,
  phone: string
) => {
  const userData = { firstName, lastName, email, phone };
  // Encrypt the user data
  const encryptedData = encryptKey(JSON.stringify(userData));
  // Store encrypted data in localStorage
  localStorage.setItem("Trash", encryptedData);
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
export const profileFormSchema = z.object({
  firstName: z.string().min(2).max(15).optional(),
  lastName: z.string().min(2).max(15).optional(),
  phone: z.string().optional(),
  bio: z.string().min(1).max(60).optional(),
  instagram: z.string().url().optional(),
  facebook: z.string().url().optional(),
  whatsapp: z.string().url().optional(),
  telegram: z.string().url().optional(),
  youtube: z.string().url().optional(),
  // Add more fields if needed
});

export const dummyPosts = [
  {
    $id: "1",
    creator: {
      $id: "creator1",
      firstName: "John",
      lastName: "Doe",
      imageUrl: "/images/d.jpg",
    },
    caption: `The world we live in today is shaped by the technology we interact with. Every day, innovations are being made that fundamentally transform the way we live, work, and communicate. Whether it’s the smartphone in our pocket or the cloud storage that holds our precious memories, technology is everywhere. But have we stopped to ask ourselves how this constant evolution is affecting our daily lives and our sense of well-being?

    Let’s start with something as simple as social media. Platforms like Instagram, Twitter, and TikTok have revolutionized how we communicate and share our lives with others. While they offer an incredible opportunity to stay connected with friends, family, and even people from around the globe, there’s no denying the growing concerns about mental health. The constant barrage of ‘perfect’ images, curated lifestyles, and 24/7 news cycles can leave many feeling inadequate, anxious, and overwhelmed.
  
    Research shows that excessive social media usage can increase feelings of loneliness and depression. It’s ironic, isn’t it? A tool meant to connect us sometimes leaves us feeling more isolated than ever. But it’s not all doom and gloom. Many people have found community, solidarity, and support through online platforms, especially when physical distance makes face-to-face interaction impossible. It all boils down to how we use these platforms and the boundaries we set.
  
    Beyond social media, there’s artificial intelligence. AI is no longer just the stuff of science fiction. It’s here, and it’s deeply integrated into our everyday experiences. From the algorithms that recommend which movie to watch next on Netflix to virtual assistants like Alexa and Siri, AI is quietly shaping our decisions and behaviors. The rise of AI-powered chatbots and machine learning models is also changing industries like healthcare, education, and finance. The potential for AI to revolutionize how we diagnose diseases or make personalized recommendations is enormous. Yet, with great power comes great responsibility. As AI becomes smarter, ethical questions arise. How much decision-making power should we hand over to machines? What about data privacy and security concerns?
  
    Now, let’s talk about work. Remote work, once a rare perk, has become the norm for millions globally, thanks to the COVID-19 pandemic. Digital transformation has accelerated faster than anyone could have predicted. Tools like Zoom, Slack, and Google Workspace allow teams to collaborate seamlessly, regardless of location. But this shift has its pros and cons. On one hand, people enjoy the flexibility of working from anywhere. On the other hand, the lines between work and personal life have blurred, leading to burnout for many. Without the clear boundary of ‘leaving the office,’ many find themselves working longer hours than ever before. The future of work is hybrid, and the challenge moving forward will be finding that elusive balance.
  
    Then there’s the question of the environment. As much as we love the convenience of same-day deliveries, ride-hailing apps, and streaming services, they all come with an environmental cost. The rise of e-commerce and the increasing demand for cloud storage are leading to higher energy consumption and carbon emissions. Tech giants like Amazon, Google, and Microsoft are making strides to reduce their environmental impact by investing in renewable energy and carbon offsetting. But can technology truly be sustainable?
  
    Finally, let's discuss the concept of digital minimalism. In a world where we’re constantly connected, many are pushing back and seeking ways to disconnect. Digital minimalism is the idea of intentionally curating the technology we use to focus on what truly matters. It’s about finding purpose in our interactions with technology rather than mindlessly consuming content. This trend is gaining traction as people seek to reclaim their time and attention in an increasingly noisy digital landscape.
  
    The relationship between humans and technology is complex, evolving, and deeply personal. As we continue to innovate and push boundaries, it’s essential to ask tough questions about how we want technology to shape our future. Will it be a tool that empowers us, or will it dominate our lives? The choice is ours.`,

    location: "Yosemite National Park, USA",
    tags: "#nature #peaceful #outdoors",
    $createdAt: "2024-08-01T10:00:00Z",
    imageUrl: "/images/OutThere.png",
  },
  {
    $id: "2",
    creator: {
      $id: "creator2",
      firstName: "Jane",
      lastName: "Smith",
      imageUrl: "/images/d.jpg",
    },
    caption:
      "A fantastic day spent gaming with friends! Time flies when you're having fun!",
    location: "Tokyo, Japan",
    tags: "#gaming #fun #friends",
    $createdAt: "2024-09-15T14:30:00Z",
    imageUrl: "/images/gaming.png",
  },
  {
    $id: "3",
    creator: {
      $id: "creator3",
      firstName: "Alice",
      lastName: "Wong",
      imageUrl: "/images/d.jpg",
    },
    caption:
      "Just got my ticket to the most awaited concert of the year. Can't wait!",
    location: "Sydney, Australia",
    tags: "#concert #music #excitement",
    $createdAt: "2024-09-18T19:00:00Z",
    imageUrl: "/images/ticket red.png",
  },
  {
    $id: "4",
    creator: {
      $id: "creator4",
      firstName: "Michael",
      lastName: "Brown",
      imageUrl: "/images/d.jpg",
    },
    caption: "Casino night! Testing my luck on the poker table, wish me luck!",
    location: "Las Vegas, USA",
    tags: "#casino #poker #nightlife",
    $createdAt: "2024-08-20T22:00:00Z",
    imageUrl: "/images/chip.jpg",
  },
  {
    $id: "5",
    creator: {
      $id: "creator5",
      firstName: "Emma",
      lastName: "Davis",
      imageUrl: "/images/d.jpg",
    },
    caption:
      "Hiking up the tallest mountain I've ever climbed, but the view was worth every step!",
    location: "Mount Fuji, Japan",
    tags: "#hiking #adventure #mountains",
    $createdAt: "2024-09-05T08:45:00Z",
    imageUrl: "/images/OutThere.png",
  },
  {
    $id: "6",
    creator: {
      $id: "creator6",
      firstName: "Liam",
      lastName: "Miller",
      imageUrl: "/images/d.jpg",
    },
    caption: "Gaming tournament vibes! Came in with my A-game, ready to win!",
    location: "Berlin, Germany",
    tags: "#gaming #tournament #competition",
    $createdAt: "2024-09-10T13:00:00Z",
    imageUrl: "/images/gaming.png",
  },
  {
    $id: "7",
    creator: {
      $id: "creator7",
      firstName: "Olivia",
      lastName: "Wilson",
      imageUrl: "/images/d.jpg",
    },
    caption:
      "Ticket to a night of magic and performances! Let's go see some Broadway!",
    location: "New York, USA",
    tags: "#broadway #tickets #magic",
    $createdAt: "2024-09-12T19:30:00Z",
    imageUrl: "/images/ticket red.png",
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
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
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
export function generateAvatar(name: string, size = 50): string {
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
