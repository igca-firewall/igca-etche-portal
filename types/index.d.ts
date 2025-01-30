/* eslint-disable no-unused-vars */

declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

type Particles = {
  bio: string;
  coverUrl: string;
  Links: string[];
  username?: string;
  gender?: string;
  user: string;
  qrCodeLink?: string;
  qrId: string;
  color: string; // Add the color field
};

declare type LoginUser = {
  password: string;

  email: string;
};
interface SocialLink {
  name: string;
  url: string;
  icon: string;
}
declare type RoomMetadata = {
  creatorId: string;
  email: string;
  title: string;
};

declare type CreateDocumentParams = {
  userId: string;
  email: string;
};
declare type ShareDocumentParams = {
  roomId: string;
  email: string;
  userType: UserType;
  updatedBy: User;
};

interface User {
  $id: string;
  phone: string;
  email: string;
  name: string;
  userId: string;
  adminId: string;
  adminCode: string;
  adminContact: string;
  firstName?: string;
  lastName?: string;
  role: string;
  guardianContact: string;
  // name: string;
  // address1: string;
  // city: string;
  // state: string;
  // postalCode: string;
  dateOfBirth?: string;
  // ssn: string;
  image: string;
}
interface AuthContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  isLoading: boolean;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
}

declare type Xed = {
  user: User;
};
declare interface INewPost {
  file: FormData | undefined;
  caption: string;
  creator: string;
  tags: string | undefined;
  location: string | undefined;
}
declare type IUpdateUser = {
  firstName: string;
  lastName: string;
  imageId: string;
  imageUrl: URL | string;
  file: FormData | undefined;
};
declare type ResultParams = {
  classRoom: string;
  term: string;
  id?: string | string[];
  firstTest?: string;
  secondTest?: string;
  name? : string;
  project?: string;
  session?:string;
  bnb?: string;
  assignment?: string;
  exam?: string;
  subject?: string;
  
  result?: string;
};
interface Student {
  $id: string;
  name: string;
  studentId: string;
  image? : string;
  
}

interface Result {
  studentId: string;
  studentName: string;
  grades: string[];
  sum: number;
  grade: string;
}
interface Scores {
  $id: string;
  firstTest: string;
  secondTest: string;
  bnb: string;
  project: string;
  assignment: string;
  exam: string;
  subject: string;
  total: string;
  grade: string;
  session: string;
  term: string;
  createdAt: string;
  studentId: string;
  // grades: string[];
}

interface Helper {
  user: User;
  file?: FormData;
}
interface StudentInfoProps {
  name: string;
  expirationTime: string;
  classRoom: string;
  guardianInfo: string;
  dateOfBirth: string;
  studentId: string;
  image?: string
}
interface subjectProps {
  classRoom: string[];
  name: string;
  teacher?: string;
}
interface ScratchCard {
  userId: User["$id"];
  status: "used" | "unUsed";
  code: string;
  id: string;
}
interface updateResultProps {
  id: string;
  results: string[];
  stat?: "edited";
}


declare interface AuthFormProps {
  type: "sign-in" | "sign-up";
}

declare interface FooterProps {
  user: User;
  type?: "mobile" | "desktop";
}

declare interface Ris {
  transactions: Transaction[];
}

declare interface RightSidebarProps {
  user: User;
  transactions: Transaction[];
  banks: Bank[] & Account[];
}

declare interface SiderbarProps {
  user?: User;
  className: string;
}


declare interface IContextType {
  user: User;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
}declare type SignUpParams = {
  firstName?: string;
  lastName?: string;
  guardianContact?: string;
  dob?: string;
  name: string;
  subject?: string;
  adminContact?: string;
  adminId?: string;
  adminCode?: string;
  phone?: string;
  email: string;
  image: string;
  password: string;
};
declare type AdminProps = {
  name: string;
  image?: string;
  adminCode: string;
  adminId: string;
  adminContact: string;
  email: string;
  password: string;
};
interface Score {
  studentId: string;
  studentName: string;
  firstTest: string;
  secondTest: string;
  project: string;
  bnb: string;
  highestTotalScore?: string;
  lowestTotalScore?: string;
  assignment: string;
  exam: string;
  total: string;
  grade: string;
}
declare interface signInProps {
  email: string;

  password: string;
  phone?: string;
}
declare interface getUserInfoProps {
  userId: string;
}

declare interface getUserInfoProps {
  userId: string;
}

declare module "react-bottom-sheet";
