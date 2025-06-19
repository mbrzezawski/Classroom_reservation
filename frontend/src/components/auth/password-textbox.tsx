import { useState } from "react";
import type { FC, InputHTMLAttributes } from "react";
import Lock from "../icons/lock";
import InputTextBox from "../ui/input-textbox";
import PasswordHider from "./password-hider";

interface PasswordTextBoxProps extends InputHTMLAttributes<HTMLInputElement> {
  confirmPassword?: boolean;
  error?: string;
}

const PasswordTextBox: FC<PasswordTextBoxProps> = ({
  confirmPassword = false,
  error,
  ...inputProps
}) => {
  const [visible, setVisible] = useState<boolean>(false);
  const handleHidePassword = () => {
    setVisible(!visible);
  };
  return (
    <InputTextBox
      label={confirmPassword ? "Powtórz hasło" : "Hasło"}
      type={visible ? "text" : "password"}
      placeholder={confirmPassword ? "Wpisz hasło ponownie" : "Wpisz hasło"}
      icon={<Lock />}
      secondaryIcon={
        <PasswordHider
          visible={visible}
          handleHidePassword={handleHidePassword}
        />
      }
      error={error}
      {...inputProps}
    />
  );
};

export default PasswordTextBox;
