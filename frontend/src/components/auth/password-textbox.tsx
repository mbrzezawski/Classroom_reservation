// import { useState } from "react";
// import type { FC } from "react";
// import Lock from "../icons/lock";
// import Eye from "../icons/eye";
// import EyeOff from "../icons/eye-off";
// import InputTextBox from "./input-textbox";

// interface PasswordTextBoxProps {
//   confirmPassword?: boolean;
// }

// const PasswordTextBox: FC<PasswordTextBoxProps> = ({
//   confirmPassword = false,
// }) => {
//   const [visible, setVisible] = useState(false);

//   return (
//     <InputTextBox
//       label={confirmPassword ? "Repeat password" : "Password"}
//       type={visible ? "text" : "password"}
//       placeholder={
//         confirmPassword ? "Repeat your password" : "Type your password"
//       }
//       icon={<Lock />}
//       secondaryIcon={
//         <button
//           type="button"
//           className="btn-ghost cursor-pointer transition-transform duration-150 active:scale-90 hover:opacity-85"
//           onClick={() => setVisible((v) => !v)}
//           aria-label="Toggle password visibility"
//         >
//           {visible ? <Eye /> : <EyeOff />}
//         </button>
//       }
//     ></InputTextBox>
//   );
// };

// export default PasswordTextBox;

import { useState, forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import Lock from "../icons/lock";
import Eye from "../icons/eye";
import EyeOff from "../icons/eye-off";
import InputTextBox from "./input-textbox";

interface PasswordTextBoxProps extends InputHTMLAttributes<HTMLInputElement> {
  confirmPassword?: boolean;
  error?: string;
}

const PasswordTextBox = forwardRef<HTMLInputElement, PasswordTextBoxProps>(
  ({ confirmPassword = false, error, ...inputProps }, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <InputTextBox
        label={confirmPassword ? "Repeat password" : "Password"}
        type={visible ? "text" : "password"}
        placeholder={
          confirmPassword ? "Repeat your password" : "Type your password"
        }
        icon={<Lock />}
        error={error}
        ref={ref}
        {...inputProps}
        secondaryIcon={
          <button
            type="button"
            className="btn-ghost cursor-pointer transition-transform duration-150 active:scale-90 hover:opacity-85"
            onClick={() => setVisible((v) => !v)}
            aria-label="Toggle password visibility"
            aria-pressed={visible}
          >
            {visible ? <EyeOff /> : <Eye />}
          </button>
        }
      />
    );
  }
);

export default PasswordTextBox;
