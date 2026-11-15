import type { Achievement, Pending } from "./types";
export const achievements: Achievement[] = [
  {
    title: "Smart India Hackathon 2025: National Finalist",
    description:
      "Reached the Grand Finale with an offline multimodal RAG system.",
    date: "2025",
    evidence: "https://github.com/mukulpythondev/sih",
  },
  {
    title: "Cardano Hackathon: Asia finalist",
    description: "Reached the Asia finals in Bengaluru.",
    date: "Nov 2025",
    evidence: null,
  },
  {
    title: "Hackathon judge, IIIT Pune",
    description: "Judged Hack Better Than Me, a two-day student hackathon.",
    date: "Aug 2026",
    evidence: null,
  },
  {
    title: "Organizer, 2nd Youth Bhartiya Parliament",
    description: "Helped organize the youth parliament at Bharat Mandapam, New Delhi.",
    date: "Feb 2026",
    evidence: null,
  },
  {
    title: "Event coordinator, MLH Build with Gemini",
    description: "Coordinated the Major League Hacking Gemini build event at IMS Engineering College.",
    date: "Mar 2026",
    evidence: null,
  },
  {
    title: "30+ hackathon finals, 3 wins",
    description: "Finalist at more than 30 hackathons, including the Smart India Hackathon national finals and the Cardano Asia finals, with three outright wins.",
    date: "Hackathons",
    evidence: null,
  },
  {
    title: "500+ LeetCode problems",
    description: "Over 500 data structures and algorithms problems solved: graphs, dynamic programming, and the habit of asking what the complexity is before writing code.",
    date: "Ongoing",
    evidence: "https://leetcode.com/u/mukul_rana_dev/",
  },
];
export const achievementPlaceholder: Pending = {
  status: "pending",
  note: "Verified awards, certifications, and supporting links have not been supplied.",
};
