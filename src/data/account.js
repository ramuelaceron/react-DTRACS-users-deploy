import avatarImg1 from '../assets/images/avatar1.png';
import avatarImg2 from '../assets/images/avatar2.png';

// 🔐 School User
export const schoolAccountData = {
  avatar: avatarImg1,
  firstName: "Juan",
  middleName: "Ponce",
  lastName: "Dela Cruz",
  email: "juandelacruz@gmail.com",
  contactNumber: "+63 9123456789",
  position: "Principal",
  school: "Binan Integrated National High School",
  schoolAddress: "Nong Sto. Domingo, Biñan City, Laguna, 4024",
  password: "admin", // 🔒 demo password
};

// 🔐 Office User
export const officeAccountData = {
  avatar: avatarImg2,
  firstName: "Isidra",
  middleName: "Lopez",
  lastName: "Galman",
  email: "example@deped.edu.ph",
  contactNumber: "+63 9123456789",
  position: "Master Teacher I",
  office: "DepEd Binan SGOD",
  Address: "Nong Sto. Domingo, Biñan City, Laguna, 4024",
  password: "admin", // 🔒 same for demo
};

schoolAccountData.fullName = `${schoolAccountData.firstName} ${schoolAccountData.middleName} ${schoolAccountData.lastName}`.trim();
officeAccountData.fullName = `${officeAccountData.firstName} ${officeAccountData.middleName} ${officeAccountData.lastName}`.trim();

// 📚 Export lookup map by email
export const loginAccounts = {
  [schoolAccountData.email]: schoolAccountData,
  [officeAccountData.email]: officeAccountData,
};

// ✅ Now define userAvatars — all values are initialized
export const userAvatars = {
  // Full name (lowercase)
  [schoolAccountData.fullName.toLowerCase()]: schoolAccountData.avatar,
  [officeAccountData.fullName.toLowerCase()]: officeAccountData.avatar,

  // Email
  [schoolAccountData.email]: schoolAccountData.avatar,
  [officeAccountData.email]: officeAccountData.avatar,

  // First + Last
  [`${schoolAccountData.firstName} ${schoolAccountData.lastName}`.toLowerCase()]: schoolAccountData.avatar,
  [`${officeAccountData.firstName} ${officeAccountData.lastName}`.toLowerCase()]: officeAccountData.avatar,
};