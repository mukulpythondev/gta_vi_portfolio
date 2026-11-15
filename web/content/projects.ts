import type { Project } from "./types";

/**
 * Six projects, chosen for range: retrieval and AI systems, cloud
 * infrastructure, and full products. Facts come from each repository's
 * README and the resume. Nothing here is estimated.
 */
export const projects: Project[] = [
  {
    slug: "offline-multimodal-rag",
    metric: "SIH 2025 national finalist",
    plain:
      "Ask a question and it searches every file, even photos and voice notes, then shows where each answer came from. It works with no internet, so private data never leaves the computer.",
    title: "Offline Multimodal RAG",
    category: "AI / MULTIMODAL RAG",
    description: "Every file. No internet. Cited answers.",
    objective:
      "Retrieval with the network unplugged. Text, OCR, CLIP image embeddings and Whisper transcripts land in FAISS, Neo4j and MongoDB; a query fans out to all three in parallel, Reciprocal Rank Fusion merges the rankings, and a local GGUF model answers with citations down to the page, image region or audio timestamp.",
    technologies: [
      "Python",
      "FastAPI",
      "Django",
      "FAISS",
      "Neo4j",
      "MongoDB",
      "Multimodal retrieval",
      "Hybrid search",
      "Local LLMs",
      "Whisper",
      "CLIP",
      "Electron",
      "React",
    ],
    status: "Open source",
    demo: null,
    github: "https://github.com/mukulpythondev/sih",
    architecture: {
      nodes: [
        "Electron app",
        "Django gateway",
        "FastAPI AI service",
        "FAISS + Neo4j + MongoDB",
        "Local LLM",
      ],
      description:
        "Files go in through the desktop app. The AI service extracts text, OCR, image embeddings and Whisper transcripts. Embeddings go to FAISS, entities and cross-modal links to Neo4j, and raw content to MongoDB. A query searches all of them in parallel, merges results with Reciprocal Rank Fusion, and a local GGUF model writes the answer with citations to pages, image regions and audio timestamps.",
    },
    challenges: [
      "Running embeddings, vector search and the LLM with no network access, for restricted settings like government and research.",
      "Searching across text, images and audio in one query.",
      "Combining vector and graph results into one ranked context.",
    ],
    results: [
      "Text-to-image, image-to-text and audio-to-text search in one interface.",
      "Answers cite the exact page, image snippet or audio timestamp.",
    ],
    achievements: ["Smart India Hackathon 2025 National Finalist."],
    missing: [],
    accent: "cyan",
  },
  {
    slug: "microrag",
    metric: "4 services behind one queue",
    plain:
      "Upload a resume and a job post and get a report on what's missing and how to close the gap. Built to serve many people at once.",
    title: "MicroRAG",
    category: "AI / DISTRIBUTED SYSTEMS",
    description: "One pipeline. Four services. Scales by adding workers.",
    objective:
      "A RAG pipeline split into four services behind a Valkey queue, so slow PDF parsing never blocks the API and throughput scales by adding workers. A LangGraph orchestrator does the resume-versus-job reasoning, and every hop is traced in LangSmith so a bad answer can be followed back to the step that caused it.",
    technologies: [
      "Python",
      "FastAPI",
      "LangGraph",
      "Multi-step workflows",
      "LangSmith",
      "Tracing",
      "Valkey",
      "MongoDB",
      "Docker",
      "AWS EC2",
      "GitHub Actions",
    ],
    status: "Open source",
    demo: null,
    github: "https://github.com/mukulpythondev/microRAG",
    architecture: {
      nodes: ["API gateway", "Valkey queue", "PDF worker", "LangGraph orchestrator", "Reporter"],
      description:
        "The FastAPI gateway accepts uploads and queues a job. A PDF worker extracts text, a LangGraph orchestrator rewrites the job description and compares it with the resume, and a reporter builds the JSON or PDF report. Each stage is its own service, traced end to end with LangSmith.",
    },
    challenges: [
      "Splitting ingestion, embedding and retrieval so each can scale on its own.",
      "Keeping long-running jobs asynchronous behind a queue.",
      "Tracing a request across several services.",
    ],
    results: [
      "Deployed on AWS EC2 behind an Application Load Balancer through GitHub Actions.",
      "Scales horizontally by adding workers or instances.",
    ],
    achievements: [],
    missing: [],
    accent: "lime",
  },
  {
    slug: "anonproof",
    metric: "Cardano Hackathon Asia finalist",
    plain:
      "Prove you're over 18 or a student at an event gate without handing over your ID. The organizer only sees a yes or no, never your personal details.",
    title: "AnonProof",
    category: "PRIVACY / WEB3",
    description: "Prove you're eligible. Share nothing else.",
    objective:
      "Events only need a yes or no, so the attendee's details stay on their phone. The mobile wallet turns a credential into a proof, the backend writes a receipt with no personal data to Cardano's Preprod testnet, and the organizer scans a QR code to check that receipt on-chain. In this hackathon prototype the zero-knowledge proof step is simulated; the on-chain receipt is real.",
    technologies: [
      "React Native",
      "TypeScript",
      "React",
      "Node.js",
      "Express",
      "Cardano",
      "Tailwind CSS",
    ],
    status: "Open source",
    demo: null,
    github: "https://github.com/mukulpythondev/anonproof",
    architecture: {
      nodes: ["Mobile wallet", "Proof service", "Cardano testnet", "QR code", "Organizer portal"],
      description:
        "The attendee adds a credential in the Expo mobile wallet. The Node.js backend creates a proof record and anchors a receipt as transaction metadata on Cardano Preprod using Lucid and Blockfrost. The attendee shows a QR code, and the organizer's React portal checks that receipt on-chain before showing Verified.",
    },
    challenges: [
      "Letting organizers trust a yes or no without ever seeing the document behind it.",
      "Keeping check-in under ten seconds at a busy gate.",
    ],
    results: [
      "A working end-to-end flow: add a credential, get a receipt on Cardano, scan a QR code, see Verified.",
      "Two apps from one backend: an attendee wallet for phones and an organizer portal for the web.",
    ],
    achievements: ["Cardano Hackathon Asia finalist, Bengaluru 2025."],
    missing: [],
    accent: "pink",
  },
  {
    slug: "hydrosense",
    metric: "16 hotspots, backtested",
    plain:
      "Tells Delhi drivers which underpasses are likely to flood, using rain forecasts, past floods, photos from the public and a water sensor.",
    title: "HydroSense",
    category: "CLOUD / CIVIC TECH",
    description: "Know the water before you drive into it.",
    objective:
      "Flood risk where a wrong answer is dangerous: missing forecast data resolves to \"unknown\", never \"safe\". Serverless on Lambda and DynamoDB for spiky monsoon traffic, presigned S3 uploads with size and type limits, Bedrock for photo checks, and a leave-one-storm-out backtest instead of a guess.",
    technologies: [
      "React",
      "TypeScript",
      "Python",
      "FastAPI",
      "AWS Lambda",
      "DynamoDB",
      "Amazon S3",
      "CloudFront",
      "Amazon Bedrock",
      "Arduino",
    ],
    status: "Deployed",
    demo: "https://d348efecbg3b7i.cloudfront.net/",
    github: "https://github.com/mukulpythondev/hydrosense",
    architecture: {
      nodes: ["CloudFront + S3", "API Gateway", "Lambda (FastAPI)", "DynamoDB", "Bedrock"],
      description:
        "CloudFront serves the React app from a private S3 bucket. API Gateway fronts a FastAPI app on Lambda, with DynamoDB for readings, incidents and reports. Community photos upload straight to S3 with presigned URLs and are assessed by a model on Amazon Bedrock.",
    },
    challenges: [
      "Showing \"unknown\" instead of a false \"safe\" when forecast data is missing.",
      "Taking photo uploads from the public safely, with size and type limits and short retention.",
    ],
    results: [
      "Risk tiers with a \"why this tier?\" explanation for 16 underpass hotspots.",
      "Evaluated against historical flooding with a leave-one-storm-out method.",
      "57 backend tests.",
    ],
    achievements: [],
    missing: [],
    accent: "cyan",
  },
  {
    slug: "trinetra",
    metric: "About 120 ms per frame",
    plain:
      "Watches CCTV and drone video of crowded places like temples, spots when a crowd is turning dangerous, and alerts officers on their phones before it becomes a stampede.",
    title: "Trinetra",
    category: "AI / COMPUTER VISION",
    description: "See the crush before it happens.",
    objective:
      "Crowd-risk scoring from live video. ResNet-50 detects people and estimates density and motion per frame; an XGBoost model over 80+ engineered features classifies risk as low, moderate or high, and alerts go out over WebSocket. The budget that shapes everything: about 120 ms per frame and under 1.5 s from frame to alert.",
    technologies: [
      "Python",
      "ResNet-50",
      "XGBoost",
      "Node.js",
      "Express",
      "WebSocket",
      "MongoDB",
      "React",
      "React Native",
      "Expo",
    ],
    status: "Open source",
    demo: null,
    github: "https://github.com/mukulpythondev/trinetra",
    architecture: {
      nodes: ["CCTV / drone feed", "Python ML service", "Express API", "WebSocket", "Dashboard + mobile app"],
      description:
        "Video frames go to a Python service that runs ResNet-50 detection and density estimation, then an XGBoost risk model. An Express backend handles auth, logs and alerts, and pushes live risk over WebSocket to a React dashboard for control rooms and a React Native app for officers in the field.",
    },
    challenges: [
      "Holding per-frame inference near 120 ms so alerts stay live.",
      "Turning raw counts and motion into features a classifier can rank risk on.",
      "Getting an alert from the model to an officer's phone in under 1.5 seconds.",
    ],
    results: [
      "85% detection accuracy and 75% risk-prediction accuracy, as reported in the project README.",
      "Live heatmaps and alert history on the dashboard and the mobile app.",
    ],
    achievements: [],
    missing: [],
    accent: "lime",
  },
  {
    slug: "sonaraudio",
    metric: "3 scenes, 2 endings per script",
    plain:
      "Write a short two-voice audio story, pick the voices and the mood, and let listeners choose how it ends.",
    title: "SonarAudio Scenes",
    category: "PRODUCT / GENERATIVE AUDIO",
    description: "Same conversation. A different atmosphere.",
    objective:
      "Speech synthesis is the cost centre, so every line is cached by its inputs and only uncached lines reach Fish Audio. Provider contracts are tested against mocks so CI never spends credits, and API keys stay inside server routes.",
    technologies: [
      "Next.js",
      "TypeScript",
      "Cloudflare Workers AI",
      "Gemini",
      "Fish Audio",
      "Vitest",
    ],
    status: "Deployed",
    demo: "https://sonaraudio.vercel.app/",
    github: "https://github.com/mukulpythondev/sonaraudio",
    architecture: {
      nodes: ["Script editor", "Next.js API routes", "Workers AI / Gemini", "Fish Audio"],
      description:
        "Scripts are written, imported or drafted with Workers AI or Gemini. Server-only API routes call Fish Audio to voice each line, so keys stay on the server. Generated clips are cached by their inputs.",
    },
    challenges: [
      "Keeping speech costs low: one request per uncached line, with a clip cache.",
      "Validating imported scripts and keeping provider keys server-side.",
    ],
    results: [
      "Three scene settings and two branching endings per script.",
      "Provider contract tests run with mocks, so tests never spend credits.",
    ],
    achievements: [],
    missing: [],
    accent: "pink",
  },
];
