import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./Landing";
import Interviewee from "./Interviewee";
import Interviewer from "./Interviewer";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/interview" element={<Interviewee />} />
      <Route path="/dashboard" element={<Interviewer />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
