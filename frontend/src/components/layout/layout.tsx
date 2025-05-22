import type { FC, ReactNode } from "react";
import { NavBar } from "./navbar";

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div>
      <NavBar />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
