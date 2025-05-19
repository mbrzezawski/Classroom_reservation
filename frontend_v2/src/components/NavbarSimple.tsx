import { useState } from 'react';
import {
    Icon2fa,
    IconBellRinging,
    IconDatabaseImport,
    IconFingerprint,
    IconCalendarEvent,
    IconFileSpreadsheet,
    IconChalkboard,
    IconPlus,
    IconUser,
    IconSchool,
    IconKey,
    IconLogout,
    IconReceipt2,
    IconSettings,
    IconSwitchHorizontal,
} from '@tabler/icons-react';
import { Code, Group } from '@mantine/core';
import { useMantineTheme } from '@mantine/core';
import classes from './NavbarSimple.module.css';

const data = [
    { link: '', label: 'Kalendarz', icon: IconCalendarEvent },
    { link: '', label: 'Moje rezerwacje', icon: IconFileSpreadsheet },
    { link: '', label: 'Sale', icon: IconChalkboard },
    { link: '', label: 'Dodaj rezerwacje', icon: IconPlus },

];

export function NavbarSimple() {
    const [active, setActive] = useState('Billing');
    const theme = useMantineTheme();
    const links = data.map((item) => (
        <a
            className={classes.link}
            data-active={item.label === active || undefined}
            href={item.link}
            key={item.label}
            onClick={(event) => {
                event.preventDefault();
                setActive(item.label);
            }}
        >
            <item.icon className={classes.linkIcon} stroke={1.5} />
            <span>{item.label}</span>
        </a>
    ));

    return (
        <nav className={classes.navbar}>
            <div className={classes.navbarMain}>
                <Group className={classes.header} justify="space-between">
                    <IconSchool size={28} color={theme.colors.orange[6]}/>
                    <span>Nazwa aplikacji</span>
                </Group>
                {links}
            </div>

            <div className={classes.footer}>
                <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
                    <IconUser className={classes.linkIcon} stroke={1.5} />
                    <span>Moje konto</span>
                </a>

                <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
                    <IconLogout className={classes.linkIcon} stroke={1.5} />
                    <span>Wyloguj</span>
                </a>
            </div>
        </nav>
    );
}