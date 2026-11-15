import type { Experience, Pending } from "./types";
export const experience: Experience[] = [
  {
    slug: "firsthuman-tech",
    company: "FirstHuman Tech",
    role: "Software Engineer (Remote, Australia)",
    duration: "Dec 2025 – Present",
    description:
      "Retrieval and document AI over 5,000+ enterprise documents, handwriting included.",
    plain: "Helps a company get answers out of thousands of its own documents, handwritten forms included, by building the search and reading systems underneath.",
    responsibilities: [
      "Built a retrieval system over 5,000+ enterprise documents using embeddings and vector search.",
      "Shipped a handwriting OCR pipeline on Azure Document Intelligence for semi-structured enterprise forms.",
      "Built FastAPI, PostgreSQL, Redis and Kafka services for concurrent document ingestion and reliable reprocessing.",
    ],
    technologies: [
      "Python",
      "FastAPI",
      "PostgreSQL",
      "Redis",
      "Kafka",
      "RAG",
      "Embeddings",
      "Vector search",
      "Re-ranking",
      "Azure Document Intelligence",
    ],
    challenges: [
      "Raising retrieval quality across a large, mixed document set.",
      "Reading handwriting reliably on semi-structured forms.",
      "Keeping ingestion correct under concurrency, with safe reprocessing when a step fails.",
    ],
    impact: [
      "Improved retrieval quality through chunking strategy and re-ranking.",
      "Handwritten enterprise forms can now flow into the same document pipeline.",
    ],
    missionNarrative:
      "The current main mission. 5,000+ mixed enterprise documents, some of them handwritten. The engineering problems: chunking that respects document structure, re-ranking to fix recall, an OCR path for semi-structured forms, and a Kafka ingestion pipeline where any step can fail and be replayed safely.",
  },
  {
    slug: "asr-aviation",
    company: "ASR Aviation",
    role: "Software Engineering Intern (Remote)",
    duration: "Sep 2025 – Nov 2025",
    description: "Query and endpoint optimisation, then containerised deploys on Kubernetes.",
    plain: "Made a slow backend fast, then packaged it so it ships the same way every time.",
    responsibilities: [
      "Optimised database queries and API endpoints to cut backend response times.",
      "Containerised services with Docker and Kubernetes for repeatable deployment.",
    ],
    technologies: ["Docker", "Kubernetes", "SQL", "REST APIs"],
    challenges: [
      "Finding the slow paths in existing queries and endpoints.",
      "Making deployments repeatable across environments.",
    ],
    impact: [
      "Faster backend responses.",
      "Services that deploy the same way every time.",
    ],
    missionNarrative:
      "Profile first, then fix. Find the slow queries and endpoints, cut response times, then containerise every service so dev, staging and production run the same artefact.",
  },
  {
    slug: "iabtm",
    company: "IABTM",
    role: "Full Stack Developer Intern (Remote)",
    duration: "Sep 2024 – Mar 2025",
    description: "REST APIs and real-time messaging over Socket.IO.",
    plain: "Built the server side of an app, including live chat that delivers messages instantly.",
    responsibilities: [
      "Built REST APIs with Node.js and Express.",
      "Built real-time messaging features with Socket.IO.",
      "Worked across time zones in a distributed team.",
    ],
    technologies: ["Node.js", "Express", "Socket.IO", "REST APIs"],
    challenges: [
      "Delivering messages in real time while keeping APIs consistent.",
    ],
    impact: ["Real-time messaging features shipped to the product."],
    missionNarrative:
      "The first main mission. Real-time chat is a consistency problem in disguise: Socket.IO for delivery, REST as the source of truth, and a team spread across time zones.",
  },
];
export const experiencePlaceholder: Pending = {
  status: "pending",
  note: "Verified roles, companies, dates, responsibilities, and outcomes have not been supplied.",
};
