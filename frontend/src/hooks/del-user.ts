import axios from "axios";
import {API_URL} from "../api.ts";

export const deleteUser = async (id: number) => {
    await axios.delete(`${API_URL}/users/${id}`);
};
