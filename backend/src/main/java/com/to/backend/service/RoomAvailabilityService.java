package com.to.backend.service;

import com.to.backend.dto.ReservationRequest;
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
    public Optional<Room> findAvailableRoom(
            ReservationRequest reservationRequest,
            Optional<String> ignoreReservationId,
            Optional<String> ignoreRecurrenceId
    ) {
        // 1) Filtrowanie po minimalnej pojemności
        List<Room> byCapacity = roomService.getAllRooms().stream()
                .filter(r -> r.getCapacity() >= reservationRequest.getMinCapacity())
                .toList();

        // 2) Filtrowanie po wymaganym oprogramowaniu
        List<Room> bySoftware = byCapacity.stream()
                .filter(r -> new HashSet<>(r.getSoftwareIds()).containsAll(reservationRequest.getSoftwareIds()))
                .toList();

        // 3) Filtrowanie po wymaganym sprzęcie, sortowanie po pojemności
        List<Room> byEquipment = bySoftware.stream()
                .filter(r -> new HashSet<>(r.getEquipmentIds()).containsAll(reservationRequest.getEquipmentIds()))
                .sorted(Comparator.comparing(Room::getCapacity))
                .toList();

        // 4) Sprawdzenie konfliktów czasowych
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
            // Usuń rezerwacje ignorowane
            List<Reservation> filtered = overlaps.stream()
                    .filter(res -> ignoreReservationId
                            .map(id -> !res.getId().equals(id))
                            .orElse(true)
                    )
                    .filter(res -> ignoreRecurrenceId
                            .map(rec -> !rec.equals(res.getRecurrenceId()))
                            .orElse(true)
                    )
                    .toList();

            if (filtered.isEmpty()) {
                return Optional.of(room);
            }
        }

        return Optional.empty();
    }

    /**
     * Sprawdza, czy slot jest dostępny.
     */
    public boolean isSlotAvailable(
            ReservationRequest reservationRequest,
            Optional<String> ignoreReservationId,
            Optional<String> ignoreRecurrenceId
    ) {
        return findAvailableRoom(reservationRequest, ignoreReservationId, ignoreRecurrenceId).isPresent();
    }
}


