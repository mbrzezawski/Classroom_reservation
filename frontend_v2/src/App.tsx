import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { NavbarSimple } from './components/NavbarSimple';
import CalendarView from "./components/CalendarView.tsx";
import ReservationForm from "./components/ReservationForm.tsx";
import {ReservationsTable} from "./components/ReservationTable.tsx";
import {ClassroomTable} from "./components/ClassroomTable.tsx";

export default function App() {
    return (
        <NavbarSimple>
            <Routes>
                <Route path="/" element={<CalendarView userId='682b8bc9811311363ff183d0'/>} />
                <Route path="/classrooms" element={<ClassroomTable/>}/>
                <Route path="/reservations" element={<ReservationsTable userId='682b8bc9811311363ff183d0'/>}/>
                <Route path="/create" element={<ReservationForm userId='682b8bc9811311363ff183d0'/>}/>
            </Routes>
        </NavbarSimple>
    );
}
