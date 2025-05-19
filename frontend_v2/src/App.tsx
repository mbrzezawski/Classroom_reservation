// src/App.tsx
import React, { useState } from 'react';
import { MantineProvider, AppShell } from '@mantine/core';
import { BrowserRouter } from 'react-router-dom';
import NavbarSimple from './components/NavbarSimple';
import type { NavOption } from './components/NavbarSimple';

import CalendarView from './components/CalendarView';
import ListView from './components/ListView';

const App: React.FC = () => {
  const [active, setActive] = useState<NavOption>('Kalendarz');

  const renderContent = () => {
    switch (active) {
      case 'Kalendarz':
        return <CalendarView userId='682b8bc4811311363ff183cf'/>;
      case 'Moje rezerwacje':
        return <ListView userId='682b8bc4811311363ff183cf'/>;
      case 'Sale':
        return <div>Widok sal</div>;
      case 'Dodaj rezerwacje':
        return <div>Formularz dodawania</div>;
      default:
        return <CalendarView userId='682b8bc4811311363ff183cf'/>;
    }
  };

  return (
    <MantineProvider>
      <BrowserRouter>
        <AppShell
          padding="md"
          navbar={{ width: 250, breakpoint: 'sm', collapsed: { mobile: false } }}
        >
          <AppShell.Navbar p="md">
            <NavbarSimple active={active} setActive={setActive} />
          </AppShell.Navbar>

          <AppShell.Main>
            {renderContent()}
          </AppShell.Main>
        </AppShell>
      </BrowserRouter>
    </MantineProvider>
  );
};

export default App;
