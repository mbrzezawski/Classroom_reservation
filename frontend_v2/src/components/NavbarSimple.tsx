import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    IconCalendarEvent,
    IconFileSpreadsheet,
    IconChalkboard,
    IconPlus,
    IconUser,
    IconSchool,
    IconLogout,
} from '@tabler/icons-react';
import { Group, useMantineTheme } from '@mantine/core';
import classes from './NavbarSimple.module.css';

export interface NavbarSimpleProps {
    children: ReactNode;
}

// Dodaj odpowiednie ścieżki do linków
const navItems = [
    { link: '/', label: 'Kalendarz', icon: IconCalendarEvent },
    { link: '/reservations', label: 'Moje rezerwacje', icon: IconFileSpreadsheet },
    { link: '/classrooms', label: 'Sale', icon: IconChalkboard },
    { link: '/create', label: 'Dodaj rezerwację', icon: IconPlus },
];

export function NavbarSimple({ children }: NavbarSimpleProps) {
    const location = useLocation();
    const theme = useMantineTheme();

    const links = navItems.map((item) => {
        const isActive = location.pathname === item.link;
        return (
            <Link
                key={item.label}
                to={item.link}
                className={classes.link}
                data-active={isActive || undefined}
            >
                <item.icon
                    className={classes.linkIcon}
                    stroke={1.5}
                    color={isActive ? theme.colors.orange[6] : undefined}
                />
                <span>{item.label}</span>
            </Link>
        );
    });

    return (
        <div className={classes.layout}>
            <nav className={classes.navbar}>
                <div className={classes.navbarMain}>
                    <Group className={classes.header} justify="space-between">
                        <IconSchool size={28} color={theme.colors.orange[6]} />
                        <span>Nazwa aplikacji</span>
                    </Group>
                    {links}
                </div>
                <div className={classes.footer}>
                    <Link to="#" className={classes.link} onClick={(e) => e.preventDefault()}>
                        <IconUser className={classes.linkIcon} stroke={1.5} />
                        <span>Moje konto</span>
                    </Link>
                    <Link to="#" className={classes.link} onClick={(e) => e.preventDefault()}>
                        <IconLogout className={classes.linkIcon} stroke={1.5} />
                        <span>Wyloguj</span>
                    </Link>
                </div>
            </nav>
            <main className={classes.content}>{children}</main>
        </div>
    );
}
