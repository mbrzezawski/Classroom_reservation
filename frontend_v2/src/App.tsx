import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { NavbarSimple } from './components/NavbarSimple';
import Classrooms from './classrooms';
import {FetchRoomsDemo} from "./FetchRoomsDemo.tsx";

export default function App() {
    return (
        <NavbarSimple>
            <FetchRoomsDemo/>
            <Routes>
                <Route path="/" element={<div>Witaj w aplikacji!</div>} />
                <Route path="/classrooms" element={<Classrooms/>}/>
            </Routes>
        </NavbarSimple>
    );
}