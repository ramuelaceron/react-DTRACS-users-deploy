
  import BCSTHS from "../assets/schoolsImages/BCST-HS.png";
  import BCSHSSAC from "../assets/schoolsImages/BCSHS-SAC.png";
  import BCSHSSTC from "../assets/schoolsImages/BCSHS-STC.png";
  import BCSHSTC from "../assets/schoolsImages/BCSHS-TC.png";
  import BCSHSWC from "../assets/schoolsImages/BCSHS-WC.png";
  import BES from "../assets/schoolsImages/BES.png";
  import BINHS from "../assets/schoolsImages/BINHS.png";
  import BSSAA from "../assets/schoolsImages/BSSAA.png";
  import CES from "../assets/schoolsImages/CES.png";
  import DPESM from "../assets/schoolsImages/DPES-Main.png";
  import DPNHS from "../assets/schoolsImages/DPNHS.png";
  import DPESW from "../assets/schoolsImages/DPES-West.png";
  import DJTMES from "../assets/schoolsImages/DJTMES.png";
  import DMZBMES from "../assets/schoolsImages/DMZBMES.png";
  import GES from "../assets/schoolsImages/GES.png";
  import JZGMNHS from "../assets/schoolsImages/JZGMNHS.png";
  import LES from "../assets/schoolsImages/LES.png";
  import LES2 from "../assets/schoolsImages/LES2.png";
  import MEES from "../assets/schoolsImages/MEES.png";
  import MES from "../assets/schoolsImages/MES.png";
  import MES2 from "../assets/schoolsImages/MES2.png";
  import MNHS from "../assets/schoolsImages/MNHS.png";
  import NRJNHS from "../assets/schoolsImages/NRJ-NHS.png";
  import OLES from "../assets/schoolsImages/OLES.png";
  import PES from "../assets/schoolsImages/PES.png";
  import PHEMS from "../assets/schoolsImages/PHEMS.png";
  import PENP from "../assets/schoolsImages/PENP.png";
  import SAIS from "../assets/schoolsImages/SAIS.png";
  import SFNHS from "../assets/schoolsImages/SFNHS.png";
  import SFES from "../assets/schoolsImages/SFES.png";
  import SVES from "../assets/schoolsImages/SVES.png";
  import SSES from "../assets/schoolsImages/SSES.png";
  import S5ES from "../assets/schoolsImages/S5ES.png";
  import S5AES from "../assets/schoolsImages/S5AES.png";
  import S5AINHS from "../assets/schoolsImages/S5AINHS.png";
  import STES from "../assets/schoolsImages/STES.png";
  import TES from "../assets/schoolsImages/TES.png";
  import TATMES from "../assets/schoolsImages/TATMES.png";
  import TES2 from "../assets/schoolsImages/TES2.png";
  import ZES from "../assets/schoolsImages/ZES.png";
  import avatarImg1 from '../assets/images/avatar1.png';
  import { createSlug } from "../utils/idGenerator";

  export const rawSchoolAccounts = [
    {
      name: "Biñan City Science & Technology High School",
      schoolAddress: "Silmer Village San Francisco, Biñan City, Laguna, 4024",
      logo: BCSTHS,
      accounts: [
        {
          id: 1,
          avatar: avatarImg1,
          firstName: "Juan",
          middleName: "Ponce",
          lastName: "Dela Cruz",
          email: "juandelacruz@gmail.com",
          position: "Principal",
        },
        {
          id: 2,
          avatar: avatarImg1,
          firstName: "Juan",
          middleName: "Ponce",
          lastName: "Dela Cruz",
          email: "juandelacruz@gmail.com",
          position: "Representative",
        },
      ],
    },
    {
      name: "Biñan City Senior High School-San Antonio Campus",
      schoolAddress: "Escueta St., San Antonio, Biñan City, Laguna, 4024",
      logo: BCSHSSAC,
      accounts: [
        {
          id: 1,
          avatar: avatarImg1,
          firstName: "Juan",
          middleName: "Ponce",
          lastName: "Dela Cruz",
          email: "juandelacruz@gmail.com",
          position: "Principal",
        },
      ],
    },
    {
      name: "Biñan City Senior High School-Sto.Tomas Campus",
      schoolAddress: "Tagbilaran St., Sussna Homes, Sto. Tomas, Biñan City, Laguna, 4024",
      logo: BCSHSSTC,
      accounts: [
        {
          id: 1,
          avatar: avatarImg1,
          firstName: "Juan",
          middleName: "Ponce",
          lastName: "Dela Cruz",
          email: "juandelacruz@gmail.com",
          position: "Principal",
        },
      ],
    },
    {
      name: "Biñan City Senior High School-Timbao Campus",
      schoolAddress: "La Solidaridad Estate Homes Timbao,  Biñan City, Laguna, 4024",
      logo: BCSHSTC,
      accounts: [
        {
          id: 1,
          avatar: avatarImg1,
          firstName: "Juan",
          middleName: "Ponce",
          lastName: "Dela Cruz",
          email: "juandelacruz@gmail.com",
          position: "Principal",
        },
      ],
    },
    {
      name: "Biñan City Senior High School-West Campus",
      schoolAddress: "Purok 3, Langkiwa, Biñan City, Laguna, 4024",
      logo: BCSHSWC,
      accounts: [
        {
          id: 1,
          avatar: avatarImg1,
          firstName: "Juan",
          middleName: "Ponce",
          lastName: "Dela Cruz",
          email: "juandelacruz@gmail.com",
          position: "Principal",
        },
      ],
    },
    {
      name: "Biñan Elementary School",
      schoolAddress: "P. Burgos St., Sto. Domingo, Biñan City, Laguna, 4024",
      logo: BES,
      accounts: [
        {
          id: 1,
          avatar: avatarImg1,
          firstName: "Juan",
          middleName: "Ponce",
          lastName: "Dela Cruz",
          email: "juandelacruz@gmail.com",
          position: "Principal",
        },
      ],
    },
    {
      name: "Binan Integrated National High School",
      schoolAddress: "Nong Sto. Domingo, Biñan City, Laguna, 4024",
      logo: BINHS,
      accounts: [
        {
          id: 1,
          avatar: avatarImg1,
          firstName: "Juan",
          middleName: "Ponce",
          lastName: "Dela Cruz",
          email: "juandelacruz@gmail.com",
          position: "Principal",
        },
      ],
    },
    {
      name: "Binan Secondary School of Applied Academics",
      schoolAddress: "Purok 3 Brgy. Sto. Tomas, Biñan City, Laguna, 4024",
      logo: BSSAA,
      accounts: [
        {
          id: 1,
          avatar: avatarImg1,
          firstName: "Juan",
          middleName: "Ponce",
          lastName: "Dela Cruz",
          email: "juandelacruz@gmail.com",
          position: "Principal",
        },
      ],
    },
    {
      name: "Canlalay Elementary School",
      schoolAddress: "Maribel Subd, Canlalay, Biñan City, Laguna, 4024",
      logo: CES,
      accounts: [
        {
          id: 1,
          avatar: avatarImg1,
          firstName: "Juan",
          middleName: "Ponce",
          lastName: "Dela Cruz",
          email: "juandelacruz@gmail.com",
          position: "Principal",
        },
      ],
    },
    {
      name: "Dela Paz Main Elementary School",
      schoolAddress: "P. Paterno St., Dela Paz, Biñan City, Laguna, 4024",
      logo: DPESM,
      accounts: [
        {
          id: 1,
          avatar: avatarImg1,
          firstName: "Juan",
          middleName: "Ponce",
          lastName: "Dela Cruz",
          email: "juandelacruz@gmail.com",
          position: "Principal",
        },
      ],
    },
    {
      name: "Dela Paz National High School",
      schoolAddress: "Almeda Subd, Dela Paz, Biñan City, Laguna, 4024",
      logo: DPNHS,
      accounts: [
        {
          id: 1,
          avatar: avatarImg1,
          firstName: "Juan",
          middleName: "Ponce",
          lastName: "Dela Cruz",
          email: "juandelacruz@gmail.com",
          position: "Principal",
        },
      ],
    },
    {
      name: "Dela Paz West Elementary School",
      schoolAddress: "Almeda Subd, Dela Paz, Biñan City, Laguna, 4024",
      logo: DPESW,
      accounts: [
        {
          id: 1,
          avatar: avatarImg1,
          firstName: "Juan",
          middleName: "Ponce",
          lastName: "Dela Cruz",
          email: "juandelacruz@gmail.com",
          position: "Principal",
        },
      ],
    },
    {
      name: "Dr. Jose G. Tamayo Memorial Elementary School",
      schoolAddress: "Purok 4 Sto. Niño, Biñan City, Laguna, 4024",
      logo: DJTMES,
      accounts: [
        {
          id: 1,
          avatar: avatarImg1,
          firstName: "Juan",
          middleName: "Ponce",
          lastName: "Dela Cruz",
          email: "juandelacruz@gmail.com",
          position: "Principal",
        },
      ],
    },
    {
      name: "Dr. Marcelino Z. Batista Memorial Elementary School",
      schoolAddress: "Batist Subd, San Jose, Biñan City, Laguna, 4024",
      logo: DMZBMES,
      accounts: [
        {
          id: 1,
          avatar: avatarImg1,
          firstName: "Juan",
          middleName: "Ponce",
          lastName: "Dela Cruz",
          email: "juandelacruz@gmail.com",
          position: "Principal",
        },
      ],
    },
    {
      name: "Ganado Elementary School",
      schoolAddress: "Ganado, Biñan City, Laguna, 4024",
      logo: GES,
      accounts: [
        {
          id: 1,
          avatar: avatarImg1,
          firstName: "Juan",
          middleName: "Ponce",
          lastName: "Dela Cruz",
          email: "juandelacruz@gmail.com",
          position: "Principal",
        },
      ],
    },
    {
      name: "Jacobo Z Gonzales Memorial National High School",
      schoolAddress: "Romana Subd., San Antonio, Biñan City, Laguna, 4024",
      logo: JZGMNHS,
      accounts: [
        {
          id: 1,
          avatar: avatarImg1,
          firstName: "Juan",
          middleName: "Ponce",
          lastName: "Dela Cruz",
          email: "juandelacruz@gmail.com",
          position: "Principal",
        },
      ],
    },
    {
      name: "Langiwa Elementary School",
      schoolAddress: "Purok 2 Langkiwa, Biñan City, Laguna, 4024",
      logo: LES,
      accounts: [
        {
          id: 1,
          avatar: avatarImg1,
          firstName: "Juan",
          middleName: "Ponce",
          lastName: "Dela Cruz",
          email: "juandelacruz@gmail.com",
          position: "Principal",
        },
      ],
    },
    {
      name: "Loma Elementary School",
      schoolAddress: "Catleya St., Loma, Biñan City, Laguna, 4024",
      logo: LES2,
      accounts: [
        {
          id: 1,
          avatar: avatarImg1,
          firstName: "Juan",
          middleName: "Ponce",
          lastName: "Dela Cruz",
          email: "juandelacruz@gmail.com",
          position: "Principal",
        },
      ],
    },
    {
      name: "Malaban Elementary School",
      schoolAddress: "Ilaya St., Malaban, Biñan City, Laguna, 4024",
      logo: MES2,
      accounts: [
        {
          id: 1,
          avatar: avatarImg1,
          firstName: "Juan",
          middleName: "Ponce",
          lastName: "Dela Cruz",
          email: "juandelacruz@gmail.com",
          position: "Principal",
        },
      ],
    },
    {
      name: "Malaban East Elementary School",
      schoolAddress: "Purok 2 Mamplasan, Biñan City, Laguna, 4024",
      logo: MEES,
      accounts: [
        {
          id: 1,
          avatar: avatarImg1,
          firstName: "Juan",
          middleName: "Ponce",
          lastName: "Dela Cruz",
          email: "juandelacruz@gmail.com",
          position: "Principal",
        },
      ],
    },
    {
      name: "Mamplasan Elementary School",
      schoolAddress: "Purok 2 Mamplasan, Biñan City, Laguna, 4024",
      logo: MES,
      accounts: [
        {
          id: 1,
          avatar: avatarImg1,
          firstName: "Juan",
          middleName: "Ponce",
          lastName: "Dela Cruz",
          email: "juandelacruz@gmail.com",
          position: "Principal",
        },
      ],
    },
    {
      name: "Mamplasan National High School",
      schoolAddress: "B6, L5 ST. Rose Village 2 Brgy. Casile, Biñan City, Laguna, 4024",
      logo: MNHS,
      accounts: [
        {
          id: 1,
          avatar: avatarImg1,
          firstName: "Juan",
          middleName: "Ponce",
          lastName: "Dela Cruz",
          email: "juandelacruz@gmail.com",
          position: "Principal",
        },
      ],
    },
    {
      name: "Nereo R. Joaquin Memorial National High School",
      schoolAddress: "B6, L5 ST. Rose Village 2 Brgy. Casile, Biñan City, Laguna, 4024",
      logo: NRJNHS,
      accounts: [
        {
          id: 1,
          avatar: avatarImg1,
          firstName: "Juan",
          middleName: "Ponce",
          lastName: "Dela Cruz",
          email: "juandelacruz@gmail.com",
          position: "Principal",
        },
      ],
    },
    {
      name: "Our Lady of Lourdes Elementary School",
      schoolAddress: "B6, L5 ST. Rose Village 2 Brgy. Casile, Biñan City, Laguna, 4024",
      logo: OLES,
      accounts: [
        {
          id: 1,
          avatar: avatarImg1,
          firstName: "Juan",
          middleName: "Ponce",
          lastName: "Dela Cruz",
          email: "juandelacruz@gmail.com",
          position: "Principal",
        },
      ],
    },
    {
      name: "Pagkakaisa Elementary School",
      schoolAddress: "Romana Subd., San Antonio, Biñan City, Laguna, 4024",
      logo: PES,
      accounts: [
        {
          id: 1,
          avatar: avatarImg1,
          firstName: "Juan",
          middleName: "Ponce",
          lastName: "Dela Cruz",
          email: "juandelacruz@gmail.com",
          position: "Principal",
        },
      ],
    },
    {
      name: "Pedro H. Escueta Memorial Elementary School",
      schoolAddress: "Bing St., Garcia San Antonio, Biñan City, Laguna, 4024",
      logo: PHEMS,
      accounts: [
        {
          id: 1,
          avatar: avatarImg1,
          firstName: "Juan",
          middleName: "Ponce",
          lastName: "Dela Cruz",
          email: "juandelacruz@gmail.com",
          position: "Principal",
        },
      ],
    },
    {
      name: "Platero Elementary School",
      schoolAddress: "Nielo St. Platero, Biñan City, Laguna, 4024",
      logo: PENP,
      accounts: [
        {
          id: 1,
          avatar: avatarImg1,
          firstName: "Juan",
          middleName: "Ponce",
          lastName: "Dela Cruz",
          email: "juandelacruz@gmail.com",
          position: "Principal",
        },
      ],
    },
    {
      name: "Saint Anthony Integrated School",
      schoolAddress: "St. Franciss VII, San Antonio, Biñan, Laguna",
      logo: SAIS,
      accounts: [
        {
          id: 1,
          avatar: avatarImg1,
          firstName: "Juan",
          middleName: "Ponce",
          lastName: "Dela Cruz",
          email: "juandelacruz@gmail.com",
          position: "Principal",
        },
      ],
    },
    {
      name: "Saint Francis Integrated National High School",
      schoolAddress: "Tuklas St., Halang Rd. Brgy. San Francisco, Biñan City, Laguna, 4024",
      logo: SFNHS,
      accounts: [
        {
          id: 1,
          avatar: avatarImg1,
          firstName: "Juan",
          middleName: "Ponce",
          lastName: "Dela Cruz",
          email: "juandelacruz@gmail.com",
          position: "Principal",
        },
      ],
    },
    {
      name: "San Francisco Elementary School",
      schoolAddress: "Tuklas St., San Francisco, Biñan City, Laguna, 4024",
      logo: SFES,
      accounts: [
        {
          id: 1,
          avatar: avatarImg1,
          firstName: "Juan",
          middleName: "Ponce",
          lastName: "Dela Cruz",
          email: "juandelacruz@gmail.com",
          position: "Principal",
        },
      ],
    },
    {
      name: "San Vicente Elementary School",
      schoolAddress: "Malvar St., San Vicente, Biñan City, Laguna, 4024",
      logo: SVES,
      accounts: [
        {
          id: 1,
          avatar: avatarImg1,
          firstName: "Juan",
          middleName: "Ponce",
          lastName: "Dela Cruz",
          email: "juandelacruz@gmail.com",
          position: "Principal",
        },
      ],
    },
    {
      name: "Soro-Soro Elementary School",
      schoolAddress: "4 Soro-Soro, Biñan City, Laguna, 4024",
      logo: SSES,
      accounts: [
        {
          id: 1,
          avatar: avatarImg1,
          firstName: "Juan",
          middleName: "Ponce",
          lastName: "Dela Cruz",
          email: "juandelacruz@gmail.com",
          position: "Principal",
        },
      ],
    },
    {
      name: "Southville 5 Elementary School",
      schoolAddress: "B25, L2 Timbao, Biñan City, Laguna, 4024",
      accounts: 0,
      logo: S5ES,
    },
    {
      name: "Southville 5A Elementary School",
      schoolAddress: "Southville 5A Langkiwa, Biñan City, Laguna, 4024",
      logo: S5AES,
      accounts: [
        {
          id: 1,
          avatar: avatarImg1,
          firstName: "Juan",
          middleName: "Ponce",
          lastName: "Dela Cruz",
          email: "juandelacruz@gmail.com",
          position: "Principal",
        },
      ],
    },
    {
      name: "Southville 5A National High School",
      schoolAddress: "Southville 5A Langkiwa, Biñan City, Laguna, 4024",
      logo: S5AINHS,
      accounts: [
        {
          id: 1,
          avatar: avatarImg1,
          firstName: "Juan",
          middleName: "Ponce",
          lastName: "Dela Cruz",
          email: "juandelacruz@gmail.com",
          position: "Principal",
        },
      ],
    },
    {
      name: "Sto.Tomas Elementary School",
      schoolAddress: "Purok 5 Sto. Tomas, Biñan City, Laguna, 4024",
      logo: STES,
      accounts: [
        {
          id: 1,
          avatar: avatarImg1,
          firstName: "Juan",
          middleName: "Ponce",
          lastName: "Dela Cruz",
          email: "juandelacruz@gmail.com",
          position: "Principal",
        },
      ],
    },
    {
      name: "Timbao Elementary School",
      schoolAddress: "Purok 2, Timbao, Biñan City, Laguna, 4024",
      logo: TES,
      accounts: [
        {
          id: 1,
          avatar: avatarImg1,
          firstName: "Juan",
          middleName: "Ponce",
          lastName: "Dela Cruz",
          email: "juandelacruz@gmail.com",
          position: "Principal",
        },
      ],
    },
    {
      name: "Tomas A. Turalba Main Elementary School",
      schoolAddress: "China St., Town & Country Southville Subd, Sto. Tomas, Biñan City, Laguna, 4024",
      logo: TATMES,
      accounts: [
        {
          id: 1,
          avatar: avatarImg1,
          firstName: "Juan",
          middleName: "Ponce",
          lastName: "Dela Cruz",
          email: "juandelacruz@gmail.com",
          position: "Principal",
        },
      ],
    },
    {
      name: "Tubigan Elementary School",
      schoolAddress: "Purok 3 Brgy. Tubigan, Biñan City, Laguna, 4024",
      logo: TES2,
      accounts: [
        {
          id: 1,
          avatar: avatarImg1,
          firstName: "Juan",
          middleName: "Ponce",
          lastName: "Dela Cruz",
          email: "juandelacruz@gmail.com",
          position: "Principal",
        },
      ],
    },
    {
      name: "Zapote Elementary School",
      schoolAddress: "Zapote, Biñan City, Laguna, 4024",
      logo: ZES,
      accounts: [
        {
          id: 1,
          avatar: avatarImg1,
          firstName: "Juan",
          middleName: "Ponce",
          lastName: "Dela Cruz",
          email: "juandelacruz@gmail.com",
          position: "Principal",
        },
      ],
    },
  ];

  export const schoolAccounts = rawSchoolAccounts.map(school => ({
  ...school,
  slug: createSlug(school.name)
  }));