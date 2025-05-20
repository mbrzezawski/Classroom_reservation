import React, { useEffect, useState } from 'react';
import { IconChevronDown, IconChevronUp, IconSearch, IconSelector } from '@tabler/icons-react';
import {
    Center,
    Group,
    ScrollArea,
    Table,
    Text,
    TextInput,
    UnstyledButton,
} from '@mantine/core';
import classes from './Classroom.module.css';

interface ReservationEntry {
    reservationId: string;
    roomName: string;
    roomLocation: string;
    title: string;
    start: string;    // ISO datetime
    end: string;      // ISO datetime
    minCapacity: number;
}

interface ThProps {
    children: React.ReactNode;
    reversed: boolean;
    sorted: boolean;
    onSort: () => void;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
    const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
    return (
        <Table.Th className={classes.th}>
            <UnstyledButton onClick={onSort} className={classes.control}>
                <Group position="apart">
                    <Text weight={500} size="sm">
                        {children}
                    </Text>
                    <Center className={classes.icon}>
                        <Icon size={16} stroke={1.5} />
                    </Center>
                </Group>
            </UnstyledButton>
        </Table.Th>
    );
}

function filterData(data: ReservationEntry[], search: string) {
    const q = search.toLowerCase().trim();
    return data.filter(item =>
        item.roomName.toLowerCase().includes(q) ||
        item.roomLocation.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.minCapacity.toString().includes(q)
    );
}

function sortData(
    data: ReservationEntry[],
    payload: { sortBy: keyof ReservationEntry | null; reversed: boolean; search: string }
) {
    const { sortBy, reversed, search } = payload;
    const filtered = filterData(data, search);
    if (!sortBy) return filtered;

    return [...filtered].sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        if (typeof aValue === 'number' && typeof bValue === 'number') {
            return reversed ? bValue - aValue : aValue - bValue;
        }
        return reversed
            ? String(bValue).localeCompare(String(aValue))
            : String(aValue).localeCompare(String(bValue));
    });
}

interface ReservationsTableProps {
    userId: string;
}

export const ReservationsTable: React.FC<ReservationsTableProps> = ({ userId }) => {
    const [data, setData] = useState<ReservationEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState<keyof ReservationEntry | null>(null);
    const [reverseSortDirection, setReverseSortDirection] = useState(false);
    const [sortedData, setSortedData] = useState<ReservationEntry[]>([]);

    useEffect(() => {
        async function fetchReservations() {
            try {
                const res = await fetch(`http://localhost:8080/reservations/calendar?userId=${userId}`);
                if (!res.ok) throw new Error(res.statusText);
                const list: ReservationEntry[] = await res.json();
                setData(list);
                setSortedData(list);
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }
        fetchReservations();
    }, [userId]);

    useEffect(() => {
        setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search }));
    }, [data, sortBy, reverseSortDirection, search]);

    const setSorting = (field: keyof ReservationEntry) => {
        const reversed = field === sortBy ? !reverseSortDirection : false;
        setReverseSortDirection(reversed);
        setSortBy(field);
    };

    if (loading) return <Text>Ładowanie rezerwacji...</Text>;
    if (error) return <Text color="red">{error}</Text>;

    const rows = sortedData.map(item => (
        <Table.Tr key={item.reservationId}>
            <Table.Td>{item.roomName}</Table.Td>
            <Table.Td>{item.roomLocation}</Table.Td>
            <Table.Td>{item.title}</Table.Td>
            <Table.Td>{new Date(item.start).toLocaleString()}</Table.Td>
            <Table.Td>{new Date(item.end).toLocaleString()}</Table.Td>
            <Table.Td>{item.minCapacity}</Table.Td>
        </Table.Tr>
    ));

    return (
        <ScrollArea>
            <TextInput
                placeholder="Wyszukaj rezerwacje"
                mb="md"
                leftSection={<IconSearch size={16} stroke={1.5} />}
                value={search}
                onChange={e => setSearch(e.currentTarget.value)}
            />
            <Table horizontalSpacing="md" verticalSpacing="xs" miw={700}>
                <Table.Thead>
                    <Table.Tr>
                        <Th sorted={sortBy === 'roomName'} reversed={reverseSortDirection} onSort={() => setSorting('roomName')}>Sala</Th>
                        <Th sorted={sortBy === 'roomLocation'} reversed={reverseSortDirection} onSort={() => setSorting('roomLocation')}>Lokalizacja</Th>
                        <Th sorted={sortBy === 'title'} reversed={reverseSortDirection} onSort={() => setSorting('title')}>Cel</Th>
                        <Th sorted={sortBy === 'start'} reversed={reverseSortDirection} onSort={() => setSorting('start')}>Start</Th>
                        <Th sorted={sortBy === 'end'} reversed={reverseSortDirection} onSort={() => setSorting('end')}>Koniec</Th>
                        <Th sorted={sortBy === 'minCapacity'} reversed={reverseSortDirection} onSort={() => setSorting('minCapacity')}>Pojemność</Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {rows.length > 0 ? rows : (
                        <Table.Tr>
                            <Table.Td colSpan={6}>
                                <Text weight={500} align="center">Brak rezerwacji</Text>
                            </Table.Td>
                        </Table.Tr>
                    )}
                </Table.Tbody>
            </Table>
        </ScrollArea>
    );
};
