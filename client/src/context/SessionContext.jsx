import { createContext, useContext, useEffect, useState } from "react";
import { createSession, getSession, clearSession } from "../utils/session";

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [sessionId, setSessionId] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const existing = getSession();
    if (existing) {
      setSessionId(existing);
    }
    setReady(true);
  }, []);

  function startNewSession() {
    const id = createSession();
    setSessionId(id);
  }

  function resetSession() {
    clearSession();
    setSessionId(null);
  }

  return (
    <SessionContext.Provider
      value={{ sessionId, startNewSession, resetSession, ready }}
    >
      {ready && children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession must be used inside SessionProvider");
  }
  return ctx;
}
