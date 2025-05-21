import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import classes from './css/ReservationForm.module.css';
import type { ReservationRequestDTO, ReservationResponseDTO } from '../types/types';

interface Software { id: string; name: string; }
interface Equipment { id: string; name: string; }

type ReservationType = 'single' | 'recurring';
type FrequencyOption = 'DAILY' | 'WEEKLY' | 'MONTHLY';
const frequencyOptions: FrequencyOption[] = ['DAILY', 'WEEKLY', 'MONTHLY'];

const frequencyLabels: Record<FrequencyOption, string> = {
  DAILY: 'Codziennie',
  WEEKLY: 'Co tydzień',
  MONTHLY: 'Co miesiąc',
};

const weekdays = [
  { label: 'Poniedziałek', value: 'MONDAY' },
  { label: 'Wtorek', value: 'TUESDAY' },
  { label: 'Środa', value: 'WEDNESDAY' },
  { label: 'Czwartek', value: 'THURSDAY' },
  { label: 'Piątek', value: 'FRIDAY' },
  { label: 'Sobota', value: 'SATURDAY' },
  { label: 'Niedziela', value: 'SUNDAY' },
];

export interface SinglePayload {
  date: string;        // YYYY-MM-DD
  startTime: string;   // HH:mm
  endTime: string;     // HH:mm
  purpose: string;
  minCapacity: number;
  softwareIds: string[];
  equipmentIds: string[];
  userId: string;
}

export interface RecurringPayload {
  startDate: string;        // YYYY-MM-DD
  endDate: string;          // YYYY-MM-DD
  startTime: string;        // HH:mm
  endTime: string;          // HH:mm
  purpose: string;
  minCapacity: number;
  softwareIds: string[];
  equipmentIds: string[];
  frequency: FrequencyOption;
  interval: number;  
  byMonthDays: number[]
  byDays: string[];
  userId: string;
}

interface ReservationFormProps {
  userId: string;
  initialData?: ReservationRequestDTO;
  onSubmit: (
    payload: SinglePayload | RecurringPayload,
    type: ReservationType
  ) => void;
}

const ReservationForm: React.FC<ReservationFormProps> = ({ userId, initialData, onSubmit }) => {
  const [softwareList, setSoftwareList] = useState<Software[]>([]);
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [reservationType, setReservationType] = useState<ReservationType>('single');
  const [formData, setFormData] = useState<any>({
    date: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    purpose: '',
    minCapacity: 1,
    softwareIds: [] as string[],
    equipmentIds: [] as string[],
    frequency: 'WEEKLY' as FrequencyOption,
    interval: 1,
    byDays: [] as string[],
    byMonthDays:  [] as number[]
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

  useEffect(() => { 
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;
  if (name === 'byMonthDays') {
    const num = parseInt(value, 10);
    setFormData((prev: any) => ({ 
      ...prev, 
      byMonthDays: isNaN(num) ? [] : [num] 
    }));
  } else {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  }
};

  const handleCheckboxChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: 'softwareIds' | 'equipmentIds' | 'byDays'
  ) => {
    const { value, checked } = e.target;
    setFormData((prev: any) => {
      const setIds = new Set(prev[field]);
      if (checked) setIds.add(value);
      else setIds.delete(value);
      return { ...prev, [field]: Array.from(setIds) };
    });
  };

  const handleTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setReservationType(e.target.value as ReservationType);
    setResponseMsg(null);
    setErrorMsg(null);
  };

  const handleSubmit = (e: FormEvent) => {
  e.preventDefault();
  setResponseMsg(null);
  setErrorMsg(null);

  if (reservationType === 'single') {
    const payload: SinglePayload = {
      ...formData,
      userId,
    };
    onSubmit(payload, 'single');
  } else {
    const payload: RecurringPayload = {
      startDate:    formData.startDate,
      endDate:      formData.endDate,
      startTime:    formData.startTime,
      endTime:      formData.endTime,
      purpose:      formData.purpose,
      minCapacity:  formData.minCapacity,
      softwareIds:  formData.softwareIds,
      equipmentIds: formData.equipmentIds,
      frequency:    formData.frequency,
      interval:     formData.interval,
      byMonthDays:  formData.byMonthDays,
      byDays:       formData.byDays,
      userId,
    };
    onSubmit(payload, 'recurring');
  }
};


  return (
    <div className={classes.container}>
      <h2 className={classes.header}>Nowa rezerwacja</h2>
      <form onSubmit={handleSubmit}>
        <div className={classes.formGroup}>
          <label className={classes.label}>Typ rezerwacji:</label>
          <label className={classes.checkboxItem}>
            <input
              type="radio"
              name="reservationType"
              value="single"
              checked={reservationType === 'single'}
              onChange={handleTypeChange}
            /> Pojedyncza
          </label>
          <label className={classes.checkboxItem}>
            <input
              type="radio"
              name="reservationType"
              value="recurring"
              checked={reservationType === 'recurring'}
              onChange={handleTypeChange}
            /> Cykliczna
          </label>
        </div>

        {reservationType === 'single' ? (
        <>
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
                step="900"
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
                step="900"
                value={formData.endTime}
                onChange={handleChange}
                required
            />
            </div>


        </>
          
        ) : (
          <>
            <div className={classes.formGroup}>
            <label className={classes.label}>Data rozpoczęcia:</label>
            <input
                className={classes.input}
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
            />
            </div>

            <div className={classes.formGroup}>
            <label className={classes.label}>Data zakończenia:</label>
            <input
                className={classes.input}
                type="date"
                name="endDate"
                value={formData.endDate}
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
                step="900"
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
                step="900"
                value={formData.endTime}
                onChange={handleChange}
                required
            />
            </div>
            <div className={classes.formGroup}>
            <label className={classes.label}>Częstotliwość:</label>
            <select
                className={classes.input}
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
            >
                {frequencyOptions.map(opt => (
                <option key={opt} value={opt}>
                    {frequencyLabels[opt]}
                </option>
                ))}
            </select>
            </div>
            <div className={classes.formGroup}>
              <label className={classes.label}>Co ile:</label>
              <input
                className={classes.input}
                type="number"
                name="interval"
                min={1}
                value={formData.interval}
                onChange={handleChange}
              />
            </div>


            {formData.frequency === 'WEEKLY' && (
              <div className={classes.formGroup}>
                <label className={classes.label}>Dni tygodnia:</label>
                <div className={classes.checkboxGroup}>
                  {weekdays.map(day => (
                    <label key={day.value} className={classes.checkboxItem}>
                      <input
                        className={classes.checkboxInput}
                        type="checkbox"
                        value={day.value}
                        checked={formData.byDays.includes(day.value)}
                        onChange={e => handleCheckboxChange(e, 'byDays')}
                      /> {day.label}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {formData.frequency === 'MONTHLY' && (
                <div className={classes.formGroup}>
                    <label className={classes.label}>Dzień miesiąca:</label>
                    <input
                    className={classes.input}
                    type="number"
                    name="byMonthDays"
                    min={1}
                    max={31}
                    value={formData.byMonthDays[0] || ''}
                    onChange={handleChange} 
                    required
                    />
                </div>
                )}
          </>
        )}

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
