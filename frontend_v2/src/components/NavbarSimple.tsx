// src/components/NavbarSimple.tsx
import { useMantineTheme } from '@mantine/core';
import type { Dispatch, SetStateAction } from 'react';
import {
  IconCalendarEvent,
  IconFileSpreadsheet,
  IconChalkboard,
  IconPlus,
  IconUser,
  IconLogout,
} from '@tabler/icons-react';
import { Group } from '@mantine/core';
import classes from './NavbarSimple.module.css';

export type NavOption = 'Kalendarz' | 'Moje rezerwacje' | 'Sale' | 'Dodaj rezerwacje';

interface NavbarSimpleProps {
  active: NavOption;
  setActive: Dispatch<SetStateAction<NavOption>>;
}

const data: { label: NavOption; icon: React.FC<any> }[] = [
  { label: 'Kalendarz', icon: IconCalendarEvent },
  { label: 'Moje rezerwacje', icon: IconFileSpreadsheet },
  { label: 'Sale', icon: IconChalkboard },
  { label: 'Dodaj rezerwacje', icon: IconPlus },
];

function NavbarSimple({ active, setActive }: NavbarSimpleProps) {
  const theme = useMantineTheme();

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-between">
          <IconChalkboard size={28} color={theme.colors.orange[6]} />
          <span>Nazwa aplikacji</span>
        </Group>

        {data.map(({ label, icon: Icon }) => (
          <a
            key={label}
            href="#"
            className={classes.link}
            data-active={label === active || undefined}
            onClick={(e) => {
              e.preventDefault();
              setActive(label);
            }}
          >
            <Icon className={classes.linkIcon} stroke={1.5} />
            <span>{label}</span>
          </a>
        ))}
      </div>

      <div className={classes.footer}>
        <a href="#" className={classes.link} onClick={(e) => e.preventDefault()}>
          <IconUser className={classes.linkIcon} stroke={1.5} />
          <span>Moje konto</span>
        </a>
        <a href="#" className={classes.link} onClick={(e) => e.preventDefault()}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Wyloguj</span>
        </a>
      </div>
    </nav>
  );
}

export default NavbarSimple;
