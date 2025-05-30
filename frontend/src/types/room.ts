export type Room = {
    id: string;
    name: string;
    capacity: number;
    softwareIds: string[];
    equipmentIds: string[];
    location: string;
};