import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { NavbarSimple } from './components/NavbarSimple';
import CalendarView from './components/CalendarView';
import ReservationForm from './components/ReservationForm';
import { ReservationsTable } from './components/ReservationTable';
import { ClassroomTable } from './components/ClassroomTable';
import EditReservation from './components/EditReservation';

import type { SinglePayload, RecurringPayload } from './components/ReservationForm';
const API_BASE = 'http://localhost:8080';


export default function App() {
  const userId = '682b8bc9811311363ff183d0';

  const handleCreate = (
    payload: SinglePayload | RecurringPayload,
    type: 'single' | 'recurring'
  ) => {
    if (type === 'single') {
      return axios.post(`${API_BASE}/reservations/book`, payload);
    } else {
      return axios.post(`${API_BASE}/recurring-reservations`, payload);
    }
  };

  return (
    <NavbarSimple>
        <Routes>
            <Route path="/" element={<CalendarView userId={userId}/>} />
            <Route
                path="/create"
                element={<ReservationForm userId={userId} onSubmit={handleCreate} />}
            />
            <Route
                path="/reservations/edit/:id"
                element={<EditReservation userId={userId} />}
            />
            <Route
                path="/reservations"
                element={<ReservationsTable userId={userId} />}
            />
            <Route path="/calendar" element={<CalendarView userId={userId}/>} />
            <Route path="/classrooms" element={<ClassroomTable />} />
        </Routes>
    </NavbarSimple>
    
  );
}
