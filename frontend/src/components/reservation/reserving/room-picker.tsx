// RoomPicker.tsx
import type { FC } from "react";
import { useFormContext } from "react-hook-form";
import type { Room } from "../../../types/room";

interface RoomPickerProps {
  roomsMap: Record<string, Room>;
}

const RoomPicker: FC<RoomPickerProps> = ({ roomsMap }) => {
  const { register, setValue } = useFormContext();

  const handleRoomSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedName = e.target.value;
    const foundEntry = Object.entries(roomsMap).find(
      ([, room]) => room.name === selectedName
    );
    if (foundEntry) {
      const [roomId] = foundEntry;
      setValue("roomId", roomId);
    }
  };

  return (
    <div className="flex flex-col gap-1 w-1/2">
      <label className="text-[12px]">Room</label>
      <input
        list="rooms-list"
        className="input focus:outline-none"
        placeholder="Search for a room"
        onChange={handleRoomSelect}
      />
      <datalist id="rooms-list">
        {Object.values(roomsMap).map((room) => (
          <option key={room.name} value={room.name} />
        ))}
      </datalist>
      {/* ukryte pole na faktyczne roomId */}
      <input type="hidden" {...register("roomId")} />
    </div>
  );
};

export default RoomPicker;
// filepath: c:\STUDIA\Classroom_reservation\frontend\src\components\reservation\reserving\RoomPicker.tsx