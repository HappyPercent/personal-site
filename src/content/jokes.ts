export type Joke = { id: string; text: string; tags: string[] };

export const jokeBank: Joke[] = [
  { id: "witcher-gpu", text: "Yes, I need this GPU for work. Not for Witcher 3 Remastered.", tags: ["hardware"] },
  { id: "automation", text: "Spent 3 days automating a 15-minute task. Worth it.", tags: ["devops"] },
  { id: "sprints", text: "I'm not an endurance athlete. Sprints are my max.", tags: ["agile", "stenn"] },
  { id: "sql", text: "Say what you want about SQL, it brings a lot to the table.", tags: ["tools", "backend"] },
  { id: "vim", text: "Exited Vim… twice.", tags: ["tools", "achievement"] },
  { id: "redux", text: "Redux: because passing props twice would have been too easy.", tags: ["tools", "frontend"] },
  { id: "typescript", text: "TypeScript: it works until you ask it to.", tags: ["tools", "frontend"] },
  { id: "docker", text: "Docker: it works on my machine, now it works on every machine.", tags: ["tools", "devops"] },
  { id: "coverage", text: "100% test coverage is a goal. 0% is a lifestyle.", tags: ["testing"] },
  { id: "unwritten", text: "The best code is the code you didn't write.", tags: ["refactoring", "stenn"] },
  { id: "qa-to-fe", text: "Turned a bug finder into a bug maker. Proud.", tags: ["mentoring", "stenn"] },
  { id: "two-sum", text: "Now I know all the ways of solving Two Sum problem.", tags: ["interviews", "netchex"] },
  { id: "pull-requests", text: "I used to approve budgets. Now I approve pull requests.", tags: ["banking", "career"] },
  { id: "no-cookies", text: "No cookies, I prefer milk only.", tags: ["analytics"] },
  { id: "built-with", text: "Built with Next.js, caffeine, and one regrettable CSS transition.", tags: ["site"] },
  { id: "404", text: "404: this page didn't pass code review.", tags: ["404"] },
  { id: "loading", text: "Loading... still faster than npm install.", tags: ["loading"] },
  {
    id: "cocoa",
    text: "I see you. Your visit is saved and I will remember it.",
    tags: ["analytics"],
  },
];

export const joke = (id: string): string => {
  const j = jokeBank.find((x) => x.id === id);
  if (!j) throw new Error(`Unknown joke: ${id}`);
  return j.text;
};
