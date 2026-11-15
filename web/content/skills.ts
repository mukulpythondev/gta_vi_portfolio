import { projects } from "./projects";
import { experience } from "./experience";

export const skillCategories = [
  "All",
  "Agents",
  "RAG",
  "Models",
  "Backend",
  "Infra",
  "Frontend",
] as const;

type Category = Exclude<(typeof skillCategories)[number], "All">;

/** Resume skills plus the main technologies used in the listed projects. */
const loadout: Record<Category, string[]> = {
  Agents: [
    "AI agents",
    "Tool calling",
    "MCP",
    "Agent memory",
    "Agent harnesses",
    "Multi-step workflows",
    "LangGraph",
    "LangChain",
    "Zep GraphRAG",
    "Prompt engineering",
  ],
  RAG: [
    "RAG",
    "Embeddings",
    "Vector search",
    "Hybrid search",
    "Re-ranking",
    "GraphRAG",
    "Multimodal retrieval",
    "FAISS",
    "Qdrant",
    "Neo4j",
  ],
  Models: [
    "Evals",
    "LangSmith",
    "Tracing",
    "OpenAI",
    "Gemini",
    "Amazon Bedrock",
    "Local LLMs",
    "Whisper",
    "CLIP",
    "Azure Document Intelligence",
    "Sarvam AI",
    "Fish Audio",
    "Cloudflare Workers AI",
    "ResNet-50",
    "XGBoost",
  ],
  Backend: [
    "Python",
    "Java",
    "FastAPI",
    "Django",
    "Node.js",
    "Express",
    "Socket.IO",
    "Kafka",
    "SQLAlchemy",
    "SQL",
    "PostgreSQL",
    "MongoDB",
    "Redis",
    "Valkey",
    "DynamoDB",
    "Twilio",
    "WebSocket",
  ],
  Infra: [
    "AWS EC2",
    "AWS Lambda",
    "Amazon S3",
    "CloudFront",
    "Docker",
    "Kubernetes",
    "Nginx",
    "GitHub Actions",
    "Cardano",
  ],
  Frontend: ["TypeScript", "React", "Next.js", "React Native", "Tailwind CSS", "Electron", "Vitest"],
};

export const skills = (Object.keys(loadout) as Category[]).flatMap((category) =>
  loadout[category].map((name) => ({
    name,
    category,
    projects: [
      ...projects
        .filter((project) => project.technologies.includes(name))
        .map((project) => ({
          title: project.title,
          href: `/missions/${project.slug}`,
        })),
      ...experience
        .filter((item) => item.technologies.includes(name))
        .map((item) => ({
          title: item.company,
          href: `/experience/${item.slug}`,
        })),
    ],
  })),
);
