/**
 * All site copy lives here. Edit this file to update text, links and projects.
 */

export const site = {
  name: "Sinehan",
  title: "Software Developer | GenAI & Automation Engineering",
  location: "Chennai, Tamil Nadu, India",
  // Update to your real domain after deploying (or set NEXT_PUBLIC_SITE_URL in Vercel).
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://sinehan001.vercel.app",
  tagline: "I build reliable backends and GenAI systems that work on real data.",
  description:
    "Sinehan is a Software Developer in Chennai specialising in Node.js backends, microservices, and GenAI systems (RAG, LLM-to-SQL) built on real data.",
  email: "sinehan001@gmail.com",
  phone: "+91 9884846075",
  resume: "/resume.pdf",
  github: "https://github.com/sinehan001",
  linkedin: "https://www.linkedin.com/in/sinehan001",
} as const;

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
] as const;

export const about = {
  paragraphs: [
    "I'm a software developer with about two years of experience at an enterprise telecom and IT services company, where I build and run production backend systems.",
    "My work spans Node.js REST APIs and microservices, query and index optimisation on PostgreSQL, and platform automation. More recently I've focused on GenAI: retrieval-augmented generation and LLM-to-SQL systems that let people ask questions of live data safely, with role-based access.",
    "I care about reliability: careful migrations, sensible observability, and code that the next engineer can read.",
  ],
  facts: [
    { label: "Experience", value: "~2 years" },
    { label: "Focus", value: "Backend & GenAI" },
    { label: "Location", value: "Chennai, India" },
    { label: "Degree", value: "B.E. CSE, CGPA 9.43" },
  ],
};

export const skillGroups = [
  {
    title: "Backend",
    items: [
      "Node.js",
      "JavaScript",
      "TypeScript",
      "REST APIs",
      "Microservices",
      "RabbitMQ",
      "PM2 (cluster mode)",
      "Nginx",
    ],
  },
  {
    title: "Databases",
    items: ["PostgreSQL", "SQL", "Query & index optimization"],
  },
  {
    title: "GenAI / LLM",
    items: [
      "LangChain",
      "RAG pipelines",
      "Weaviate (Vector DB)",
      "LLM-to-SQL",
      "NLP",
      "Prompt-driven data validation",
    ],
  },
  {
    title: "Platform Automation",
    items: ["ServiceNow", "Flow Designer", "Business Rules", "Script Includes"],
  },
  { title: "Frontend", items: ["React.js"] },
  {
    title: "DevOps & Practices",
    items: [
      "AWS",
      "Linux",
      "CI/CD",
      "Git",
      "Agile/Scrum",
      "Selenium (test automation)",
      "Code review",
    ],
  },
];

export const experience = {
  role: "Software Developer",
  company: "Enterprise telecom / IT services company",
  period: "Jul 2024 – Present",
  location: "Chennai, India",
  highlights: [
    {
      title: "Production REST APIs",
      text: "Built production Node.js REST APIs covering integration, debugging and performance optimization.",
    },
    {
      title: "Bulk data microservices",
      text: "Developed Node.js microservices with RabbitMQ for high-volume bulk data processing; improved query performance through indexing and aggregation tuning.",
    },
    {
      title: "Zero-downtime migration",
      text: "Led a Node.js runtime migration (v8 to v24) across production services with zero downtime.",
    },
    {
      title: "GenAI RAG system",
      text: "Built a GenAI RAG system with an LLM-to-SQL layer (read-only RBAC) and vector search for role-based natural-language queries on live data.",
    },
    {
      title: "Infrastructure",
      text: "Configured PM2 cluster mode and Nginx reverse proxy / load balancing; worked in AWS and Linux production environments.",
    },
    {
      title: "Workflow automation",
      text: "Automated telecom workflows on ServiceNow, reducing manual steps across teams.",
    },
  ],
};

export type ArchDiagramData = {
  label: string;
  /** Each inner array is one column of stacked nodes, flowing left to right. */
  columns: string[][];
};

/** Which interactive (simulated) demo to show on a project card. */
export type DemoKind = "rag" | "dashboard" | "queue" | "migration";

export type Project = {
  title: string;
  problem: string;
  built: string;
  tech: string[];
  outcome: string;
  demo?: DemoKind;
  demoLabel?: string;
  architecture?: ArchDiagramData;
};

export const projects: Project[] = [
  {
    title: "Role-Based GenAI Data Assistant",
    problem:
      "Teams needed answers from live operational data but depended on engineers to write queries, and open-ended access risked exposing data to the wrong roles.",
    built:
      "A RAG system with an LLM-to-SQL layer that runs under read-only, role-based access control, combined with vector search so natural-language questions are grounded in the right context.",
    tech: ["Node.js", "LangChain", "Weaviate", "PostgreSQL", "RBAC"],
    outcome:
      "Users ask questions in plain language and get role-appropriate answers from live data, with no write access possible by design.",
    demo: "rag",
    demoLabel: "Pick a role and a question, then run it through the pipeline.",
    architecture: {
      label: "Architecture: role-based natural-language query flow",
      columns: [
        ["User question"],
        ["API + role check"],
        ["Vector search", "LLM-to-SQL"],
        ["Read-only SQL"],
        ["Grounded answer"],
      ],
    },
  },
  {
    title: "API Monitoring Dashboard",
    problem:
      "There was no single, real-time view of how often APIs were called or where they were failing, which slowed down debugging.",
    built:
      "A PostgreSQL schema for API call records, Node.js services that capture and aggregate them, and a React dashboard that tracks call volume and failure rates in real time.",
    tech: ["PostgreSQL", "Node.js", "React.js", "REST APIs"],
    outcome:
      "Engineers can spot failing endpoints and traffic changes quickly instead of digging through logs.",
    demo: "dashboard",
    demoLabel: "Watch simulated traffic stream in, then trigger an incident.",
    architecture: {
      label: "Architecture: API call tracking to dashboard",
      columns: [
        ["API traffic"],
        ["Node.js collector"],
        ["PostgreSQL"],
        ["Aggregation service"],
        ["React dashboard"],
      ],
    },
  },
  {
    title: "Bulk Data Processing Pipeline",
    problem:
      "Large bulk-data jobs were slow and tied up request-handling services.",
    built:
      "Node.js microservices connected through RabbitMQ so heavy work is queued and processed asynchronously, plus indexing and aggregation tuning on the database side.",
    tech: ["Node.js", "RabbitMQ", "Microservices", "PostgreSQL"],
    outcome:
      "High-volume processing runs in the background with better query performance, keeping the main services responsive.",
    demo: "queue",
    demoLabel: "Publish a batch of jobs and scale consumers to drain the queue.",
    architecture: {
      label: "Architecture: queued bulk processing",
      columns: [
        ["Bulk request"],
        ["Producer API"],
        ["RabbitMQ queue"],
        ["Worker", "Worker"],
        ["PostgreSQL"],
      ],
    },
  },
  {
    title: "Zero-Downtime Node.js Runtime Migration",
    problem:
      "Production services were running on a very old Node.js version that no longer received security updates.",
    built:
      "A staged migration plan from Node.js v8 to v24 across production services, with compatibility fixes, testing and a controlled rollout.",
    tech: ["Node.js", "PM2", "Nginx", "Linux", "AWS"],
    outcome:
      "All services moved to a current runtime with zero downtime.",
    demo: "migration",
    demoLabel: "Compare a rolling rollout with an all-at-once deploy.",
    architecture: {
      label: "Architecture: rolling runtime upgrade",
      columns: [
        ["Traffic"],
        ["Nginx load balancer"],
        ["Drain one instance"],
        ["Upgrade + health check"],
        ["Back in rotation"],
      ],
    },
  },
];

export const education = {
  degree: "B.E. Computer Science",
  school: "Velammal Engineering College, Chennai",
  year: "2024",
  score: "CGPA 9.43 / 10",
};

export const certification = {
  name: "AWS Certified Developer – Associate",
  issuer: "Amazon Web Services",
  validity: "2024 – 2027",
};

export const contact = {
  heading: "Let's work together",
  text: "I'm open to backend and GenAI engineering roles. The quickest way to reach me is email.",
};

export const hero = {
  status: "Open to new opportunities",
  rotating: ["reliable backends", "GenAI systems", "automation that scales"],
  stats: [
    { value: "~2 yrs", label: "Production experience" },
    { value: "v8 → v24", label: "Node.js migration, zero downtime" },
    { value: "9.43", label: "CGPA, B.E. Computer Science" },
    { value: "AWS", label: "Certified Developer – Associate" },
  ],
  marquee: [
    "Node.js",
    "TypeScript",
    "PostgreSQL",
    "RabbitMQ",
    "LangChain",
    "RAG",
    "Weaviate",
    "LLM-to-SQL",
    "React",
    "AWS",
    "Nginx",
    "ServiceNow",
    "Microservices",
    "Linux",
  ],
};

/** v3 · Doomsday Edition copy. Section "lore" names sit above the plain-language titles. */
export const doom = {
  edition: "Doomsday Edition",
  /**
   * Hero mask: "dual" (full Iron Man in light / full Doom in dark, mirrored from the line art),
   * "combo" (the half-and-half line art) or "original" (hand-drawn SVG).
   */
  mask: "dual" as "dual" | "original" | "combo",
  rotating: ["reliable backends", "GenAI systems", "automation pipelines"],
  verb: "I forge",
  taglineEnd: "that bend real data to their will.",
  sigil: "FORGED IN CODE ✦ BOUND BY DATA ✦ RULED BY LOGIC ✦ ",
  lore: {
    about: "The Origin",
    skills: "The Arsenal",
    experience: "The Campaigns",
    projects: "The Machines",
    education: "The Credentials",
    contact: "The Summoning",
  },
  console: {
    eyebrow: "The Iron Console",
    title: "Speak, and the machine obeys",
    text: "A working terminal wired to this site. Ask it about my skills, projects or experience. Or try the commands nobody tells you about.",
  },
  summon: {
    hold: "Hold to summon",
    holding: "Summoning…",
    done: "Summoned",
  },
};

/** v4 · Iron (light) theme copy. Mirrors `doom` so each theme has its own flavour text. */
export const stark = {
  edition: "Iron Edition",
  verb: "I build",
  taglineEnd: "that run on real data.",
  lore: {
    about: "Origin File",
    skills: "Armory",
    experience: "Mission Log",
    projects: "Prototypes",
    education: "Clearances",
    contact: "Comms Link",
  },
  console: {
    eyebrow: "Workshop Console",
    title: "Talk to the suit",
    text: "A working terminal wired to this site. Ask it about my skills, projects or experience. Or try the commands nobody tells you about.",
  },
  summon: {
    hold: "Hold to call",
    holding: "Charging…",
    done: "Connected",
  },
  hint: "Click the mask. Click anywhere. Or press",
};
