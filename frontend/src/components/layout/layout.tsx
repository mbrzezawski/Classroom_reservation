import type { FC, ReactNode } from "react";
import { NavBar } from "./navbar";

const Layout: FC<{ children: ReactNode; userRole?: string }> = ({ children, userRole }) => {
  return (
    <div>
      <NavBar userRole={userRole}/>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
