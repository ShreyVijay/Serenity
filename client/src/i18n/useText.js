import { TEXT } from "./text";

export function useText(lang = "en") {
  return TEXT[lang] || TEXT.en;
}
