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
    company: "ASR Aviation Pvt. Ltd.",
    role: "Software Engineering Intern (Remote)",
    duration: "Sep 2025 – Nov 2025",
    description: "Node.js-to-Django migration and automated production deployments.",
    plain: "Moved existing backend services to Python and automated how they are deployed, making the code easier to maintain and the APIs more consistent.",
    responsibilities: [
      "Migrated legacy Node.js services to Django (Python), improving maintainability and API consistency across modules.",
      "Containerised applications with Docker, configured Nginx and Gunicorn for production, and deployed through GitHub Actions CI/CD.",
      "Debugged backend services with QA and design teams and documented deployment on Linux (Ubuntu/RHEL) servers.",
      "Contributed through Agile sprints and code reviews.",
      "Configured API routing and load balancing with Nginx to improve request throughput and network efficiency.",
    ],
    technologies: ["Python", "Django", "Node.js", "Docker", "Nginx", "Gunicorn", "GitHub Actions", "Linux", "REST APIs"],
    challenges: [
      "Migrating legacy services while keeping APIs consistent across modules.",
      "Configuring and documenting production deployments across Ubuntu and RHEL.",
      "Debugging backend issues in collaboration with QA and design teams.",
    ],
    impact: [
      "More maintainable Django services and consistent APIs.",
      "Automated container deployments through GitHub Actions.",
      "Improved request throughput through Nginx routing and load balancing.",
    ],
    missionNarrative:
      "Modernise the backend without losing the plot: migrate legacy Node.js services to Django, package them with Docker, and deploy through GitHub Actions. Nginx handles routing and load balancing in front of Gunicorn, with Linux deployment documentation and cross-team debugging to keep the work maintainable.",
  },
  {
    slug: "iabtm",
    company: "IABTM",
    role: "Full Stack Developer Intern (Remote)",
    duration: "Sep 2024 – Mar 2025",
    description: "Faster APIs and low-latency audio/video webinar sessions.",
    plain: "Built the backend for live webinars, made APIs respond 25% faster, and led backend reviews and debugging that cut bug resolution time by 20%.",
    responsibilities: [
      "Architected backend services with Node.js, Express and MongoDB, using Redis/Valkey-based caching and queues to reduce API response times by 25%.",
      "Developed and debugged real-time interactive sessions with mediasoup for low-latency audio/video streaming in large-scale webinars.",
      "Implemented role-based authentication and JWT access control, supported by unit testing.",
      "Led a backend-focused team through peer reviews and debugging sessions, improving API stability and reducing bug resolution time by 20%.",
    ],
    technologies: ["Node.js", "Express", "MongoDB", "Redis", "Valkey", "mediasoup", "JWT", "REST APIs", "Unit testing"],
    challenges: [
      "Reducing API latency with caching and queues.",
      "Debugging low-latency audio/video sessions for large-scale webinars.",
      "Keeping access controls and backend behaviour reliable through tests and peer reviews.",
    ],
    impact: [
      "Reduced API response times by 25%.",
      "Reduced bug resolution time by 20% through team reviews and debugging.",
      "Delivered low-latency audio/video sessions with mediasoup.",
    ],
    missionNarrative:
      "The first main mission: a webinar backend built with Node.js, Express and MongoDB. Redis/Valkey caching and queues cut API response times by 25%; mediasoup powers the audio/video sessions. Role-based JWT access, unit tests, and backend team reviews support reliability, while focused debugging cuts bug resolution time by 20%.",
  },
];
export const experiencePlaceholder: Pending = {
  status: "pending",
  note: "Verified roles, companies, dates, responsibilities, and outcomes have not been supplied.",
};
