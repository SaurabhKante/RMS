import {
  Armchair,
  UtensilsCrossed,
  ReceiptText,
  Wallet,
  BarChart3,
  Infinity,
  CircleCheck,
  User,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";

export const menuItems = [
   {
    title: "Home",
    path: "/",
    icon: Armchair,
  },
  {
    title: "Dishes",
    path: "/dishes",
    icon: UtensilsCrossed,
  },
  {
    title: "Dues",
    path: "/dues",
    icon: ReceiptText,
  },
  {
    title: "Expenses",
    path: "/expenses",
    icon: Wallet,
  },
  {
    title: "Analytics",
    path: "/analytics",
    icon: BarChart3,
  },
];

export const filterItems = [
  {
    title: "All",
    icon: CircleCheck,
    count: 12,
    active: true,
    badgeColor: "bg-teal-700",
  },
  {
    title: "Available",
    icon: CircleCheck,
    count: 4,
    badgeColor: "bg-slate-300",
  },
  {
    title: "Occupied",
    icon: User,
    count: 6,
    badgeColor: "bg-teal-700",
  },
  
];

export const bottomItems = [
  {
    title: "Settings",
    icon: Settings,
  },
  {
    title: "Logout",
    icon: LogOut,
  },
];