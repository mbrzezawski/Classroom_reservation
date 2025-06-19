import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import {API_URL} from "../api.ts";

export const useSoftwareService = () => {
    const createSoftware = useMutation({
        mutationFn: async (name: string) => {
            const response = await axios.post(API_URL + "/software", { name }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            return response.data;
        },
    });

    return {
        createSoftware,
    };
};
