import { Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";
import Journal from "./pages/Journal";
import Calendar from "./pages/Calendar";
import Checkin from "./pages/Checkin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/journal" element={<Journal />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/checkin" element={<Checkin />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
