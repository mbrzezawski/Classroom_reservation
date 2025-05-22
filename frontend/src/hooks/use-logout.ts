import { useNavigate } from "react-router-dom";

export function useLogout() {
    const navigate = useNavigate();
    return () => {
        console.log("LOGOUT")
        navigate(`/login`);
    }
}