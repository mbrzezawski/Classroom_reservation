import type {FC} from "react";
import { Link } from "react-router-dom";
import Building from "../icons/building"; // upewnij się, że building.svg jest poprawnie osadzony

const ListMenu: FC = () => {
    return (
        <div className="dropdown dropdown-bottom">
            <div tabIndex={0} role="button" className="btn m-1">
                <Building />
            </div>
            <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 shadow-md rounded-box w-52"
            >
                <li>
                    <Link to="/employees" className="whitespace-nowrap">
                        Lista pracowników
                    </Link>
                </li>
                <li>
                    <Link to="/rooms" className="whitespace-nowrap">
                        Lista sal
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default ListMenu;
