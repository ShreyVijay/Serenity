import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSessionId } from "./utils/session.js";

import Landing from "./pages/Landing";
import Journal from "./pages/Journal";
import Calendar from "./pages/Calendar";

function App() {
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    const id = getSessionId();
    setSessionId(id);
  }, []);

  if (!sessionId) return null;
  console.log("Session:", sessionId);


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/journal" element={<Journal sessionId={sessionId} />} />
        <Route path="/calendar" element={<Calendar sessionId={sessionId} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
