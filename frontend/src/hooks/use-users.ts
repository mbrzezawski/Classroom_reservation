import { useEffect, useState } from 'react';
import { API_URL } from '../api';

export interface User {
    id: string;
    email: string;
    role: string;
}

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(`${API_URL}/users`);
                if (!res.ok) throw new Error('Error fetching users');
                const data: User[] = await res.json();
                setUsers(data);
            } catch (err: any) {
                setError(err.message || 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return { users, loading, error };
};
