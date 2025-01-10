
export const PatientFormDefaultValues = {
  file: [],
  caption: "",

};

export const inbox = [
  {
    imgURL: "/icons/chat.svg",
    route: "/messaging",
    label: "Inbox",
  },

  {
    imgURL: "/icons/people.svg",
    route: "/communities",
    label: "Communities",
  },
  {
    imgURL: "/icons/phoner.png",
    route: "/log",
    label: "Log",
  },
  {
    imgURL: "/icons/plus.svg",
    route: "/add-message",
    label: "Chat",
  },

];

export const rightBarLinks = [
  {
    imgURL: "/icons/dashboard.png",
    route: "/dashboard",
    label: "Dashboard",
  },

  {
    imgURL: "/icons/follow.svg",
    route: "/registration",
    label: "Registration",
  },


  {
    imgURL: "/images/add-result.png",
    route: "/admin-score",
    label: "Entering Result",
  },
 
  {
    imgURL: "/icons/report.png",
    route: "/results",
    label: "View Results",
  },
];
export const sidebarLinks = [
  {
    imgURL: "/icons/home.svg",
    route: "/",
    label: "Home",
  },


  {
    imgURL: "/icons/followers.svg",
    route: "/all-students",
    label: "Students",
  },
 

  {
    imgURL: "/icons/add-post.svg",
    route: "/create-post",
    label: "Publish",
  },
  {
    imgURL: "/icons/report.png",
    route: "/check-results",
    label: "Check Results",
  },
];
export const home = [
  {
    imgURL: "/icons/home.svg",
    route: "/",
    label: "Home",
  },
  {
    imgURL: "/icons/chat.svg",
    route: "/messaging",
    label: "Inbox",

  },

  {
    imgURL: "/icons/save.svg",
    route: "/saved",
    label: "Saved",
   
  },
  {
    imgURL: "/icons/like.svg",
    route: "/trending",
    label: "Trending",
    
  },
  {
    imgURL: "/icons/plus.svg",
    route: "/create-post",
    label: "Search",
    
  },
  {
    imgURL: "/icons/follow.svg",
    route: "/personalization",
    label: "You",
  },
];
export const market = [
  {
    imgURL: "/icons/market.svg",
    route: "/marketplace",
    label: "Market",
  },
  {
    imgURL: "/icons/shopping-bag.svg",
    route: "/scratch-cards",
    label: "Tickets",
  },
  // {
  //   imgURL: "/icons/stripe.svg",
  //   route: "/other-products",
  //   label: "Other Products",
  // },

];



export const nav = [
  {
    imgURL: "/icons/wallet.svg",
    route: "/wallet",
    label: "Wallet",
  },
  {
    imgURL: "/icons/transaction.svg",
    route: "/transaction-history",
    label: "Transaction History",
  },
  {
    imgURL: "/icons/money-send.svg",
    route: "/payment-transfer",
    label: "Transfer Funds",
  },
  {
    imgURL: "/icons/money-send.svg",
    route: "/explore",
    label: "Explore",
  },
  {
    imgURL: "/icons/arrow-left.svg",
    route: "/",
    label: "Back",
  },
];



export const bottombarLinks = [
  {
    imgURL: "/icons/home.svg",
    route: "/",
    label: "Home",
  },

  {
    imgURL: "/icons/game.png",
    route: "/games",
    label: "Games",
  },

  {
    imgURL: "/icons/market.svg",
    route: "/marketplace",
    label: "Market",
  },
  {
    imgURL: "/icons/wallet.svg",
    route: "/wallet",
    label: "Wallet",
  },
 
];

export const topCategoryStyles = {
  "Food and Drink": {
    bg: "bg-blue-25",
    circleBg: "bg-blue-100",
    text: {
      main: "text-blue-900",
      count: "text-blue-700",
    },
    progress: {
      bg: "bg-blue-100",
      indicator: "bg-blue-700",
    },
    icon: "/icons/monitor.svg",
  },
  Travel: {
    bg: "bg-success-25",
    circleBg: "bg-success-100",
    text: {
      main: "text-success-900",
      count: "text-success-700",
    },
    progress: {
      bg: "bg-success-100",
      indicator: "bg-success-700",
    },
    icon: "/icons/coins.svg",
  },
  default: {
    bg: "bg-pink-25",
    circleBg: "bg-pink-100",
    text: {
      main: "text-pink-900",
      count: "text-pink-700",
    },
    progress: {
      bg: "bg-pink-100",
      indicator: "bg-pink-700",
    },
    icon: "/icons/shopping-bag.svg",
  },
};

export const transactionCategoryStyles = {
  "Food and Drink": {
    borderColor: "border-pink-600",
    backgroundColor: "bg-pink-500",
    textColor: "text-pink-700",
    chipBackgroundColor: "bg-inherit",
  },
  Payment: {
    borderColor: "border-success-600",
    backgroundColor: "bg-green-600",
    textColor: "text-success-700",
    chipBackgroundColor: "bg-inherit",
  },
  "Bank Fees": {
    borderColor: "border-success-600",
    backgroundColor: "bg-green-600",
    textColor: "text-success-700",
    chipBackgroundColor: "bg-inherit",
  },
  Transfer: {
    borderColor: "border-red-700",
    backgroundColor: "bg-red-700",
    textColor: "text-red-700",
    chipBackgroundColor: "bg-inherit",
  },
  Processing: {
    borderColor: "border-[#F2F4F7]",
    backgroundColor: "bg-gray-500",
    textColor: "text-[#344054]",
    chipBackgroundColor: "bg-[#F2F4F7]",
  },
  Success: {
    borderColor: "border-[#12B76A]",
    backgroundColor: "bg-[#12B76A]",
    textColor: "text-[#027A48]",
    chipBackgroundColor: "bg-[#ECFDF3]",
  },
  default: {
    borderColor: "",
    backgroundColor: "bg-blue-500",
    textColor: "text-blue-700",
    chipBackgroundColor: "bg-inherit",
  },
};
