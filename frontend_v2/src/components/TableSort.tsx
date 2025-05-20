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
import classes from './TableSort.module.css';

interface RoomData {
    id: string;
    name: string;
    capacity: number;
    location: string;
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
                <Group justify="space-between">
                    <Text fw={500} fz="sm">
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

function filterData(data: RoomData[], search: string) {
    const query = search.toLowerCase().trim();
    return data.filter(
        (item) =>
            item.name.toLowerCase().includes(query) ||
            item.location.toLowerCase().includes(query) ||
            item.capacity.toString().includes(query)
    );
}

function sortData(
    data: RoomData[],
    payload: { sortBy: keyof RoomData | null; reversed: boolean; search: string }
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

export function TableSort() {
    const [data, setData] = useState<RoomData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState<keyof RoomData | null>(null);
    const [reverseSortDirection, setReverseSortDirection] = useState(false);
    const [sortedData, setSortedData] = useState<RoomData[]>([]);

    useEffect(() => {
        async function fetchRooms() {
            try {
                const res = await fetch('http://localhost:8080/rooms');
                const rooms: RoomData[] = await res.json();
                setData(rooms);
                setSortedData(rooms);
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }
        fetchRooms();
    }, []);

    useEffect(() => {
        setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search }));
    }, [data, sortBy, reverseSortDirection, search]);

    const setSorting = (field: keyof RoomData) => {
        const reversed = field === sortBy ? !reverseSortDirection : false;
        setReverseSortDirection(reversed);
        setSortBy(field);
    };

    if (loading) return <Text>Ładowanie...</Text>;
    if (error) return <Text color="red">{error}</Text>;

    const rows = sortedData.map((room) => (
        <Table.Tr key={room.id}>
            <Table.Td>{room.name}</Table.Td>
            <Table.Td>{room.capacity}</Table.Td>
            <Table.Td>{room.location}</Table.Td>
        </Table.Tr>
    ));

    return (
        <ScrollArea>
            <TextInput
                placeholder="Wyszukaj"
                mb="md"
                leftSection={<IconSearch size={16} stroke={1.5} />}
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}
            />
            <Table horizontalSpacing="md" verticalSpacing="xs" miw={700} layout="fixed">
                <Table.Tbody>
                    <Table.Tr>
                        <Th
                            sorted={sortBy === 'name'}
                            reversed={reverseSortDirection}
                            onSort={() => setSorting('name')}
                        >
                            Nazwa
                        </Th>
                        <Th
                            sorted={sortBy === 'capacity'}
                            reversed={reverseSortDirection}
                            onSort={() => setSorting('capacity')}
                        >
                            Pojemność
                        </Th>
                        <Th
                            sorted={sortBy === 'location'}
                            reversed={reverseSortDirection}
                            onSort={() => setSorting('location')}
                        >
                            Lokalizacja
                        </Th>
                    </Table.Tr>
                </Table.Tbody>
                <Table.Tbody>
                    {rows.length > 0 ? (
                        rows
                    ) : (
                        <Table.Tr>
                            <Table.Td colSpan={3}>
                                <Text fw={500} ta="center">
                                    Nic nie znaleziono
                                </Text>
                            </Table.Td>
                        </Table.Tr>
                    )}
                </Table.Tbody>
            </Table>
        </ScrollArea>
    );
}
