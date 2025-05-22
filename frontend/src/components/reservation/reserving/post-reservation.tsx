import type { ReservationFormValues } from "../reservation-form";


export const postReservation = async (data: ReservationFormValues) => {
    try {
        const [hours, minutes] = data.hour.split(":").map(Number);
        const startTime = `${data.hour}:00`;
        const endTime = `${String(hours + 1).padStart(2, '0')}:${String((minutes + 30) % 60).padStart(2, '0')}:00`;

        const body = {
            userId: "1234", // TODO: Zamień na dynamiczne ID
            date: data.date,
            startTime,
            endTime,
            purpose: data.title,
            minCapacity: data.atendees,
            softwareIds: data.software,
            equipmentIds: data.equipment,
        };

        const res = await fetch("http://localhost:8080/reservations/book", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Failed to make reservation");
        }

        return await res.json();
    } catch (error) {
        console.error("Reservation error:", error);
        throw error;
    }
};