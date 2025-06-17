import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import {API_URL} from "../api.ts";

export const useRoomService = () => {
    const createRoom = useMutation({
        mutationFn: async (roomData: any) => {
            const response = await axios.post(API_URL + "/rooms", roomData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            });
            return response.data;
        },
    });

    return {
        createRoom,
    };
};
