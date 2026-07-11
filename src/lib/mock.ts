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
  avatar: string; // gradient class or url
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

export const people: Person[] = [
  { id: "aisha", name: "Aisha Rahman", age: 24, city: "Lahore", country: "Pakistan", profession: "Doctor (Resident)", education: "MBBS", height: "5'4\"", sect: "Sunni — Hanafi", compatibility: 94, verified: true, premium: true, avatar: grads[0], bio: "Seeking a partner who values deen and family. Alhamdulillah, memorising 15th juz.", prayer: "Five Times", quran: "Daily", hijab: "Niqab", gender: "female" },
  { id: "hamza", name: "Hamza Siddiqui", age: 28, city: "Karachi", country: "Pakistan", profession: "Software Engineer", education: "BS Computer Science", height: "5'11\"", sect: "Sunni — Hanafi", compatibility: 91, verified: true, avatar: grads[1], bio: "Engineer by profession, student of knowledge in the evenings. Practising the Sunnah.", prayer: "Five Times in Mosque", quran: "Daily", beard: "Sunnah Beard", gender: "male" },
  { id: "maryam", name: "Maryam Iqbal", age: 22, city: "Islamabad", country: "Pakistan", profession: "Teacher", education: "Bachelor's in Education", height: "5'3\"", sect: "Sunni — Hanafi", compatibility: 88, verified: true, avatar: grads[3], bio: "Teacher, book lover, aspiring hafiza. Family is everything.", prayer: "Five Times", quran: "Learning (Hifz)", hijab: "Regular", gender: "female" },
  { id: "yusuf", name: "Yusuf Khan", age: 30, city: "Dubai", country: "UAE", profession: "Business Owner", education: "Master's in Finance", height: "6'0\"", sect: "Sunni — Hanafi", compatibility: 86, verified: true, premium: true, avatar: grads[2], bio: "Building a halal business, striving to raise a religious family in shaa Allah.", prayer: "Five Times", quran: "Daily", beard: "Sunnah Beard", gender: "male" },
  { id: "fatima", name: "Fatima Noor", age: 26, city: "London", country: "UK", profession: "Architect", education: "Master's in Architecture", height: "5'5\"", sect: "Sunni — Shafi'i", compatibility: 83, verified: false, avatar: grads[7], bio: "British-raised, seeking a partner rooted in the deen. Love travel and Qur'anic reflection.", prayer: "Five Times", quran: "Daily", hijab: "Regular", gender: "female" },
  { id: "bilal", name: "Bilal Ahmed", age: 27, city: "Toronto", country: "Canada", profession: "Doctor", education: "MD", height: "5'10\"", sect: "Sunni — Hanafi", compatibility: 89, verified: true, avatar: grads[5], bio: "Physician, hafiz-ul-Quran, seeking a life partner walking the same path.", prayer: "Five Times in Mosque", quran: "Hafiz", beard: "Sunnah Beard", gender: "male" },
  { id: "khadija", name: "Khadija Malik", age: 25, city: "Riyadh", country: "KSA", profession: "Islamic Scholar", education: "Alimah Course", height: "5'4\"", sect: "Sunni — Hanafi", compatibility: 96, verified: true, premium: true, avatar: grads[4], bio: "Alimah, seeking a partner grounded in the Sunnah. Family involvement essential.", prayer: "Five Times", quran: "Hafiza", hijab: "Niqab", gender: "female" },
  { id: "ibrahim", name: "Ibrahim Raza", age: 32, city: "Manchester", country: "UK", profession: "Government Employee", education: "PhD", height: "5'9\"", sect: "Sunni — Hanafi", compatibility: 81, verified: true, avatar: grads[6], bio: "Academic and revert-support volunteer. Seeking sakinah.", prayer: "Five Times", quran: "Daily", beard: "Sunnah Beard", gender: "male" },
];

export const meMember: Person = { id: "me", name: "Ahmed Raza", age: 27, city: "Lahore", country: "Pakistan", profession: "Software Engineer", education: "BS Computer Science", height: "5'10\"", sect: "Sunni — Hanafi", compatibility: 100, verified: true, premium: true, avatar: grads[1], bio: "Trying to walk the middle path. Seeking a companion for Jannah.", prayer: "Five Times in Mosque", quran: "Daily", beard: "Sunnah Beard", gender: "male" };

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
  messages: ChatMessage[];
};

export const chats: ChatThread[] = [
  {
    id: "c1", personId: "aisha", lastAt: "12:04", unread: 2,
    messages: [
      { id: "m1", from: "them", text: "Assalamu alaikum. My family reviewed your profile — jazak Allah khair.", time: "11:40" },
      { id: "m2", from: "me", text: "Wa alaikum assalam. Alhamdulillah, when would be convenient for our elders to speak?", time: "11:48" },
      { id: "m3", from: "them", text: "This Friday after Maghrib, in shaa Allah?", time: "12:02" },
      { id: "m4", from: "them", voice: { seconds: 18 }, time: "12:04" },
    ],
  },
  { id: "c2", personId: "hamza", lastAt: "Yest.", unread: 0, messages: [{ id: "m1", from: "them", text: "Jazak Allah khair for the proposal.", time: "Yest." }] },
  { id: "c3", personId: "maryam", lastAt: "Mon", unread: 1, messages: [{ id: "m1", from: "them", text: "Barak Allahu feek.", time: "Mon" }] },
  { id: "c4", personId: "yusuf", lastAt: "3d", unread: 0, messages: [{ id: "m1", from: "me", text: "Assalamu alaikum.", time: "3d" }] },
];

export const proposals = {
  received: [people[0], people[2], people[4]],
  sent: [people[1], people[3]],
  accepted: [people[5]],
};

export const findPerson = (id: string) => people.find((p) => p.id === id) ?? people[0];
export const findChat = (id: string) => chats.find((c) => c.id === id) ?? chats[0];
