// import type React from "react";
// import type { FC } from "react";

// interface InputTextBoxProps {
//   label: string;
//   type: string;
//   placeholder: string;
//   icon: React.ReactNode;
//   secondaryIcon?: React.ReactNode;
// }

// const InputTextBox: FC<InputTextBoxProps> = ({
//   label,
//   type,
//   placeholder,
//   icon,
//   secondaryIcon,
// }) => {
//   return (
//     <div className="flex flex-col gap-1">
//       <label className="text-[12px]">{label}</label>
//       <div className="flex flex-row py-2 gap-4 border-b items-center">
//         {icon}
//         <input
//           type={type}
//           placeholder={placeholder}
//           className="outline-none border-none flex-1 w-full"
//         />
//         {secondaryIcon}
//       </div>
//     </div>
//   );
// };

// export default InputTextBox;

import type { InputHTMLAttributes } from "react";
import type React from "react";
import { forwardRef } from "react";

interface InputTextBoxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: React.ReactNode;
  secondaryIcon?: React.ReactNode;
  error?: string;
}

const InputTextBox = forwardRef<HTMLInputElement, InputTextBoxProps>(
  ({ label, icon, secondaryIcon, error, ...inputProps }, ref) => (
    <div className="flex flex-col gap-1">
      <label className="text-[12px]">{label}</label>
      <div
        className={`flex flex-row py-2 gap-4 border-b items-center ${
          error ? "border-red-500" : ""
        }`}
      >
        {icon}
        <input
          ref={ref}
          className="outline-none border-none flex-1 w-full"
          {...inputProps}
        />
        {secondaryIcon}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
);

export default InputTextBox;
