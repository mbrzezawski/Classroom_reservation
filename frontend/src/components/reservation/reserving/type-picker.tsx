import React from "react";
import type { ReservationType } from "../../../types/reservations";

interface TypePickerProps {
    type: ReservationType;
    setType: (type: ReservationType) => void;
}

const TypePicker: React.FC<TypePickerProps> = ({ type, setType }) => (
    <div className="flex flex-col">
        <label className="text-xs font-medium mb-1" >Reservation Type</label>
        <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as ReservationType)}
            className="option border p-2 rounded"
        >
            <option value="single">Single</option>
            <option value="recurring">Recurring</option>
        </select>
    </div>
);

export default TypePicker;