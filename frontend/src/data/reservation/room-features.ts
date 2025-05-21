// export const roomEquipment = [
//   { value: 1, label: "Computers" },
//   { value: 2, label: "Projector" },
//   { value: 3, label: "Sieciowe rzeczy" }
// ];
// export const roomSoftware = [
//   { value: 1, label: "Stm32"},
//   { value: 2, label: "Wireshark"}
// ]


import { useEffect, useState } from "react";

export type EquipmentOption = { value: string; label: string };

export function useRoomEquipment() {
  const [roomEquipment, setRoomEquipment] = useState<EquipmentOption[]>([]);

  useEffect(() => {
    fetch("http://localhost:8080/equipment")
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

export function useSoftwareEquipment() {
  const [softwareEquipment, setSoftwareEquipment] = useState<EquipmentOption[]>([]);

  useEffect(() => {
    fetch("http://localhost:8080/software")
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