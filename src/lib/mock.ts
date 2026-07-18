// Realistic mock data for Misaq — UI/UX demo only, no backend.

export type ProfileStatus =
  "Draft" | "Submitted" | "Under Review" | "Verified" | "Rejected" | "Suspended" | "Banned";

export type PhotoPrivacySetting =
  | "Public"
  | "Hidden"
  | "VerifiedOnly"
  | "MatchesOnly"
  | "FinalProposalAccepted"
  | "PremiumMatchOnly";

export type Person = {
  id: string;
  name: string;
  age: number;
  city: string;
  country: string;
  profession: string;
  education: string;
  height: string;
  sect: string;
  religion?: string;
  religiousEnvironment?: string;
  compatibility: number;
  verified: boolean;
  premium?: boolean;
  photo: string; // portrait URL
  avatar: string; // gradient fallback
  bio: string;
  prayer: string;
  quran: string;
  hijab?: string;
  beard?: string;
  gender: "male" | "female";
  phone?: string;
  email?: string;
  address?: string;
  photoPrivacy?: PhotoPrivacySetting;

  // Verification & Profile Status Workflow
  verificationStatus?: ProfileStatus;
  rejectionReason?: string;
  internalNotes?: string;
  cnicNumber?: string;
  cnicFront?: string;
  cnicBack?: string;
  selfie?: string;
  gallery?: string[];
  waliPhoto?: string;
  waliName?: string;
  waliRelationship?: string;
  waliPhone?: string;
  waliEmail?: string;
  registrationDate?: string;
  monthlyIncome?: string;
  religiousPractice?: string;
  maritalStatus?: string;
  children?: string;
  familyType?: string;
  hobbies?: string[];
  interests?: string[];
};

const grads = [
  "linear-gradient(135deg,#8A1A2B,#C9A24C)",
  "linear-gradient(135deg,#4A2C40,#8A1A2B)",
  "linear-gradient(135deg,#6B121F,#2E1416)",
  "linear-gradient(135deg,#C9A24C,#6B121F)",
  "linear-gradient(135deg,#3E2723,#8D6E63)",
  "linear-gradient(135deg,#1F1B2E,#6B121F)",
  "linear-gradient(135deg,#5D4037,#C9A24C)",
  "linear-gradient(135deg,#8A1A2B,#4A148C)",
];

const femaleNames = [
  "Aisha Rahman",
  "Maryam Iqbal",
  "Fatima Noor",
  "Khadija Malik",
  "Zainab Qureshi",
  "Hafsa Siddiqui",
  "Amina Farooq",
  "Sumayya Hashmi",
  "Ruqayya Ansari",
  "Safiyya Chaudhry",
  "Asma Kazi",
  "Umm Kulthum Baig",
  "Bushra Shaikh",
  "Nusaybah Javed",
  "Layla Khan",
  "Sana Tariq",
  "Iman Ahmed",
  "Hoor Zafar",
  "Rania Butt",
  "Yusra Mirza",
];

const maleNames = [
  "Hamza Siddiqui",
  "Yusuf Khan",
  "Bilal Ahmed",
  "Ibrahim Raza",
  "Abdullah Sheikh",
  "Umar Farooq",
  "Ali Hassan",
  "Zaid Malik",
  "Musa Iqbal",
  "Ismail Qureshi",
  "Suhail Ansari",
  "Talha Chaudhry",
  "Rayyan Baig",
  "Salman Hashmi",
  "Adnan Kazi",
  "Junaid Tariq",
  "Faisal Zafar",
  "Owais Butt",
  "Nabeel Mirza",
  "Saad Javed",
];

const cities: Array<[string, string]> = [
  ["Lahore", "Pakistan"],
  ["Karachi", "Pakistan"],
  ["Islamabad", "Pakistan"],
  ["Rawalpindi", "Pakistan"],
  ["Peshawar", "Pakistan"],
  ["Multan", "Pakistan"],
  ["Dubai", "UAE"],
  ["Abu Dhabi", "UAE"],
  ["Riyadh", "KSA"],
  ["Jeddah", "KSA"],
  ["Madinah", "KSA"],
  ["Doha", "Qatar"],
  ["Kuwait City", "Kuwait"],
  ["Istanbul", "Türkiye"],
  ["Kuala Lumpur", "Malaysia"],
  ["Jakarta", "Indonesia"],
  ["London", "UK"],
  ["Manchester", "UK"],
  ["Birmingham", "UK"],
  ["Toronto", "Canada"],
  ["Mississauga", "Canada"],
  ["New York", "USA"],
  ["Houston", "USA"],
  ["Chicago", "USA"],
  ["Sydney", "Australia"],
];

const professionsF = [
  "Doctor (Resident)",
  "Teacher",
  "Islamic Scholar",
  "Architect",
  "Pharmacist",
  "Software Engineer",
  "Dentist",
  "Home-based Quran Teacher",
  "Graphic Designer",
  "Public Health Officer",
  "Nutritionist",
  "Homemaker",
  "Lawyer",
  "Content Writer",
  "Nurse",
  "Business Analyst",
  "Psychologist",
  "Alimah",
  "Fashion Entrepreneur",
  "Researcher",
];
const professionsM = [
  "Software Engineer",
  "Doctor",
  "Business Owner",
  "Government Employee",
  "Civil Engineer",
  "Accountant",
  "Islamic Scholar",
  "Teacher",
  "Pharmacist",
  "Product Manager",
  "Data Scientist",
  "Architect",
  "Lawyer",
  "Mechanical Engineer",
  "Financial Analyst",
  "Hafiz-ul-Quran",
  "Entrepreneur",
  "Dentist",
  "University Lecturer",
  "Consultant",
];

const educationsF = [
  "MBBS",
  "Bachelor's in Education",
  "Alimah Course",
  "Master's in Architecture",
  "PharmD",
  "BS Computer Science",
  "BDS",
  "Hifz + Bachelor's",
  "BFA",
  "MPH",
  "BS Nutrition",
  "Intermediate",
  "LLB",
  "BA English",
  "BScN",
  "MBA",
  "MS Psychology",
  "Alimah + Master's",
  "BBA",
  "MPhil",
];
const educationsM = [
  "BS Computer Science",
  "MBBS",
  "Master's in Finance",
  "PhD",
  "BE Civil",
  "ACCA",
  "Alim Course",
  "M.Ed",
  "PharmD",
  "MBA",
  "MS Data Science",
  "M.Arch",
  "LLB",
  "BE Mechanical",
  "CFA",
  "Hafiz + BS",
  "MBA",
  "BDS",
  "PhD",
  "MSc",
];

const sects = ["Barelvi", "Deobandi (Hayati)", "Deobandi (Mamati)", "Ahle Hadith / Salafi"];
const prayers = ["5 Times Daily", "Usually", "Sometimes", "Rarely", "Prefer not to say"];
const qurans = ["Daily", "Weekly", "Occasionally", "Rarely"];
const hijabs = ["Niqab", "Hijab", "Modest Dress", "Prefer not to say"];
const beards = ["Sunnah Beard", "Short Beard", "Clean Shaven"];

const bios = [
  "Seeking a partner who values deen and family. Alhamdulillah, studying Qur'an.",
  "Practising the Sunnah, striving to build a home rooted in taqwa.",
  "Book lover, aspiring hafiza. Family is everything.",
  "Building a halal career, in shaa Allah raising a religious family.",
  "British-raised, seeking a partner grounded in the deen. Love travel and Qur'anic reflection.",
  "Physician and student of knowledge — seeking a companion for Jannah.",
  "Alimah, seeking a partner grounded in the Sunnah. Family involvement essential.",
  "Academic and revert-support volunteer. Seeking sakinah.",
  "Simple, family-oriented, and looking for a spouse who prioritises salah.",
  "Trying to walk the middle path — deen first, dunya second.",
];

const pick = <T>(arr: T[], i: number) => arr[i % arr.length];

const heightsF = ["5'1\"", "5'2\"", "5'3\"", "5'4\"", "5'5\"", "5'6\"", "5'7\""];
const heightsM = ["5'7\"", "5'8\"", "5'9\"", "5'10\"", "5'11\"", "6'0\"", "6'1\"", "6'2\""];

// Randomuser.me hosts realistic portraits. Fixed indices keep uniqueness.
const femalePhoto = (i: number) =>
  `https://randomuser.me/api/portraits/women/${(i * 7 + 3) % 99}.jpg`;
const malePhoto = (i: number) => `https://randomuser.me/api/portraits/men/${(i * 5 + 11) % 99}.jpg`;

const slug = (name: string) => name.toLowerCase().split(" ")[0];

function buildFemale(i: number): Person {
  const name = femaleNames[i];
  const [city, country] = pick(cities, i + 1);
  const verified = i % 4 !== 3;

  let verificationStatus: ProfileStatus = verified ? "Verified" : "Submitted";
  let rejectionReason = "";
  if (!verified) {
    if (i === 3) {
      verificationStatus = "Rejected";
      rejectionReason = "Selfie verification image is too dark.";
    } else if (i === 7) {
      verificationStatus = "Suspended";
    } else if (i === 11) {
      verificationStatus = "Banned";
    }
  }

  let photoPrivacy: PhotoPrivacySetting = "Public";
  if (i === 0) {
    photoPrivacy = "MatchesOnly";
  } else if (i === 1) {
    photoPrivacy = "PremiumMatchOnly";
  } else if (i === 2) {
    photoPrivacy = "Hidden";
  }

  return {
    id: `f-${slug(name)}-${i}`,
    name,
    age: 21 + (i % 10),
    city,
    country,
    profession: pick(professionsF, i),
    education: pick(educationsF, i),
    height: pick(heightsF, i),
    sect: pick(sects, i),
    compatibility: 78 + ((i * 13) % 21),
    verified,
    verificationStatus,
    rejectionReason,
    premium: i < 5,
    photo: femalePhoto(i),
    avatar: pick(grads, i),
    bio: pick(bios, i),
    prayer: pick(prayers, i),
    quran: pick(qurans, i),
    hijab: pick(hijabs, i),
    photoPrivacy,
    gender: "female",
    phone: `+92 321 ${1000000 + i * 1357}`,
    email: `${slug(name)}@gmail.com`,
    address: `House ${12 + i}, Block ${String.fromCharCode(65 + (i % 6))}, DHA Phase 5, ${city}`,

    // Mock review documents
    cnicNumber: `35201-${1000000 + i}-${i % 10}`,
    cnicFront:
      "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&q=80&w=300",
    cnicBack:
      "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&q=80&w=300",
    selfie: femalePhoto(i),
    waliPhoto:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
    waliName: `${name.split(" ")[1]} Wali`,
    waliRelationship: "Father",
    waliPhone: `+92 300 ${5000000 + i}`,
    waliEmail: `wali.${slug(name)}@gmail.com`,
    registrationDate: "2026-07-10",
    monthlyIncome: "150k – 300k",
    religion: "Islam",
    religiousPractice: "Intermediate",
    religiousEnvironment: "Moderate",
    maritalStatus: "Never Married",
    children: "No Children",
    familyType: "Nuclear",
    hobbies: ["Reading", "Cooking"],
    interests: ["Islamic History", "Charity"],
    gallery: [
      femalePhoto(i),
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200",
    ],
  };
}

function buildMale(i: number): Person {
  const name = maleNames[i];
  const [city, country] = pick(cities, i + 7);
  const verified = i % 5 !== 4;

  let verificationStatus: ProfileStatus = verified ? "Verified" : "Submitted";
  let rejectionReason = "";
  if (!verified) {
    if (i === 4) {
      verificationStatus = "Rejected";
      rejectionReason = "CNIC Front copy shows signs of digital manipulation.";
    } else if (i === 9) {
      verificationStatus = "Suspended";
    } else if (i === 14) {
      verificationStatus = "Banned";
    }
  }

  return {
    id: `m-${slug(name)}-${i}`,
    name,
    age: 24 + (i % 12),
    city,
    country,
    profession: pick(professionsM, i),
    education: pick(educationsM, i),
    height: pick(heightsM, i),
    sect: pick(sects, i),
    compatibility: 76 + ((i * 11) % 23),
    verified,
    verificationStatus,
    rejectionReason,
    premium: i < 5,
    photo: malePhoto(i),
    avatar: pick(grads, i + 3),
    bio: pick(bios, i + 3),
    prayer: pick(prayers, i),
    quran: pick(qurans, i + 1),
    beard: pick(beards, i),
    photoPrivacy: "Public",
    gender: "male",
    phone: `+92 333 ${2000000 + i * 2468}`,
    email: `${slug(name)}@gmail.com`,
    address: `House ${45 + i}, Street ${2 + (i % 8)}, Bahria Town, ${city}`,

    // Mock review documents
    cnicNumber: `35201-${2000000 + i}-${i % 10}`,
    cnicFront:
      "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&q=80&w=300",
    cnicBack:
      "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&q=80&w=300",
    selfie: malePhoto(i),
    waliPhoto:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
    waliName: `${name.split(" ")[1]} Wali`,
    waliRelationship: "Father",
    waliPhone: `+92 333 ${6000000 + i}`,
    waliEmail: `wali.${slug(name)}@gmail.com`,
    registrationDate: "2026-07-09",
    monthlyIncome: "300k – 600k",
    religion: "Islam",
    religiousPractice: "Intermediate",
    religiousEnvironment: "Moderate",
    maritalStatus: "Never Married",
    children: "No Children",
    familyType: "Nuclear",
    hobbies: ["Reading", "Sports"],
    interests: ["Travel", "Charity"],
    gallery: [
      malePhoto(i),
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    ],
  };
}

// 20 female + 20 male + 10 additional (mixed premium) = 50
const females: Person[] = femaleNames.map((_, i) => buildFemale(i));
const males: Person[] = maleNames.map((_, i) => buildMale(i));

const extraFemale: Person[] = Array.from({ length: 5 }).map((_, i) => ({
  ...buildFemale((i * 3) % 20),
  id: `fx-${i}`,
  name: `${femaleNames[(i * 3 + 1) % 20].split(" ")[0]} ${["Nadeem", "Yasin", "Ashraf", "Mahmood", "Sattar"][i]}`,
  premium: true,
  photo: femalePhoto(i * 4 + 30),
}));
const extraMale: Person[] = Array.from({ length: 5 }).map((_, i) => ({
  ...buildMale((i * 3) % 20),
  id: `mx-${i}`,
  name: `${maleNames[(i * 3 + 1) % 20].split(" ")[0]} ${["Nadeem", "Yasin", "Ashraf", "Mahmood", "Sattar"][i]}`,
  premium: true,
  photo: malePhoto(i * 4 + 40),
}));

export const people: Person[] = [...females, ...males, ...extraFemale, ...extraMale];

export const meMember: Person = {
  id: "me",
  name: "Ahmed Raza",
  age: 27,
  city: "Lahore",
  country: "Pakistan",
  profession: "Software Engineer",
  education: "BS Computer Science",
  height: "5'10\"",
  sect: "Barelvi",
  religion: "Islam",
  religiousEnvironment: "Moderate",
  compatibility: 100,
  verified: true,
  verificationStatus: "Verified",
  premium: false,
  photo: "https://randomuser.me/api/portraits/men/32.jpg",
  avatar: grads[1],
  bio: "Trying to walk the middle path. Seeking a companion for Jannah.",
  prayer: "5 Times Daily",
  quran: "Daily",
  beard: "Sunnah Beard",
  gender: "male",
  phone: "+92 300 9876543",
  email: "ahmed.raza@gmail.com",
  address: "House 12-A, Block K, Gulberg III, Lahore, Pakistan",
  photoPrivacy: "Public",
  cnicNumber: "35201-9876543-1",
  cnicFront:
    "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&q=80&w=300",
  cnicBack:
    "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&q=80&w=300",
  selfie: "https://randomuser.me/api/portraits/men/32.jpg",
  waliPhoto:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
  waliName: "Abdullah Raza",
  waliRelationship: "Father",
  waliPhone: "+92 300 1234567",
  waliEmail: "wali@gmail.com",
  registrationDate: "2026-07-01",
  monthlyIncome: "150k – 300k",
  religiousPractice: "Regular",
  maritalStatus: "Never Married",
  children: "No Children",
  familyType: "Nuclear",
  hobbies: ["Reading", "Hiking"],
  interests: ["Islamic History", "Charity"],
  gallery: ["https://randomuser.me/api/portraits/men/32.jpg"],
};

export type ChatMessage = {
  id: string;
  from: "me" | "them";
  text?: string;
  voice?: { seconds: number };
  time: string;
  read?: boolean;
};

export function getMatchId(user1Id: string, user2Id: string): string {
  const u1 = user1Id === "me" ? "me" : user1Id;
  const u2 = user2Id === "me" ? "me" : user2Id;
  const sorted = [u1, u2].sort();
  return `match_${sorted[0]}_${sorted[1]}`;
}

export type ChatThread = {
  id: string;
  matchId: string;
  personId: string;
  lastAt: string;
  unread: number;
  typing?: boolean;
  messages: ChatMessage[];
  chatStartDate?: string;
  finalProposalStatus?:
    "none" | "sent" | "accepted" | "rejected" | "wali_approved" | "wali_rejected" | "purchased";
  elapsedDaysOffset?: number;
  blocked?: boolean;
};

const conversation = (personName: string): ChatMessage[] => {
  const first = personName.split(" ")[0];
  return [
    {
      id: "1",
      from: "them",
      text: `Assalamu alaikum. My family reviewed your profile — jazak Allah khair.`,
      time: "10:12",
      read: true,
    },
    {
      id: "2",
      from: "me",
      text: "Wa alaikum assalam wa rahmatullah. Alhamdulillah, may Allah reward your family.",
      time: "10:14",
      read: true,
    },
    {
      id: "3",
      from: "them",
      text: "Would our elders be able to speak this Friday after Maghrib, in shaa Allah?",
      time: "10:20",
      read: true,
    },
    {
      id: "4",
      from: "me",
      text: "In shaa Allah. My father is available. Should I share his contact with your Wali?",
      time: "10:22",
      read: true,
    },
    { id: "5", from: "them", voice: { seconds: 18 }, time: "10:25", read: true },
    {
      id: "6",
      from: "me",
      text: "Baarak Allahu feek. Please share a time that suits your family.",
      time: "10:30",
      read: true,
    },
    {
      id: "7",
      from: "them",
      text: `Between Maghrib and Isha would be perfect. My Wali will coordinate.`,
      time: "11:02",
      read: true,
    },
    {
      id: "8",
      from: "me",
      text: "Noted. Jazak Allah khair — looking forward.",
      time: "11:05",
      read: true,
    },
    {
      id: "9",
      from: "them",
      text: `May Allah make this easy for us both, ${first === "Aisha" ? "ameen" : "ameen"}.`,
      time: "11:40",
    },
    { id: "10", from: "them", voice: { seconds: 22 }, time: "12:04" },
  ];
};

export const chats: ChatThread[] = people.slice(0, 8).map((p, idx) => ({
  id: `c${idx + 1}`,
  matchId: getMatchId("me", p.id),
  personId: p.id,
  lastAt: ["Now", "12:04", "11:40", "Yest.", "Mon", "Sun", "2d", "3d"][idx] ?? "3d",
  unread: idx === 0 ? 2 : idx === 2 ? 1 : 0,
  typing: idx === 0,
  messages: conversation(p.name),
  chatStartDate: new Date().toISOString(),
  finalProposalStatus: "none",
  elapsedDaysOffset: 0,
  blocked: false,
}));

export const proposals = {
  received: people.slice(0, 6),
  sent: people.slice(6, 11),
  accepted: people.slice(11, 14),
};

// Notifications grouped by time bucket
export type NotifBucket = "today" | "yesterday" | "earlier";
export type Notif = {
  id: string;
  bucket: NotifBucket;
  kind: "proposal" | "message" | "wali" | "compat" | "verify" | "premium";
  personId?: string;
  title: string;
  desc: string;
  time: string;
  read: boolean;
};

export const notifications: Notif[] = [
  {
    id: "n1",
    bucket: "today",
    kind: "proposal",
    personId: people[0].id,
    title: "New proposal received",
    desc: `${people[0].name.split(" ")[0]}'s family sent a proposal.`,
    time: "Just now",
    read: false,
  },
  {
    id: "n2",
    bucket: "today",
    kind: "message",
    personId: people[1].id,
    title: "New message",
    desc: `"Jazak Allah khair for the proposal."`,
    time: "1h",
    read: false,
  },
  {
    id: "n3",
    bucket: "today",
    kind: "compat",
    personId: people[6].id,
    title: "Highly compatible profile",
    desc: `96% compatibility with ${people[6].name}.`,
    time: "3h",
    read: false,
  },
  {
    id: "n4",
    bucket: "yesterday",
    kind: "wali",
    personId: people[2].id,
    title: "Wali confirmed",
    desc: `Your Wali approved conversation with ${people[2].name.split(" ")[0]}.`,
    time: "Yesterday",
    read: true,
  },
  {
    id: "n5",
    bucket: "yesterday",
    kind: "verify",
    title: "Verification approved",
    desc: "Your CNIC and selfie were successfully verified.",
    time: "Yesterday",
    read: true,
  },
  {
    id: "n6",
    bucket: "earlier",
    kind: "premium",
    title: "Misaq Premium",
    desc: "Members with Premium receive 4× more sincere proposals.",
    time: "3d",
    read: true,
  },
  {
    id: "n7",
    bucket: "earlier",
    kind: "proposal",
    personId: people[3].id,
    title: "Proposal viewed",
    desc: `${people[3].name.split(" ")[0]} viewed your proposal.`,
    time: "5d",
    read: true,
  },
];

export let meMemberData = meMember;
export let peopleData = people;
export let chatsData = chats;
export let proposalsData = proposals;
export let notificationsData = notifications;
export let rejectedProfilesData: string[] = [];
export let nextMatchAvailableAtData: number | null = null;

const listeners = new Set<() => void>();
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};
const notify = () => {
  listeners.forEach((l) => l());
};

const isClient = typeof window !== "undefined";

if (isClient) {
  try {
    const savedMe = localStorage.getItem("misaq_me");
    if (savedMe) meMemberData = JSON.parse(savedMe);

    const savedPeople = localStorage.getItem("misaq_people");
    if (savedPeople) peopleData = JSON.parse(savedPeople);

    const savedChats = localStorage.getItem("misaq_chats");
    if (savedChats) chatsData = JSON.parse(savedChats);

    const savedProposals = localStorage.getItem("misaq_proposals");
    if (savedProposals) proposalsData = JSON.parse(savedProposals);

    const savedNotifications = localStorage.getItem("misaq_notifications");
    if (savedNotifications) notificationsData = JSON.parse(savedNotifications);

    const savedRejected = localStorage.getItem("misaq_rejected_profiles");
    if (savedRejected) rejectedProfilesData = JSON.parse(savedRejected);

    const savedNextMatchAt = localStorage.getItem("misaq_next_match_at");
    if (savedNextMatchAt) nextMatchAvailableAtData = JSON.parse(savedNextMatchAt);
  } catch (e) {
    console.error("Failed to load mock data from localStorage", e);
  }
}

const persist = (key: string, data: unknown) => {
  if (isClient) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error(`Failed to save ${key} to localStorage`, e);
    }
  }
};

import { useState, useEffect } from "react";

export function useMe() {
  const [me, setMe] = useState(meMemberData);
  useEffect(() => {
    return subscribe(() => setMe(meMemberData));
  }, []);

  const updateMe = (updater: Person | ((prev: Person) => Person)) => {
    const next = typeof updater === "function" ? updater(meMemberData) : updater;
    meMemberData = next;
    persist("misaq_me", next);
    notify();
  };

  return [me, updateMe] as const;
}

export function usePeople() {
  const [currentPeople, setCurrentPeople] = useState(peopleData);
  useEffect(() => {
    return subscribe(() => setCurrentPeople(peopleData));
  }, []);

  const updatePeople = (updater: Person[] | ((prev: Person[]) => Person[])) => {
    const next = typeof updater === "function" ? updater(peopleData) : updater;
    peopleData = next;
    persist("misaq_people", next);
    notify();
  };

  return [currentPeople, updatePeople] as const;
}

export function useChats() {
  const [currentChats, setCurrentChats] = useState(chatsData);
  useEffect(() => {
    return subscribe(() => setCurrentChats(chatsData));
  }, []);

  const updateChats = (updater: ChatThread[] | ((prev: ChatThread[]) => ChatThread[])) => {
    const next = typeof updater === "function" ? updater(chatsData) : updater;
    chatsData = next;
    persist("misaq_chats", next);
    notify();
  };

  return [currentChats, updateChats] as const;
}

export function useProposals() {
  const [currentProposals, setCurrentProposals] = useState(proposalsData);
  useEffect(() => {
    return subscribe(() => setCurrentProposals(proposalsData));
  }, []);

  const updateProposals = (
    updater: typeof proposalsData | ((prev: typeof proposalsData) => typeof proposalsData),
  ) => {
    const next = typeof updater === "function" ? updater(proposalsData) : updater;
    proposalsData = next;
    persist("misaq_proposals", next);
    notify();
  };

  return [currentProposals, updateProposals] as const;
}

export function useNotifications() {
  const [currentNotifications, setCurrentNotifications] = useState(notificationsData);
  useEffect(() => {
    return subscribe(() => setCurrentNotifications(notificationsData));
  }, []);

  const updateNotifications = (updater: Notif[] | ((prev: Notif[]) => Notif[])) => {
    const next = typeof updater === "function" ? updater(notificationsData) : updater;
    notificationsData = next;
    persist("misaq_notifications", next);
    notify();
  };

  return [currentNotifications, updateNotifications] as const;
}

export function useRejectedProfiles() {
  const [currentRejected, setCurrentRejected] = useState(rejectedProfilesData);
  useEffect(() => {
    return subscribe(() => setCurrentRejected(rejectedProfilesData));
  }, []);

  const updateRejected = (updater: string[] | ((prev: string[]) => string[])) => {
    const next = typeof updater === "function" ? updater(rejectedProfilesData) : updater;
    rejectedProfilesData = next;
    persist("misaq_rejected_profiles", next);
    notify();
  };

  return [currentRejected, updateRejected] as const;
}

// Persisted so the 20s "next match" countdown survives a page reload and can't be skipped.
export function useNextMatchAvailableAt() {
  const [currentValue, setCurrentValue] = useState(nextMatchAvailableAtData);
  useEffect(() => {
    return subscribe(() => setCurrentValue(nextMatchAvailableAtData));
  }, []);

  const updateNextMatchAvailableAt = (value: number | null) => {
    nextMatchAvailableAtData = value;
    persist("misaq_next_match_at", value);
    notify();
  };

  return [currentValue, updateNextMatchAvailableAt] as const;
}

export function resetRecommendations() {
  rejectedProfilesData = [];
  nextMatchAvailableAtData = null;
  persist("misaq_rejected_profiles", rejectedProfilesData);
  persist("misaq_next_match_at", nextMatchAvailableAtData);
  notify();
}

export function switchRole(role: "boy" | "girl") {
  if (role === "girl") {
    if (meMemberData.gender === "female") return;
    const aisha = peopleData.find((p) => p.id === "f-aisha-0") || peopleData[0];
    const ahmed = { ...meMemberData, id: "f-aisha-0" };
    peopleData = peopleData.map((p) => (p.id === "f-aisha-0" ? ahmed : p));
    meMemberData = { ...aisha, id: "me" };
  } else {
    if (meMemberData.gender === "male") return;
    const ahmed = peopleData.find((p) => p.id === "f-aisha-0") || peopleData[0];
    const aisha = { ...meMemberData, id: "f-aisha-0" };
    peopleData = peopleData.map((p) => (p.id === "f-aisha-0" ? aisha : p));
    meMemberData = { ...ahmed, id: "me" };
  }
  persist("misaq_me", meMemberData);
  persist("misaq_people", peopleData);
  notify();
}

export const findPerson = (id: string) => peopleData.find((p) => p.id === id) ?? peopleData[0];
export const findChat = (id: string) => chatsData.find((c) => c.id === id) ?? chatsData[0];

export function getBlockedMatches(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem("misaq_blocked_matches") || "{}");
  } catch {
    return {};
  }
}

export function setMatchBlocked(matchId: string, blocked: boolean) {
  const current = getBlockedMatches();
  if (blocked) {
    current[matchId] = true;
  } else {
    delete current[matchId];
  }
  if (typeof window !== "undefined") {
    localStorage.setItem("misaq_blocked_matches", JSON.stringify(current));
  }
}

export function addNotification(notif: {
  kind: "verify" | "proposal" | "premium" | "chat" | "photo_request";
  title: string;
  desc: string;
  personId?: string;
  photoRequest?: {
    requesterId: string;
    matchId: string;
    status: "pending" | "approved" | "declined";
  };
  recipientId?: string;
}) {
  const newNotif = {
    id: `n_auto_${Date.now()}`,
    bucket: "today" as const,
    kind: notif.kind,
    title: notif.title,
    desc: notif.desc,
    time: "Just now",
    read: false,
    personId: notif.personId,
    photoRequest: notif.photoRequest,
    recipientId: notif.recipientId,
  };
  notificationsData = [newNotif, ...notificationsData];
  if (typeof window !== "undefined") {
    localStorage.setItem("misaq_notifications", JSON.stringify(notificationsData));
  }
  notify();
}


export function getPhotoPermissions(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem("misaq_photo_permissions") || "{}");
  } catch {
    return {};
  }
}

export function setPhotoPermission(matchId: string, granted: boolean) {
  const current = getPhotoPermissions();
  if (granted) {
    current[matchId] = true;
  } else {
    delete current[matchId];
  }
  if (typeof window !== "undefined") {
    localStorage.setItem("misaq_photo_permissions", JSON.stringify(current));
  }
  notify();
}

export function getPhotoRequests(): Record<string, "pending" | "approved" | "declined"> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem("misaq_photo_requests") || "{}");
  } catch {
    return {};
  }
}

export function setPhotoRequest(matchId: string, status: "pending" | "approved" | "declined") {
  const current = getPhotoRequests();
  current[matchId] = status;
  if (typeof window !== "undefined") {
    localStorage.setItem("misaq_photo_requests", JSON.stringify(current));
  }
  notify();
}

export function hasPhotoAccess(
  viewer: Person | null | undefined,
  owner: Person | null | undefined,
  chats: ChatThread[],
  proposals: { accepted?: Person[] } | null | undefined,
  context?: "admin" | "wali" | "member",
): boolean {
  // 1. Admin / Verification Team always has access
  if (context === "admin") return true;

  // 2. Wali always has access
  if (context === "wali") return true;

  if (!owner) return true;

  // 3. Dummy objects without real ID/settings are not blocked
  if (!owner.id) return true;

  if (!viewer) return false;

  // 4. Owners can always view their own photo
  if (viewer.id === owner.id) return true;

  // Check match-specific approved requests first
  const matchId = getMatchId(viewer.id, owner.id);
  const permissions = getPhotoPermissions();
  if (permissions[matchId] === true) {
    return true;
  }

  const privacy = owner.photoPrivacy || "Public";

  if (privacy === "Public") return true;

  if (privacy === "Hidden") return false;

  if (privacy === "VerifiedOnly") {
    return viewer.verificationStatus === "Verified";
  }

  // Find if they have a match (accepted proposal or chat thread)
  const hasAcceptedMatch =
    chats.some((c) => c.matchId === matchId) ||
    proposals?.accepted?.some((p: Person) => p.id === owner.id || p.id === viewer.id);

  if (privacy === "MatchesOnly") {
    return !!hasAcceptedMatch;
  }

  const chat = chats.find((c) => c.matchId === matchId);

  if (privacy === "FinalProposalAccepted") {
    if (!chat) return false;
    return (
      chat.finalProposalStatus === "accepted" ||
      chat.finalProposalStatus === "wali_approved" ||
      chat.finalProposalStatus === "purchased"
    );
  }

  if (privacy === "PremiumMatchOnly") {
    if (!chat) return false;
    return chat.finalProposalStatus === "purchased";
  }

  return false;
}
