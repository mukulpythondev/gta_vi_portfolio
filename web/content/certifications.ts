/** Course certificates, read from github.com/mukulpythondev/Certifications. Each links to Coursera's verification page. */
export type Certification = { issuer: "Meta" | "Google"; title: string; date: string; verify: string };

export const certificationsRepo = "https://github.com/mukulpythondev/Certifications";

export const certifications: Certification[] = [
  { issuer: "Meta", title: "Advanced React", date: "1 Aug 2023", verify: "https://coursera.org/verify/3F9X7DUZVGSL" },
  { issuer: "Meta", title: "Front-End Developer Capstone", date: "28 Aug 2023", verify: "https://coursera.org/verify/6L6GWV79PMNR" },
  { issuer: "Meta", title: "Principles of UX/UI Design", date: "14 Aug 2023", verify: "https://coursera.org/verify/W5UCVUDY98KC" },
  { issuer: "Meta", title: "Version Control", date: "3 Aug 2023", verify: "https://coursera.org/verify/KRQRKYCDN3WN" },
  { issuer: "Meta", title: "React Basics", date: "23 Jul 2023", verify: "https://coursera.org/verify/8EHF67A7SXQ6" },
  { issuer: "Meta", title: "HTML and CSS in depth", date: "12 Jul 2023", verify: "https://coursera.org/verify/7D3YERCHDF54" },
  { issuer: "Meta", title: "Introduction to Back-End Development", date: "7 Jul 2023", verify: "https://coursera.org/verify/8Y6B83URUCUW" },
  { issuer: "Meta", title: "Programming with JavaScript", date: "6 Jul 2023", verify: "https://coursera.org/verify/SC9C9B2N8MMC" },
  { issuer: "Meta", title: "Introduction to Front-End Development", date: "1 Jul 2023", verify: "https://coursera.org/verify/S2CFGXPFKFUV" },
  { issuer: "Google", title: "Introduction to Git and GitHub", date: "24 Jun 2023", verify: "https://coursera.org/verify/FEBRLLAS38VK" },
];
