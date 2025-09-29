export const getDomain = (email: string) =>
  (email.split("@")[1] || "").toLowerCase();

export const isAllowedInterviewer = (email: string) => {
  const allowed = (import.meta.env.VITE_ALLOWED_INTERVIEWER_DOMAINS || "")
    .split(",")
    .map((d: string) => d.trim().toLowerCase())
    .filter(Boolean);
  return allowed.includes(getDomain(email));
};
