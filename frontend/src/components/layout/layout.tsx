import type { FC, ReactNode } from "react";
import { NavBar } from "./navbar";
import type { RoleType } from "../../types/user-role";

const Layout: FC<{ children: ReactNode; userRole?: RoleType }> = ({
  children,
  userRole,
}) => {
  return (
    <div className="w-full h-full min-w-screen min-h-screen bg-base-300">
      <NavBar userRole={userRole} />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
