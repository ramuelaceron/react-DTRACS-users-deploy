import avatarImg1 from '../assets/images/avatar1.png';

export const schoolAccountData = {
  user_id: "SCHOOL-0001",
  first_name: "Ramuel",
  middle_name: "B.",
  last_name: "Aceron",
  email: "aceronramuel@gmail.com",
  contact_number: "+63 9123456789",
  position: "Principal",
  password: "admin",
  registration_date: "2025-08-28T08:24:58.083191",
  active: true,
  avatar: "",
  school_name: "Binan Integrated National High School",
  school_address: "Nong Sto. Domingo, Biñan City, Laguna, 4024",
}

export const focalAccountData = {
  user_id: "FOCAL-0001",
  first_name: "Isidra",
  middle_name: "Lopez",
  last_name: "Galman",
  office: "School Governance and Operations Division",
  email: "example@deped.edu.ph",
  contact_number: "+63 9123456789",
  password: "admin",
  registration_date: "2025-08-28T08:24:58.083191",
  active: true,
  avatar: "",
  section_designation: "School Management Monitoring and Evaluation",
  address: "Nong Sto. Domingo, Biñan City, Laguna, 4024",
}

schoolAccountData.fullName = `${schoolAccountData.first_name} ${schoolAccountData.middle_name} ${schoolAccountData.last_name}`.trim();
focalAccountData.fullName = `${focalAccountData.first_name} ${focalAccountData.middle_name} ${focalAccountData.last_name}`.trim();

// 📚 Export lookup map by email
export const loginAccounts = {
  [schoolAccountData.email]: schoolAccountData,
  [focalAccountData.email]: focalAccountData,
};

// ✅ Now define userAvatars — all values are initialized
export const userAvatars = {
  // Full name (lowercase)
  [schoolAccountData.fullName.toLowerCase()]: schoolAccountData.avatar,
  [focalAccountData.fullName.toLowerCase()]: focalAccountData.avatar,

  // Email
  [schoolAccountData.email]: schoolAccountData.avatar,
  [focalAccountData.email]: focalAccountData.avatar,

  // First + Last
  [`${schoolAccountData.first_name} ${schoolAccountData.last_name}`.toLowerCase()]: schoolAccountData.avatar,
  [`${focalAccountData.first_name} ${focalAccountData.last_name}`.toLowerCase()]: focalAccountData.avatar,
};