import React, { createContext, useState } from 'react';

const SettingsContext = createContext();

const SettingsProvider = ({ children }) => {
  const [fontSize, setFontSize] = useState(16);
  const [showEnglish, setShowEnglish] = useState(true);
  const [showUrdu, setShowUrdu] = useState(true);
  const [showTafseer, setShowTafseer] = useState(true); // ✅ Make sure this is added

  return (
    <SettingsContext.Provider value={{
      fontSize,
      setFontSize,
      showEnglish,
      setShowEnglish,
      showUrdu,
      setShowUrdu,
      showTafseer,         // ✅ Add to value
      setShowTafseer       // ✅ Add to value
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export { SettingsContext, SettingsProvider };
