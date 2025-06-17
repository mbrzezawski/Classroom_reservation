import axios from "axios";
import {API_URL} from "../api.ts";

export const deleteRoom = async (id: number, token: string) => {

    await axios.delete(`${API_URL}/rooms/${id}`,                     {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};
