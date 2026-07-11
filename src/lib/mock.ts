// Realistic mock data for Misaq — UI/UX demo only, no backend.

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
  "Aisha Rahman", "Maryam Iqbal", "Fatima Noor", "Khadija Malik", "Zainab Qureshi",
  "Hafsa Siddiqui", "Amina Farooq", "Sumayya Hashmi", "Ruqayya Ansari", "Safiyya Chaudhry",
  "Asma Kazi", "Umm Kulthum Baig", "Bushra Shaikh", "Nusaybah Javed", "Layla Khan",
  "Sana Tariq", "Iman Ahmed", "Hoor Zafar", "Rania Butt", "Yusra Mirza",
];

const maleNames = [
  "Hamza Siddiqui", "Yusuf Khan", "Bilal Ahmed", "Ibrahim Raza", "Abdullah Sheikh",
  "Umar Farooq", "Ali Hassan", "Zaid Malik", "Musa Iqbal", "Ismail Qureshi",
  "Suhail Ansari", "Talha Chaudhry", "Rayyan Baig", "Salman Hashmi", "Adnan Kazi",
  "Junaid Tariq", "Faisal Zafar", "Owais Butt", "Nabeel Mirza", "Saad Javed",
];

const cities: Array<[string, string]> = [
  ["Lahore", "Pakistan"], ["Karachi", "Pakistan"], ["Islamabad", "Pakistan"],
  ["Rawalpindi", "Pakistan"], ["Peshawar", "Pakistan"], ["Multan", "Pakistan"],
  ["Dubai", "UAE"], ["Abu Dhabi", "UAE"], ["Riyadh", "KSA"], ["Jeddah", "KSA"],
  ["Madinah", "KSA"], ["Doha", "Qatar"], ["Kuwait City", "Kuwait"],
  ["Istanbul", "Türkiye"], ["Kuala Lumpur", "Malaysia"], ["Jakarta", "Indonesia"],
  ["London", "UK"], ["Manchester", "UK"], ["Birmingham", "UK"],
  ["Toronto", "Canada"], ["Mississauga", "Canada"], ["New York", "USA"],
  ["Houston", "USA"], ["Chicago", "USA"], ["Sydney", "Australia"],
];

const professionsF = [
  "Doctor (Resident)", "Teacher", "Islamic Scholar", "Architect", "Pharmacist",
  "Software Engineer", "Dentist", "Home-based Quran Teacher", "Graphic Designer",
  "Public Health Officer", "Nutritionist", "Homemaker", "Lawyer", "Content Writer",
  "Nurse", "Business Analyst", "Psychologist", "Alimah", "Fashion Entrepreneur", "Researcher",
];
const professionsM = [
  "Software Engineer", "Doctor", "Business Owner", "Government Employee", "Civil Engineer",
  "Accountant", "Islamic Scholar", "Teacher", "Pharmacist", "Product Manager",
  "Data Scientist", "Architect", "Lawyer", "Mechanical Engineer", "Financial Analyst",
  "Hafiz-ul-Quran", "Entrepreneur", "Dentist", "University Lecturer", "Consultant",
];

const educationsF = [
  "MBBS", "Bachelor's in Education", "Alimah Course", "Master's in Architecture",
  "PharmD", "BS Computer Science", "BDS", "Hifz + Bachelor's", "BFA",
  "MPH", "BS Nutrition", "Intermediate", "LLB", "BA English",
  "BScN", "MBA", "MS Psychology", "Alimah + Master's", "BBA", "MPhil",
];
const educationsM = [
  "BS Computer Science", "MBBS", "Master's in Finance", "PhD", "BE Civil",
  "ACCA", "Alim Course", "M.Ed", "PharmD", "MBA",
  "MS Data Science", "M.Arch", "LLB", "BE Mechanical", "CFA",
  "Hafiz + BS", "MBA", "BDS", "PhD", "MSc",
];

const sects = ["Sunni — Hanafi", "Sunni — Hanafi", "Sunni — Hanafi", "Sunni — Shafi'i", "Sunni — Hanbali"];
const prayers = ["Five Times", "Five Times in Mosque", "Five Times", "Regularly", "Five Times"];
const qurans = ["Daily", "Daily", "Learning (Hifz)", "Hafiz", "Weekly", "Daily"];
const hijabs = ["Regular", "Niqab", "Regular", "Regular", "Niqab"];
const beards = ["Sunnah Beard", "Sunnah Beard", "Trimmed", "Sunnah Beard"];

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

const pick = <T,>(arr: T[], i: number) => arr[i % arr.length];

const heightsF = ["5'1\"", "5'2\"", "5'3\"", "5'4\"", "5'5\"", "5'6\"", "5'7\""];
const heightsM = ["5'7\"", "5'8\"", "5'9\"", "5'10\"", "5'11\"", "6'0\"", "6'1\"", "6'2\""];

// Randomuser.me hosts realistic portraits. Fixed indices keep uniqueness.
const femalePhoto = (i: number) => `https://randomuser.me/api/portraits/women/${(i * 7 + 3) % 99}.jpg`;
const malePhoto = (i: number) => `https://randomuser.me/api/portraits/men/${(i * 5 + 11) % 99}.jpg`;

const slug = (name: string) => name.toLowerCase().split(" ")[0];

function buildFemale(i: number): Person {
  const name = femaleNames[i];
  const [city, country] = pick(cities, i + 1);
  return {
    id: `f-${slug(name)}-${i}`,
    name,
    age: 21 + (i % 10),
    city, country,
    profession: pick(professionsF, i),
    education: pick(educationsF, i),
    height: pick(heightsF, i),
    sect: pick(sects, i),
    compatibility: 78 + ((i * 13) % 21),
    verified: i % 4 !== 3,
    premium: i < 5,
    photo: femalePhoto(i),
    avatar: pick(grads, i),
    bio: pick(bios, i),
    prayer: pick(prayers, i),
    quran: pick(qurans, i),
    hijab: pick(hijabs, i),
    gender: "female",
  };
}

function buildMale(i: number): Person {
  const name = maleNames[i];
  const [city, country] = pick(cities, i + 7);
  return {
    id: `m-${slug(name)}-${i}`,
    name,
    age: 24 + (i % 12),
    city, country,
    profession: pick(professionsM, i),
    education: pick(educationsM, i),
    height: pick(heightsM, i),
    sect: pick(sects, i),
    compatibility: 76 + ((i * 11) % 23),
    verified: i % 5 !== 4,
    premium: i < 5,
    photo: malePhoto(i),
    avatar: pick(grads, i + 3),
    bio: pick(bios, (i + 3)),
    prayer: pick(prayers, i),
    quran: pick(qurans, i + 1),
    beard: pick(beards, i),
    gender: "male",
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
  sect: "Sunni — Hanafi",
  compatibility: 100,
  verified: true,
  premium: true,
  photo: "https://randomuser.me/api/portraits/men/32.jpg",
  avatar: grads[1],
  bio: "Trying to walk the middle path. Seeking a companion for Jannah.",
  prayer: "Five Times in Mosque",
  quran: "Daily",
  beard: "Sunnah Beard",
  gender: "male",
};

export type ChatMessage = {
  id: string;
  from: "me" | "them";
  text?: string;
  voice?: { seconds: number };
  time: string;
  read?: boolean;
};

export type ChatThread = {
  id: string;
  personId: string;
  lastAt: string;
  unread: number;
  typing?: boolean;
  messages: ChatMessage[];
};

const conversation = (personName: string): ChatMessage[] => {
  const first = personName.split(" ")[0];
  return [
    { id: "1", from: "them", text: `Assalamu alaikum. My family reviewed your profile — jazak Allah khair.`, time: "10:12", read: true },
    { id: "2", from: "me", text: "Wa alaikum assalam wa rahmatullah. Alhamdulillah, may Allah reward your family.", time: "10:14", read: true },
    { id: "3", from: "them", text: "Would our elders be able to speak this Friday after Maghrib, in shaa Allah?", time: "10:20", read: true },
    { id: "4", from: "me", text: "In shaa Allah. My father is available. Should I share his contact with your Wali?", time: "10:22", read: true },
    { id: "5", from: "them", voice: { seconds: 18 }, time: "10:25", read: true },
    { id: "6", from: "me", text: "Baarak Allahu feek. Please share a time that suits your family.", time: "10:30", read: true },
    { id: "7", from: "them", text: `Between Maghrib and Isha would be perfect. My Wali will coordinate.`, time: "11:02", read: true },
    { id: "8", from: "me", text: "Noted. Jazak Allah khair — looking forward.", time: "11:05", read: true },
    { id: "9", from: "them", text: `May Allah make this easy for us both, ${first === "Aisha" ? "ameen" : "ameen"}.`, time: "11:40" },
    { id: "10", from: "them", voice: { seconds: 22 }, time: "12:04" },
  ];
};

export const chats: ChatThread[] = people.slice(0, 8).map((p, idx) => ({
  id: `c${idx + 1}`,
  personId: p.id,
  lastAt: ["Now", "12:04", "11:40", "Yest.", "Mon", "Sun", "2d", "3d"][idx] ?? "3d",
  unread: idx === 0 ? 2 : idx === 2 ? 1 : 0,
  typing: idx === 0,
  messages: conversation(p.name),
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
  { id: "n1", bucket: "today", kind: "proposal", personId: people[0].id, title: "New proposal received", desc: `${people[0].name.split(" ")[0]}'s family sent a proposal.`, time: "Just now", read: false },
  { id: "n2", bucket: "today", kind: "message", personId: people[1].id, title: "New message", desc: `"Jazak Allah khair for the proposal."`, time: "1h", read: false },
  { id: "n3", bucket: "today", kind: "compat", personId: people[6].id, title: "Highly compatible profile", desc: `96% compatibility with ${people[6].name}.`, time: "3h", read: false },
  { id: "n4", bucket: "yesterday", kind: "wali", personId: people[2].id, title: "Wali confirmed", desc: `Your Wali approved conversation with ${people[2].name.split(" ")[0]}.`, time: "Yesterday", read: true },
  { id: "n5", bucket: "yesterday", kind: "verify", title: "Verification approved", desc: "Your CNIC and selfie were successfully verified.", time: "Yesterday", read: true },
  { id: "n6", bucket: "earlier", kind: "premium", title: "Misaq Premium", desc: "Members with Premium receive 4× more sincere proposals.", time: "3d", read: true },
  { id: "n7", bucket: "earlier", kind: "proposal", personId: people[3].id, title: "Proposal viewed", desc: `${people[3].name.split(" ")[0]} viewed your proposal.`, time: "5d", read: true },
];

export const findPerson = (id: string) => people.find((p) => p.id === id) ?? people[0];
export const findChat = (id: string) => chats.find((c) => c.id === id) ?? chats[0];
