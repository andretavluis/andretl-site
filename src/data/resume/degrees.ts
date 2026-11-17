import type { LogoKey } from '../logos';

export interface Degree {
  school: string;
  logo?: LogoKey;
  degree: string;
  link: string;
  year: number;
}

const degrees: Degree[] = [
  {
    school: 'Instituto Superior Técnico',
    logo: 'tecnicoLisboa',
    degree: "Master's degree, Data Science and Engineering",
    link: 'https://tecnico.ulisboa.pt/',
    year: 2022,
  },
  {
    school: 'NOVA IMS Information Management School',
    logo: 'novaIms',
    degree: "Bachelor's degree, Information Management",
    link: 'https://www.novaims.unl.pt/',
    year: 2020,
  },
  {
    school: 'University of Ljubljana, Faculty of Economics',
    logo: 'universityOfLjubljana',
    degree: 'Exchange Semester, Business Administration and Management',
    link: 'https://www.ef.uni-lj.si/',
    year: 2020,
  },
];

export default degrees;
