import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { NavbarSimple } from './components/NavbarSimple';
import Classrooms from './classrooms';
import CalendarView from "./components/CalendarView.tsx";

export default function App() {
    return (
        <NavbarSimple>
            <Routes>
                <Route path="/" element={<CalendarView userId='682b8bc4811311363ff183cf'/>} />
                <Route path="/classrooms" element={<Classrooms/>}/>
                <Route path="/reservations" element={<div>Tu będą moje rezerwacje :)</div>}/>
                <Route path="/create" element={<div>Tu będzie dodawanie rezerwacji :)</div>}/>

            </Routes>
        </NavbarSimple>
    );
}