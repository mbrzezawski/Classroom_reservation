import React from "react";
import type { ReservationType } from "../../../types/reservations";

interface TypePickerProps {
  type: ReservationType;
  setType: (type: ReservationType) => void;
}

const TypePicker: React.FC<TypePickerProps> = ({ type, setType }) => (
  <div className="flex flex-col">
    <label className="text-xs font-medium mb-1">Typ rezerwacji</label>
    <select
      id="type"
      value={type}
      onChange={(e) => setType(e.target.value as ReservationType)}
      className="select border p-2 rounded w-35 focus:outline-none"
    >
      <option value="single">Zwykła</option>
      <option value="recurring">Rekurencyjna</option>
    </select>
  </div>
);

export default TypePicker;
