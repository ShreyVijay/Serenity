import { Routes, Route, Navigate } from "react-router-dom";
import { useSession } from "./context/SessionContext";

import Welcome from "./pages/Welcome";
import Landing from "./pages/Landing";
import Journal from "./pages/Journal";
import Calendar from "./pages/Calendar";
import Checkin from "./pages/Checkin";

function App() {
  const { isInitialized } = useSession();

  return (
    <Routes>
      {!isInitialized && <Route path="*" element={<Welcome />} />}

      {isInitialized && (
        <>
          <Route path="/" element={<Landing />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/checkin" element={<Checkin />} />
          <Route path="*" element={<Navigate to="/" />} />
        </>
      )}
    </Routes>
  );
}

export default App;
