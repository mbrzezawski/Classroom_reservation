import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import classes from './css/ReservationForm.module.css';

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

interface ReservationRequestPayload {
    date: string;        // YYYY-MM-DD
    startTime: string;   // HH:mm
    endTime: string;     // HH:mm
    purpose: string;
    minCapacity: number;
    softwareIds: string[];
    equipmentIds: string[];
    userId: string;
}

interface ReservationFormProps {
    userId: string;
}

const ReservationForm: React.FC<ReservationFormProps> = ({ userId }) => {
    const [softwareList, setSoftwareList] = useState<Software[]>([]);
    const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
    const [formData, setFormData] = useState<Omit<ReservationRequestPayload, 'userId'>>({
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
            const setIds = new Set(prev[field]);
            if (checked) setIds.add(value);
            else setIds.delete(value);
            return { ...prev, [field]: Array.from(setIds) } as any;
        });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setResponseMsg(null);
        setErrorMsg(null);

        const payload: ReservationRequestPayload = {
            ...formData,
            userId,
        };

        axios.post<ReservationResponse>(`${API_BASE}/reservations/book`, payload)
            .then(res => setResponseMsg(res.data.message))
            .catch(err => {
                setErrorMsg(err.response?.data?.message || 'Błąd podczas rezerwacji.');
            });
    };

    return (
        <div className={classes.container}>
            <h2 className={classes.header}>Nowa rezerwacja</h2>
            <form onSubmit={handleSubmit}>
                <div className={classes.formGroup}>
                    <label className={classes.label}>Data:</label>
                    <input
                        className={classes.input}
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={classes.formGroup}>
                    <label className={classes.label}>Godzina rozpoczęcia:</label>
                    <input
                        className={classes.input}
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={classes.formGroup}>
                    <label className={classes.label}>Godzina zakończenia:</label>
                    <input
                        className={classes.input}
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={classes.formGroup}>
                    <label className={classes.label}>Cel rezerwacji:</label>
                    <input
                        className={classes.input}
                        type="text"
                        name="purpose"
                        value={formData.purpose}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={classes.formGroup}>
                    <label className={classes.label}>Minimalna pojemność:</label>
                    <input
                        className={classes.input}
                        type="number"
                        name="minCapacity"
                        min={1}
                        value={formData.minCapacity}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={classes.formGroup}>
                    <label className={classes.label}>Oprogramowanie:</label>
                    <div className={classes.checkboxGroup}>
                        {softwareList.map(sw => (
                            <label key={sw.id} className={classes.checkboxItem}>
                                <input
                                    className={classes.checkboxInput}
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
                <div className={classes.formGroup}>
                    <label className={classes.label}>Sprzęt:</label>
                    <div className={classes.checkboxGroup}>
                        {equipmentList.map(eq => (
                            <label key={eq.id} className={classes.checkboxItem}>
                                <input
                                    className={classes.checkboxInput}
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
                <button className={classes.button} type="submit">Rezerwuj</button>
            </form>
            {responseMsg && <p className={classes.messageSuccess}>{responseMsg}</p>}
            {errorMsg && <p className={classes.messageError}>{errorMsg}</p>}
        </div>
    );
};

export default ReservationForm;
