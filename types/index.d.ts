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
  name: string[];
  expirationTime: string;
  classRoom: string[];
  guardianInfo: string[];
  dateOfBirth: string[];
  studentId: string;
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
interface IUpdatePost {
  postId: string;
  caption: string;
  file: FormData | undefined;
  location?: string;
  tags?: string;
}
declare type Account = {
  id: string;
  availableBalance: number;
  currentBalance: number;
  officialName: string;
  mask: string;
  institutionId: string;
  name: string;
  type: string;
  cardType: string;
  subtype: string;
  appwriteItemId: string;
  shareableId: string;
};

declare type Transaction = {
  id: string;
  $id: string;
  name: string;
  paymentChannel: string;
  type: string;
  accountId: string;
  amount: number;
  pending: boolean;
  category: string;
  date: string;
  image: string;
  type: string;
  $createdAt: string;
  channel: string;
  senderBankId: string;
  receiverBankId: string;
};

declare type Bank = {
  $id: string;
  accountId: string;
  bankId: string;
  accessToken: string;
  fundingSourceUrl: string;
  userId: string;
  shareableId: string;
};

declare type AccountTypes =
  | "depository"
  | "credit"
  | "loan "
  | "investment"
  | "other";

declare type Category = "Food and Drink" | "Travel" | "Transfer";

declare type CategoryCount = {
  name: string;
  count: number;
  totalCount: number;
};

declare type Receiver = {
  firstName: string;
  lastName: string;
};

declare type TransferParams = {
  sourceFundingSourceUrl: string;
  destinationFundingSourceUrl: string;
  amount: string;
};

declare type AddFundingSourceParams = {
  dwollaCustomerId: string;
  processorToken: string;
  bankName: string;
};

declare type NewDwollaCustomerParams = {
  firstName: string;
  lastName: string;
  phone?: string;
  email: string;
  type: string;
  address1: string;
  city: string;
  state: string;
  postalCode: string;
  dateOfBirth: string;
  ssn: string;
};

declare interface CreditCardProps {
  account: Account;
  userName: string;
  showBalance?: boolean;
}

declare interface BankInfoProps {
  account: Account;
  appwriteItemId?: string;
  type: "full" | "card";
}

declare interface HeaderBoxProps {
  type?: "title" | "greeting";
  title: string;
  subtext: string;
  user?: string;
  className?: string;
}

declare interface MobileNavProps {
  user: User;
}

declare interface PageHeaderProps {
  topTitle: string;
  bottomTitle: string;
  topDescription: string;
  bottomDescription: string;
  connectBank?: boolean;
}

declare interface PaginationProps {
  page: number;
  totalPages: number;
}

declare interface PlaidLinkProps {
  user: User;
  variant?: "primary" | "ghost";
  dwollaCustomerId?: string;
}

// declare type User = sdk.Models.Document & {
//   accountId: string;
// phone?: string;//
// email: string;
//   name: string;
//   items: string[];
//   accessToken: string;
//   image: string;
// };

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

declare interface RecentTransactionsProps {
  accounts: Account[];
  transactions: Transaction[];
  appwriteItemId: string;
  page: number;
}
declare interface IContextType {
  user: User;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
}
declare interface TransactionHistoryTableProps {
  transactions: Transaction[];
  page: number;
}

declare interface CategoryBadgeProps {
  category: string;
}

declare interface TransactionTableProps {
  transactions: Transaction[];
}

declare interface CategoryProps {
  category: CategoryCount;
}

declare interface DoughnutChartProps {
  accounts: Account[];
}

declare interface PaymentTransferFormProps {
  accounts: Account[];
}

// Actions
declare interface getAccountsProps {
  userId: string;
}

declare interface getAccountProps {
  appwriteItemId: string;
}

declare interface getInstitutionProps {
  institutionId: string;
}

declare interface getTransactionsProps {
  accessToken: string;
}

declare interface CreateFundingSourceOptions {
  customerId: string; // Dwolla Customer ID
  fundingSourceName: string; // Dwolla Funding Source Name
  plaidToken: string; // Plaid Account Processor Token
  _links: object; // Dwolla On Demand Authorization Link
}

declare interface CreateTransactionProps {
  name: string;
  amount: string;
  senderId: string;
  senderBankId: string;
  receiverId: string;
  receiverBankId: string;
  //  phone?: string;
  email: string;
}

declare interface getTransactionsByBankIdProps {
  bankId: string;
}

declare type SignUpParams = {
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
declare interface getU {
  user: string;
  followers?: string[];
}

declare interface exchangePublicTokenProps {
  publicToken: string;
  user: User;
}

declare interface createBankAccountProps {
  accessToken: string;
  userId: string;
  accountId: string;
  bankId: string;
  fundingSourceUrl: string;
  shareableId: string;
}

declare interface getBanksProps {
  userId: string;
}

declare interface getBankProps {
  documentId: string;
}

declare interface getBankByAccountIdProps {
  accountId: string;
}
declare type ThreadWrapperProps = { thread: ThreadData<BaseMetadata> };
type UserLinks = {
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
  telegram?: string;
  youtube?: string;
  // Add more fields if needed
};

type UserProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio?: string;
  Links?: UserLinks;
};

interface UpdateUserProfileParams {
  userId: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  Links?: string[];
  email?: string;
  phone?: string;
}
declare type AccessType = ["room:write"] | ["room:read", "room:presence:write"];

declare type RoomAccesses = Record<string, AccessType>;

declare type UserType = "creator" | "editor" | "viewer";

declare module "react-bottom-sheet";
