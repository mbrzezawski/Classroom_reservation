import { useEffect, useState } from "react";
import { API_URL } from "../api.ts";
import type { Room } from "../types/room.ts";
import { useAuth } from "../auth/auth-context.tsx";
type RoomsMap = Record<string, Room>;

export const useRoomsMap = () => {
  const [roomsMap, setRoomsMap] = useState<RoomsMap>({});
  const { token } = useAuth();
  useEffect(() => {
    fetch(`${API_URL}/rooms`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((rooms: Room[]) => {
        const map: RoomsMap = {};
        rooms.forEach((room) => {
          map[room.id] = room;
        });
        setRoomsMap(map);
      })
      .catch((err) => console.error("Failed to fetch rooms:", err));
  }, []);

  return roomsMap;
};
