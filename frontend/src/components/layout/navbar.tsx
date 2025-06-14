import type { FC } from "react";
import {useLocation, useNavigate} from "react-router-dom";
import Mail from "../icons/mail";
import User from "../icons/user";
<<<<<<< dev-idk
import { useLogout } from "../../hooks/use-logout";
import ListMenu from "./list-menu.tsx";
import ArrowBack from "../icons/arrow-back.tsx";



export const NavBar: FC<{ userRole?: string }> = ({ userRole }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthPage =
    location.pathname == "/login" || location.pathname == "/signup";
  const isListPage = location.pathname == "/employees" || location.pathname == "/rooms";
  const logout = useLogout();
=======
import { useAuth } from "../../auth/auth-context";
import { useNavigate } from "react-router-dom";

export const NavBar: FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const location = useLocation();
  const isAuthPage =
    location.pathname == "/login" || location.pathname == "/signup";
>>>>>>> main
  return (
    <div className="navbar bg-base-200 shadow-sm">
      <div className="flex flex-1 items-center justify-center relative w-full">
        <div className="absolute left-0">
          {/* Możesz tu dodać logo lub zostawić puste */}
        </div>
        <div className="text-2xl font-bold mx-auto">UniReserve</div>
        {!isAuthPage && (
          <div className="flex gap-2 justify-end absolute right-0">
<<<<<<< dev-idk

            {isListPage &&
                <div tabIndex={0} role="button" className="btn m-1" onClick={() => {
                  navigate("/main")
                }}>
                  <ArrowBack/>
                </div>
            }

            {userRole === "DEANS_OFFICE" && <ListMenu/>}

            <div className="dropdown">
            <div tabIndex={0} role="button" className="btn m-1">
                <Mail />
              </div>
              <ol
                tabIndex={0}
                className="dropdown-content dropdown-bottom dropdown-center menu bg-base-100 gap-1"
=======
              <button
                type="button"
                className="btn m-1 flex items-center justify-center cursor-pointer"
                aria-label="Go to proposals"
                onClick={() => navigate("/proposals")}
>>>>>>> main
              >
                <Mail />
              </button>
            <div className="dropdown dropdown-bottom dropdown-end">
              <div tabIndex={0} role="button" className="btn m-1">
                <User />
                {`${user?.name} ${user?.surname}`}
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 whitespace-nowrap "
              >
                <li>
                  <button
                    onClick={() => {
                      logout();
                      navigate("/login");
                    }}
                  >
                    Log Out
                  </button>
                </li>
                <li>
                  <button>Change password</button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
