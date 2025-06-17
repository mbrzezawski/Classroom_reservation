import axios from "axios";
import {API_URL} from "../api.ts";

export const deleteUser = async (id: number, token: string) => {
    await axios.delete(`${API_URL}/users/${id}`,
            {headers: {
                Authorization: `Bearer ${token}`
            }
});
};
