import axios from "axios";
import {useAuth} from "../auth/auth-context.tsx";
import { API_URL } from '../api';


export type ProposalRequestDto = {
    studentEmail: string;
    originalReservationId: string;
    comment: string;
    reservationRequests: {
        date: string;
        startTime: string;
        endTime: string;
        purpose: string;
        minCapacity: number;
        softwareIds: string[];
        equipmentIds: string[];
    }[];
};

export function usePostProposal() {
    const { token } = useAuth();

    const postProposal = async (dto: ProposalRequestDto) => {
        const response = await axios.post(`${API_URL}/proposals`, dto, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    };

    return { postProposal };
}
