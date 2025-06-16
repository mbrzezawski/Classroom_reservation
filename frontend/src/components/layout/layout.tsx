import type { FC, ReactNode } from "react";
import { NavBar } from "./navbar";

const Layout: FC<{ children: ReactNode; userRole?: string }> = ({
  children,
  userRole,
}) => {
  return (
    <div className="bg-gradient-to-br from-base-100 to-base-200">
      <NavBar userRole={userRole} />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
