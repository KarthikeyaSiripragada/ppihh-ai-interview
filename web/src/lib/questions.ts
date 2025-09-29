export type Q = { id: string; topic: string; diff: "Easy"|"Medium"|"Hard"; text: string };

const BANK: Q[] = [
  // React
  { id:"react-e-1", topic:"react", diff:"Easy",  text:"What are React hooks and why are they useful?" },
  { id:"react-e-2", topic:"react", diff:"Easy",  text:"Explain useState vs useRef with a small example." },
  { id:"react-m-1", topic:"react", diff:"Medium",text:"How does reconciliation work? When do keys matter?" },
  { id:"react-m-2", topic:"react", diff:"Medium",text:"Design a reusable modal component API." },
  { id:"react-h-1", topic:"react", diff:"Hard", text:"Optimize a list of 50k rows: what patterns would you use and why?" },

  // JS/TS
  { id:"js-e-1", topic:"javascript", diff:"Easy", text:"What is a closure? Give one real-world use." },
  { id:"js-m-1", topic:"javascript", diff:"Medium", text:"Implement debounce; discuss timing edge-cases." },
  { id:"ts-m-1", topic:"typescript", diff:"Medium", text:"When would you pick generics over unions? Example." },
  { id:"ts-h-1", topic:"typescript", diff:"Hard", text:"Design a type-safe API client (types for endpoints/responses)." },

  // Node
  { id:"node-e-1", topic:"node", diff:"Easy", text:"What is the event loop? microtask vs macrotask?" },
  { id:"node-m-1", topic:"node", diff:"Medium", text:"Build an Express route with validation & error handling." },
  { id:"node-h-1", topic:"node", diff:"Hard", text:"How to implement rate limiting and why (token bucket)?" },

  // DSA
  { id:"dsa-e-1", topic:"dsa", diff:"Easy", text:"Two Sum: approach and complexity." },
  { id:"dsa-m-1", topic:"dsa", diff:"Medium", text:"Kth largest in array: compare heap vs sort." },
  { id:"dsa-h-1", topic:"dsa", diff:"Hard", text:"LRU cache design: API + complexity + pitfalls." },

  // DB
  { id:"db-e-1", topic:"db", diff:"Easy", text:"SQL vs NoSQL—when would you choose either?" },
  { id:"db-m-1", topic:"db", diff:"Medium", text:"Design a schema for users, jobs, applications (keys, indexes)." },
  { id:"db-h-1", topic:"db", diff:"Hard", text:"Explain transaction isolation levels and a phantom read." },

  // Python/Java/Cloud (brief)
  { id:"py-m-1", topic:"python", diff:"Medium", text:"Vectorize a slow loop in pandas—how/why?" },
  { id:"java-m-1", topic:"java", diff:"Medium", text:"Explain GC tuning basics; what affects pauses?" },
  { id:"cloud-m-1", topic:"cloud", diff:"Medium", text:"Design a simple, scalable file upload pipeline on AWS." },
];

function pick<T>(arr: T[], n: number) {
  const out: T[] = [];
  for (const x of arr) if (out.length < n) out.push(x);
  return out;
}

export function generateQuestions(skills: string[]): Q[] {
  const topics = skills.length ? skills : ["react","javascript","dsa"];
  const pool = BANK.filter(b => topics.includes(b.topic));

  const easy = pool.filter(q=>q.diff==="Easy");
  const med  = pool.filter(q=>q.diff==="Medium");
  const hard = pool.filter(q=>q.diff==="Hard");

  const res = [
    ...pick(easy, 2),
    ...pick(med, 2),
    ...pick(hard, 2),
  ];

  // If not enough from topics, backfill from BANK
  while (res.length < 6) {
    for (const diff of (["Easy","Medium","Hard"] as const)) {
      const fallback = BANK.find(q => q.diff===diff && !res.some(r=>r.id===q.id));
      if (fallback) res.push(fallback);
      if (res.length===6) break;
    }
  }
  return res.slice(0,6);
}
