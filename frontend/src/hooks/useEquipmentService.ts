import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import {API_URL} from "../api.ts";

export const useEquipmentService = () => {
    const createEquipment = useMutation({
        mutationFn: async (name: string) => {
            const response = await axios.post(API_URL + "/equipment", { name });
            return response.data;
        },
    });

    return {
        createEquipment,
    };
};
