import { useSession } from "../context/SessionContext";
import { STRINGS } from "./index";

export function useT() {
  const { language } = useSession();

  return function t(key) {
    return (
      STRINGS[language]?.[key] ||
      STRINGS.en[key] ||
      key
    );
  };
}
