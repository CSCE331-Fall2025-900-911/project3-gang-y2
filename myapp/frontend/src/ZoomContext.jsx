import { createContext, useContext, useState } from "react";

const ZoomContext = createContext();

export const useZoom = () => useContext(ZoomContext);

export function ZoomProvider({ children }) {
  const [zoom, setZoom] = useState(1); // 1 = normal

  // Update the CSS variable when zoom changes
  const updateZoom = (value) => {
    setZoom(value);
    document.documentElement.style.setProperty("--zoom-scale", value);
  };

  return (
    <ZoomContext.Provider value={{ zoom, updateZoom }}>
      {children}
    </ZoomContext.Provider>
  );
}