import axios from "axios";
import {API_URL} from "../api.ts";

export const deleteRoom = async (id: number) => {
    await axios.delete(`${API_URL}/rooms/${id}`);
};
