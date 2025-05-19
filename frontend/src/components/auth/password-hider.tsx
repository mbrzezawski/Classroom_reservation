import type { FC } from "react";
import Eye from "../icons/eye";
import EyeOff from "../icons/eye-off";

interface PasswordHiderProps {
  visible: boolean;
  handleHidePassword: () => void;
}

const PasswordHider: FC<PasswordHiderProps> = ({
  visible,
  handleHidePassword,
}) => {
  return (
    <button
      type="button"
      className="btn-ghost cursor-pointer transition-transform duration-150 active:scale-90 hover:opacity-85"
      onClick={handleHidePassword}
      aria-label="Toggle password visibility"
    >
      {visible ? <Eye /> : <EyeOff />}
    </button>
  );
};
export default PasswordHider;
