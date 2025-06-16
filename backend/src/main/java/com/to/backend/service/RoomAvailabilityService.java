package com.to.backend.service;

import com.to.backend.dto.ReservationRequest;
import com.to.backend.exception.ConflictException;
import com.to.backend.model.Room;
import com.to.backend.model.Reservation;
import com.to.backend.repository.ReservationRepository;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

@Service
public class RoomAvailabilityService {
    private final RoomService roomService;
    private final ReservationRepository reservationRepo;
    private final ZoneId zone = ZoneId.of("Europe/Warsaw");

    public RoomAvailabilityService(
            RoomService roomService,
            ReservationRepository reservationRepo
    ) {
        this.roomService = roomService;
        this.reservationRepo = reservationRepo;
    }

    /**
     * Znajduje pierwszą dostępną salę spełniającą kryteria i niekolidującą
     * z istniejącymi rezerwacjami, z opcjonalnym ignorowaniem
     * jednej rezerwacji lub całej serii.
     */
    public Room findAvailableRoom(
            ReservationRequest reservationRequest,
            Optional<String> ignoreReservationId,
            Optional<String> ignoreRecurrenceId
    ) {
        List<Room> allRooms = roomService.getAllRooms();

        // 1) Pojemność
        List<Room> byCapacity = allRooms.stream()
                .filter(r -> r.getCapacity() >= reservationRequest.getMinCapacity())
                .toList();
        if (byCapacity.isEmpty()) {
            throw new ConflictException("Brak sal z wystarczającą pojemnością.");
        }

        // 2) Oprogramowanie
        List<Room> bySoftware = byCapacity.stream()
                .filter(r -> new HashSet<>(r.getSoftwareIds()).containsAll(reservationRequest.getSoftwareIds()))
                .toList();
        if (bySoftware.isEmpty()) {
            throw new ConflictException("Brak sal z wymaganym oprogramowaniem.");
        }

        // 3) Sprzęt
        List<Room> byEquipment = bySoftware.stream()
                .filter(r -> new HashSet<>(r.getEquipmentIds()).containsAll(reservationRequest.getEquipmentIds()))
                .sorted(Comparator.comparing(Room::getCapacity))
                .toList();
        if (byEquipment.isEmpty()) {
            throw new ConflictException("Brak sal z wymaganym sprzętem.");
        }

        // 4) Konflikt czasowy
        ZonedDateTime start = ZonedDateTime.of(
                reservationRequest.getDate(), reservationRequest.getStartTime(), zone
        );
        ZonedDateTime end = ZonedDateTime.of(
                reservationRequest.getDate(), reservationRequest.getEndTime(), zone
        );

        for (Room room : byEquipment) {
            List<Reservation> overlaps = reservationRepo
                    .findByRoomIdAndStartLessThanAndEndGreaterThan(
                            room.getId(), end, start
                    );
            List<Reservation> filtered = overlaps.stream()
                    .filter(res -> ignoreReservationId.map(id -> !res.getId().equals(id)).orElse(true))
                    .filter(res -> ignoreRecurrenceId.map(rec -> !rec.equals(res.getRecurrenceId())).orElse(true))
                    .toList();

            if (filtered.isEmpty()) {
                return room;
            }
        }

        throw new ConflictException("Wszystkie pasujące sale są zajęte w podanym terminie.");
    }


    /**
     * Sprawdza, czy slot jest dostępny.
     */
    public boolean isSlotAvailable(
            ReservationRequest reservationRequest,
            Optional<String> ignoreReservationId,
            Optional<String> ignoreRecurrenceId
    ) {
        try {
            findAvailableRoom(reservationRequest, ignoreReservationId, ignoreRecurrenceId);
            return true;
        } catch (ConflictException e) {
            return false;
        }
    }

}


