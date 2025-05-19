import type { FC, InputHTMLAttributes } from "react";
import type React from "react";

export interface InputTextBoxProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: React.ReactNode;
  secondaryIcon?: React.ReactNode;
  error?: string;
}

const InputTextBox: FC<InputTextBoxProps> = ({
  label,
  icon,
  secondaryIcon,
  error,
  ...inputProps
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[12px] self-start">{label}</label>
      <div className="flex flex-row border-b py-2 gap-2">
        {icon}
        <input
          className="outline-none border-none flex-1 w-full"
          {...inputProps}
        />
        {secondaryIcon}
      </div>
      {error && <p className="text-red-500 text-xs mt-1 self-start">{error}</p>}
    </div>
  );
};

export default InputTextBox;
