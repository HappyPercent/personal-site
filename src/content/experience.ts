export type Stage = {
  dates: string;
  place: string;
  title: string;
  company: string;
  bullets: string[];
};

export const netchex: Stage = {
  dates: "Jan 2025 to now",
  place: "Remote",
  title: "Senior Engineer / Tech Lead",
  company: "Netchex",
  bullets: [
    "Drive architecture and sprint planning for a 10-person team, shipping across React, .NET and BFF layers.",
    "Run 2+ technical interviews a week and own onboarding for new hires.",
    "Won an internal hackathon by shipping a client-requested feature in two weeks.",
  ],
};

export const stennDev: Stage = {
    dates: "Jan 2021 to Dec 2023",
    place: "Remote",
    title: "Senior Frontend Developer",
    company: "Stenn",
    bullets: [
      "Introduced GraphQL for new requests, improving data-fetch interactions by about 20%.",
      "Cut the frontend codebase by 25% through systematic refactoring.",
      "Added Jest and React Testing Library coverage; generated API clients from OpenAPI in CI.",
      "Mentored a QA engineer into a frontend role.",
    ],
};

export const stennLead: Stage = {
    dates: "Dec 2023 to Dec 2024",
    place: "Barcelona",
    title: "Engineering Manager",
    company: "Stenn",
    bullets: [
      "Built and led a new 5-person team owning financing and data integration services.",
      "Introduced an Agile process with a predictable sprint cadence and three deployments per sprint.",
      "Put metrics-driven monitoring and alerting into production.",
    ],
};

export const aori: Stage = {
  dates: "Jan 2020 to Dec 2020",
  place: "Moscow",
  title: "Frontend Developer",
  company: "Aori",
  bullets: [
    "Built a campaign-budget dashboard with real-time WebSocket updates.",
    "Migrated off AngularJS 1.4, removing about 40% of legacy code.",
    "Delivered auto-campaign creation end to end.",
  ],
};

export const beforeCode = {
  lines: ["Analyst at Sberbank.", "Product manager at Raiffeisenbank.", "Project team manager at Otkritie."],
  line: "It's why I ask for the business case before the library.",
};

export const skills = [
  { name: "FRONTEND", items: ["TypeScript", "React", "Redux", "Next.js", "GraphQL", "WebSockets", "Storybook", "Web performance"] },
  { name: "BACKEND", items: ["C#", ".NET", "SQL", "REST", "BFF", "Domain-driven design"] },
  { name: "QUALITY AND DEVOPS", items: ["Jest", "React Testing Library", "CI/CD", "Docker", "Azure", "Sentry", "Elastic"] },
  { name: "LEADING", items: ["Team leadership", "Mentoring", "Hiring", "Agile and Scrum", "Metrics", "Stakeholders"] },
];
