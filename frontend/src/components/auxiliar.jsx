import Lowlight from "react-lowlight";
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
    Lowlight.registerLanguage("bash", languageMap.bash);
  }
};

export default registerLanguage;
