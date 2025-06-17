import type { FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Mail from "../icons/mail";
import User from "../icons/user";
import { useAuth } from "../../auth/auth-context";
import ListMenu from "./list-menu.tsx";
import ArrowBack from "../icons/arrow-back.tsx";
import { RoleType } from "../../types/user-role.ts";

export const NavBar: FC<{ userRole?: RoleType }> = ({ userRole }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthPage =
    location.pathname == "/login" || location.pathname == "/signup";
  const isListPage =
    location.pathname == "/employees" ||
    location.pathname == "/rooms" ||
    location.pathname == "/proposals";

  const { user, logout } = useAuth();

  return (
    <div className="navbar bg-base-200 shadow-sm">
      <div className="flex flex-1 items-center justify-center relative w-full">
        <div className="absolute left-0">
          {/* Możesz tu dodać logo lub zostawić puste */}
        </div>
        <button
          className="btn btn-ghost text-2xl font-bold mx-auto"
          onClick={() => navigate("/main")}
        >
          UniReserve
        </button>
        {!isAuthPage && (
          <div className="flex gap-2 justify-end absolute right-0">
            {isListPage && (
              <div
                tabIndex={0}
                role="button"
                className="btn btn-neutral m-1"
                onClick={() => {
                  navigate("/main");
                }}
              >
                <ArrowBack />
              </div>
            )}

            {userRole === RoleType.DEANS_OFFICE && <ListMenu />}

            <div className="dropdown dropdown-bottom dropdown-end">
              <div
                role="button"
                className="btn btn-neutral m-1 flex items-center justify-center cursor-pointer"
                aria-label="Go to proposals"
                onClick={() => {
                  navigate("/proposals");
                }}
              >
                <Mail />
              </div>
            </div>

            <div className="dropdown dropdown-bottom dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-neutral m-1 flex items-center gap-1"
              >
                <User />
                {`${user?.name} ${user?.surname}`}
              </div>
              <ul className="dropdown-content menu bg-base-100 whitespace-nowrap">
                <li>
                  <button
                    onClick={() => {
                      logout();
                      navigate("/login");
                    }}
                  >
                    Wyloguj się
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      navigate("/change-password");
                    }}
                  >
                    Zmień hasło
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
