import { useEffect, useState } from "react";
import { API_URL } from "../api";
import { useAuth } from "../auth/auth-context";
export type EquipmentOption = { value: string; label: string };

export function useEquipment() {
  const [roomEquipment, setRoomEquipment] = useState<EquipmentOption[]>([]);
  const {token} = useAuth();
  useEffect(() => {
    fetch(`${API_URL}/equipment`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
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
  const {token} = useAuth();
  useEffect(() => {
    fetch(`${API_URL}/software`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
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