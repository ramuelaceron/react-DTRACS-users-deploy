import { createContext, useContext, useState } from "react";

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null); // 👈 keep track of open dropdown

  const toggleSidebar = (expand) => {
    setIsExpanded((prev) => (typeof expand === "boolean" ? expand : !prev));
  };

  const toggleDropdown = (name) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  return (
    <SidebarContext.Provider
      value={{ isExpanded, toggleSidebar, openDropdown, toggleDropdown }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);
