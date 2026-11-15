/** Course certificates, read from github.com/mukulpythondev/Certifications. Each links to Coursera's verification page. */
export type Certification = { issuer: "Meta" | "Google"; title: string; date: string; verify: string };

/** Proctored professional certifications, shown above the course list. */
export type ProCertification = {
  issuer: string;
  title: string;
  level: string;
  issued: string;
  validUntil: string;
  badge: string;
  verify: string;
  covers: string[];
};

export const proCertifications: ProCertification[] = [
  {
    issuer: "Oracle",
    title: "OCI 2025 Certified AI Foundations Associate",
    level: "Oracle Certified · Foundations Associate",
    issued: "17 Oct 2025",
    validUntil: "Oct 2027",
    badge: "/certs/oci-ai-foundations-2025.webp",
    verify:
      "https://catalog-education.oracle.com/ords/certview/sharebadge_m?id=9079AD3E2DB0260D0569A1062807EFA4F7AD2480F04D31208713EB0AB82392A0",
    covers: ["AI and ML fundamentals", "Deep learning", "LLMs and generative AI", "OCI AI services", "Oracle 23ai Select AI"],
  },
];

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
