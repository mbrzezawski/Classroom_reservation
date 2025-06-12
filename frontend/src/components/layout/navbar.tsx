import type { FC } from "react";
import { useLocation } from "react-router-dom";
import Mail from "../icons/mail";
import User from "../icons/user";
import { useAuth } from "../../auth/auth-context";
import { useNavigate } from "react-router-dom";

export const NavBar: FC = () => {
  const { user } = useAuth();
  if (!user) return <></>;
  console.log(user);
  const location = useLocation();
  const isAuthPage =
    location.pathname == "/login" || location.pathname == "/signup";
  const { logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="navbar bg-base-200 shadow-sm">
      <div className="flex flex-1 items-center justify-center relative w-full">
        <div className="absolute left-0">
          {/* Możesz tu dodać logo lub zostawić puste */}
        </div>
        <div className="text-2xl font-bold mx-auto">UniReserve</div>
        {!isAuthPage && (
          <div className="flex gap-2 justify-end absolute right-0">
              <button
                type="button"
                className="btn m-1 flex items-center justify-center cursor-pointer"
                aria-label="Go to proposals"
                onClick={() => navigate("/proposals")}
              >
                <Mail />
              </button>
            <div className="dropdown dropdown-bottom dropdown-end">
              <div tabIndex={0} role="button" className="btn m-1">
                <User />
                {`${user.firstName} ${user.lastName}`}
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
