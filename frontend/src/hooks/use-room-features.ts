import { useEffect, useState } from "react";
import { API_URL } from "../api";
export type EquipmentOption = { value: string; label: string };

export function useEquipment() {
  const [roomEquipment, setRoomEquipment] = useState<EquipmentOption[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/equipment`)
      .then(res => res.json())
      .then((data) => {
        setRoomEquipment(
          data.map((e: any) => ({
            value: e.id,
            label: e.name
          }))
        );
      });
  }, []);

  return roomEquipment;
}

export function useSoftware() {
  const [softwareEquipment, setSoftwareEquipment] = useState<EquipmentOption[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/software`)
      .then(res => res.json())
      .then((data) => {
        setSoftwareEquipment(
          data.map((e: any) => ({
            value: e.id,
            label: e.name
          }))
        );
      });
  }, []);

  return softwareEquipment;
}