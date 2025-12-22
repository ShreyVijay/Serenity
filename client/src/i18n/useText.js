import { TEXT } from "./text";
import { useSession } from "../context/SessionContext";

export function useText() {
  const { session } = useSession();
  const lang = session?.language || "en";

  return TEXT[lang] || TEXT.en;
}
