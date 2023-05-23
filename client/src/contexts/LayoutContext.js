import { createContext, useEffect, useState } from "react";

export const LayoutContext = createContext(null);

export const LayoutContextProvider = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [openLeftMenu, setOpenLeftMenu] = useState(true);
  const [openRightMenu, setOpenRightMenu] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 767) {
        setIsMobile(false);
      } else {
        setIsMobile(true);
        setOpenLeftMenu(false);
        setOpenRightMenu(false);
      }
    };

    handleResize(); // Call the function initially

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <LayoutContext.Provider
      value={{
        isMobile,
        openLeftMenu,
        setOpenLeftMenu,
        openRightMenu,
        setOpenRightMenu,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};
