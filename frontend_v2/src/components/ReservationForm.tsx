import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

interface Software {
    id: string;
    name: string;
}

interface Equipment {
    id: string;
    name: string;
}

interface ReservationResponse {
    reservationId: string;
    roomId: string;
    message: string;
}

interface ReservationRequest {
    userId: string;
    date: string;        // YYYY-MM-DD
    startTime: string;   // HH:mm
    endTime: string;     // HH:mm
    purpose: string;
    minCapacity: number;
    softwareIds: string[];
    equipmentIds: string[];
}

const ReservationForm: React.FC = () => {
    const [softwareList, setSoftwareList] = useState<Software[]>([]);
    const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
    const [formData, setFormData] = useState<ReservationRequest>({
        userId: '',
        date: '',
        startTime: '',
        endTime: '',
        purpose: '',
        minCapacity: 1,
        softwareIds: [],
        equipmentIds: [],
    });
    const [responseMsg, setResponseMsg] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const API_BASE = 'http://localhost:8080';

    const styles: Record<string, React.CSSProperties> = {
        container: {
            maxWidth: 600,
            margin: '40px auto',
            padding: 20,
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            backgroundColor: '#fff',
            fontFamily: 'Arial, sans-serif'
        },
        header: {
            textAlign: 'center' as const,
            marginBottom: 20,
            color: '#333'
        },
        formGroup: {
            marginBottom: 15
        },
        label: {
            display: 'block',
            marginBottom: 5,
            fontWeight: 500
        },
        input: {
            width: '100%',
            padding: '8px 10px',
            borderRadius: 4,
            border: '1px solid #ccc'
        },
        checkboxGroup: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: 10
        },
        checkboxItem: {
            display: 'flex',
            alignItems: 'center',
            padding: '5px 8px',
            border: '1px solid #ddd',
            borderRadius: 4,
            cursor: 'pointer'
        },
        checkboxInput: {
            marginRight: 6
        },
        button: {
            width: '100%',
            padding: '10px',
            border: 'none',
            borderRadius: 4,
            backgroundColor: '#007bff',
            color: '#fff',
            fontSize: '16px',
            cursor: 'pointer'
        },
        messageSuccess: {
            marginTop: 15,
            color: 'green',
            textAlign: 'center' as const
        },
        messageError: {
            marginTop: 15,
            color: 'red',
            textAlign: 'center' as const
        }
    };

    useEffect(() => {
        axios.get<Software[]>(`${API_BASE}/software`)
            .then(res => setSoftwareList(res.data))
            .catch(err => console.error('Failed to load software', err));

        axios.get<Equipment[]>(`${API_BASE}/equipment`)
            .then(res => setEquipmentList(res.data))
            .catch(err => console.error('Failed to load equipment', err));
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value } as any));
    };

    const handleCheckboxChange = (
        e: ChangeEvent<HTMLInputElement>,
        field: 'softwareIds' | 'equipmentIds'
    ) => {
        const { value, checked } = e.target;
        setFormData(prev => {
            const list = new Set(prev[field]);
            if (checked) list.add(value);
            else list.delete(value);
            return { ...prev, [field]: Array.from(list) } as any;
        });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setResponseMsg(null);
        setErrorMsg(null);

        axios.post<ReservationResponse>(`${API_BASE}/reservations/book`, formData)
            .then(res => setResponseMsg(res.data.message))
            .catch(err => {
                setErrorMsg(err.response?.data?.message || 'Błąd podczas rezerwacji.');
            });
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>Nowa rezerwacja</h2>
            <form onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>User ID:</label>
                    <input
                        style={styles.input}
                        type="text"
                        name="userId"
                        value={formData.userId}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Data:</label>
                    <input
                        style={styles.input}
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Godzina rozpoczęcia:</label>
                    <input
                        style={styles.input}
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Godzina zakończenia:</label>
                    <input
                        style={styles.input}
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Cel rezerwacji:</label>
                    <input
                        style={styles.input}
                        type="text"
                        name="purpose"
                        value={formData.purpose}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Minimalna pojemność:</label>
                    <input
                        style={styles.input}
                        type="number"
                        name="minCapacity"
                        min={1}
                        value={formData.minCapacity}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Oprogramowanie:</label>
                    <div style={styles.checkboxGroup}>
                        {softwareList.map(sw => (
                            <label key={sw.id} style={styles.checkboxItem}>
                                <input
                                    style={styles.checkboxInput}
                                    type="checkbox"
                                    value={sw.id}
                                    checked={formData.softwareIds.includes(sw.id)}
                                    onChange={e => handleCheckboxChange(e, 'softwareIds')}
                                />
                                {sw.name}
                            </label>
                        ))}
                    </div>
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Sprzęt:</label>
                    <div style={styles.checkboxGroup}>
                        {equipmentList.map(eq => (
                            <label key={eq.id} style={styles.checkboxItem}>
                                <input
                                    style={styles.checkboxInput}
                                    type="checkbox"
                                    value={eq.id}
                                    checked={formData.equipmentIds.includes(eq.id)}
                                    onChange={e => handleCheckboxChange(e, 'equipmentIds')}
                                />
                                {eq.name}
                            </label>
                        ))}
                    </div>
                </div>
                <button style={styles.button} type="submit">Rezerwuj</button>
            </form>
            {responseMsg && <p style={styles.messageSuccess}>{responseMsg}</p>}
            {errorMsg && <p style={styles.messageError}>{errorMsg}</p>}
        </div>
    );
};

export default ReservationForm;
