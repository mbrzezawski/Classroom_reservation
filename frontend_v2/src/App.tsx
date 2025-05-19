import React from 'react';
// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';
import { NavbarSimple } from "./components/NavbarSimple.tsx";

export default function App() {
    return <MantineProvider>{<NavbarSimple/>}</MantineProvider>;
}