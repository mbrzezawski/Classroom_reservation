import { useEffect, useState } from 'react';
import { API_URL } from '../api';
import {useAuth} from "../auth/auth-context.tsx";

export interface Room {
    id: string;
    name: string;
    capacity: number;
    softwareIds: string[];
    equipmentIds: string[];
    location: string;
}

export const useRooms = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const {token} = useAuth();

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const res = await fetch(`${API_URL}/rooms`,
                    {
                    headers: {
                        Authorization: `Bearer ${token}`
                        }
                    });
                if (!res.ok) throw new Error('Error fetching rooms');
                const data: Room[] = await res.json();
                setRooms(data);
            } catch (err: any) {
                setError(err.message || 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);

    return { rooms, loading, error };
};
