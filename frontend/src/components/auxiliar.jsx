import Lowlight from "react-lowlight";
import javascript from "highlight.js/lib/languages/javascript";
import bash from "highlight.js/lib/languages/bash";
import powershell from "highlight.js/lib/languages/powershell"

// Map of supported languages
const languageMap = {
  powershell: powershell,
  bash: bash,
  shell: bash,
};

const registerLanguage = (language) => {
  if (languageMap[language]) {
    Lowlight.registerLanguage(language, languageMap[language]);
  } else {
    // Fallback to shell if the language is not found
    Lowlight.registerLanguage("bash", languageMap.shell);
  }
};

export default registerLanguage;
