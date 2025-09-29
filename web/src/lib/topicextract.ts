const SKILL_SETS: Record<string, RegExp[]> = {
  javascript: [/javascript|ecmascript|node\.?js|react|next\.?js/i],
  typescript: [/typescript/i],
  react: [/react|hooks|jsx|tsx/i],
  node: [/node\.?js|express/i],
  dsa: [/algorithm|data[- ]structures|leetcode|big[- ]?o/i],
  db: [/postgres|mysql|mongodb|sql|database/i],
  python: [/python|pandas|numpy|django|flask/i],
  java: [/java(?!script)/i],
  cloud: [/aws|gcp|azure|serverless|lambda/i],
};

export function extractSkills(text: string): string[] {
  const found = new Set<string>();
  for (const [k, regs] of Object.entries(SKILL_SETS)) {
    if (regs.some((r) => r.test(text))) found.add(k);
  }
  // prioritize popular stacks
  const order = ["react","typescript","javascript","node","dsa","db","python","java","cloud"];
  return Array.from(found).sort((a,b)=>order.indexOf(a)-order.indexOf(b));
}
