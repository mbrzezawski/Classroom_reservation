import { API_URL } from '../api';
import axios from 'axios';


export const createRoom = async (NewRoomFormValues: {
    name: string;
    capacity: number;
    location: string;
    softwareIds: string[];
    customSoftware?: string;
    equipmentIds: string[];
    customEquipment?: string;
}) => {
    return axios.post(API_URL + "/rooms");
};