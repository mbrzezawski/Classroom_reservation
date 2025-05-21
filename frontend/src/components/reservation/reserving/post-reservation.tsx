import type { ReservationFormValues } from "../reservation-form";


export const postReservation = async (data: ReservationFormValues) => {
    console.log(data.hour)
    const [year, month, day] = data.date.split('-').map(Number)
    const startHour = data.hour;
    const [hours, minutes] = startHour.split(":").map(Number);
    const startTime = new Date(year, month - 1, day, hours, minutes);
    const endTime = new Date(year, month-1, day, hours, minutes+90);


    const body = {
      userId: "1234",
      date: data.date,
      startTime: startTime.toTimeString().slice(0,5),
      endTime: endTime.toTimeString().slice(0,5),
      purpose: data.title,
      minCapacity: data.atendees,
      softwareIds: data.software,
      equipmentIds: data.equipment,
    };
    console.log(body);
    const res = await fetch("http://localhost:8080/reservations/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (res.ok) {
        const responseBody = await res.json();
        console.log("Response body:", responseBody);
    } else {
        const errorBody = await res.json();
        console.log("Error:", errorBody.message || errorBody);
    }
  };