import Lowlight from "react-lowlight";
import bash from "highlight.js/lib/languages/bash";
import powershell from "highlight.js/lib/languages/powershell";

// Lenguejes soportados por la aplicación
const languageMap = {
  powershell: powershell,
  bash: bash,
  shell: bash,
};

const registerLanguage = (language) => {
  if (languageMap[language]) {
    // Si el lenguaje está soportado
    Lowlight.registerLanguage(language, languageMap[language]); // Registra el lenguaje
  } else {
    // Si no está soportado
    Lowlight.registerLanguage("bash", languageMap.bash); // Registra bash por defecto
  }
};

export default registerLanguage; // Exporta la función
