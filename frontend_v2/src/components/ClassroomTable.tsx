import React, { useEffect, useState } from 'react';
import {
    IconChevronDown,
    IconChevronUp,
    IconSearch,
    IconSelector,
} from '@tabler/icons-react';
import {
    Center,
    Group,
    ScrollArea,
    Table,
    Text,
    TextInput,
    UnstyledButton,
    Stack,
} from '@mantine/core';
import '@mantine/core/styles.css';
import classes from './css/Classroom.module.css';

interface RoomData {
    id: string;
    name: string;
    capacity: number;
    location: string;
    equipmentIds: string[];
    equipmentNames: string[];
    softwareIds: string[];
    softwareNames: string[];
}

interface Equipment {
    id: string;
    name: string;
}

interface Software {
    id: string;
    name: string;
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
    const q = search.toLowerCase().trim();
    return data.filter(
        (item) =>
            item.name.toLowerCase().includes(q) ||
            item.location.toLowerCase().includes(q) ||
            item.capacity.toString().includes(q) ||
            item.equipmentNames.join(', ').toLowerCase().includes(q) ||
            item.softwareNames.join(', ').toLowerCase().includes(q)
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
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        if (typeof aVal === 'number' && typeof bVal === 'number') {
            return reversed ? bVal - aVal : aVal - bVal;
        }
        return reversed
            ? String(bVal).localeCompare(String(aVal))
            : String(aVal).localeCompare(String(bVal));
    });
}

export function ClassroomTable() {
    const [data, setData] = useState<RoomData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState<keyof RoomData | null>(null);
    const [reverseSortDirection, setReverseSortDirection] = useState(false);
    const [sortedData, setSortedData] = useState<RoomData[]>([]);
    const [equipmentMap, setEquipmentMap] = useState<Record<string, string>>({});
    const [softwareMap, setSoftwareMap] = useState<Record<string, string>>({});

    useEffect(() => {
        async function fetchData() {
            try {
                // fetch equipment & software lists
                const [eqRes, swRes] = await Promise.all([
                    fetch('http://localhost:8080/equipment'),
                    fetch('http://localhost:8080/software'),
                ]);
                const eqList: Equipment[] = await eqRes.json();
                const swList: Software[] = await swRes.json();
                const eqMap: Record<string, string> = {};
                const swMap: Record<string, string> = {};
                eqList.forEach((e) => (eqMap[e.id] = e.name));
                swList.forEach((s) => (swMap[s.id] = s.name));
                setEquipmentMap(eqMap);
                setSoftwareMap(swMap);

                // fetch rooms
                const roomsRes = await fetch('http://localhost:8080/rooms');
                const rooms: any[] = await roomsRes.json();
                const enriched: RoomData[] = rooms.map((r) => ({
                    id: r.id,
                    name: r.name,
                    capacity: r.capacity,
                    location: r.location,
                    equipmentIds: r.equipmentIds,
                    equipmentNames: r.equipmentIds.map((id: string) => eqMap[id] || id),
                    softwareIds: r.softwareIds,
                    softwareNames: r.softwareIds.map((id: string) => swMap[id] || id),
                }));
                setData(enriched);
                setSortedData(enriched);
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
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
            <Table.Td>
                {room.equipmentNames.map((eq) => (
                    <span key={eq} className={classes.equipmentCell}>{eq}</span>
                ))}
            </Table.Td>
            <Table.Td>
                {room.softwareNames.map((sw) => (
                    <span key={sw} className={classes.softwareCell}>{sw}</span>
                ))}
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <ScrollArea>
            <Stack spacing="md">
                <TextInput
                    className={classes.searchBar}
                    placeholder="Wyszukaj sale"
                    mb="md"
                    leftSection={<IconSearch size={16} stroke={1.5} />}
                    value={search}
                    onChange={(e) => setSearch(e.currentTarget.value)}
                />

                <Table horizontalSpacing="md" verticalSpacing="xs" miw={900}>
                    <Table.Thead>
                        <Table.Tr>
                            <Th sorted={sortBy === 'name'} reversed={reverseSortDirection} onSort={() => setSorting('name')}>Nazwa</Th>
                            <Th sorted={sortBy === 'capacity'} reversed={reverseSortDirection} onSort={() => setSorting('capacity')}>Pojemność</Th>
                            <Th sorted={sortBy === 'location'} reversed={reverseSortDirection} onSort={() => setSorting('location')}>Lokalizacja</Th>
                            <Th sorted={sortBy === 'equipmentNames'} reversed={reverseSortDirection} onSort={() => setSorting('equipmentNames')}>Wyposażenie</Th>
                            <Th sorted={sortBy === 'softwareNames'} reversed={reverseSortDirection} onSort={() => setSorting('softwareNames')}>Oprogramowanie</Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {rows.length > 0 ? rows : (
                            <Table.Tr>
                                <Table.Td colSpan={5}>
                                    <Text fw={500} ta="center">Nic nie znaleziono</Text>
                                </Table.Td>
                            </Table.Tr>
                        )}
                    </Table.Tbody>
                </Table>
            </Stack>
        </ScrollArea>
    );
}
