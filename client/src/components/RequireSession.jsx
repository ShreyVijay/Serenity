import { Navigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";

export default function RequireSession({ children }) {
  const { session } = useSession();

  if (!session) {
    return <Navigate to="/welcome" replace />;
  }

  return children;
}
