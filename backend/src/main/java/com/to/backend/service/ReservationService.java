package com.to.backend.service;

import com.to.backend.dto.CalendarReservationDto;
import com.to.backend.dto.ReservationRequest;
import com.to.backend.dto.ReservationResponse;
import com.to.backend.exception.ForbiddenException;
import com.to.backend.exception.NoRoomAvailableException;
import com.to.backend.exception.NotFoundException;
import com.to.backend.model.Reservation;
import com.to.backend.model.Room;
import com.to.backend.model.User;
import com.to.backend.model.utils.ReservationStatus;
import com.to.backend.repository.ReservationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class ReservationService {
    private final ReservationRepository reservationRepo;
    private final RoomService roomService;
    private final UserService userService;

    public ReservationService(ReservationRepository reservationRepo, RoomService roomService, UserService userService) {
        this.reservationRepo = reservationRepo;
        this.roomService = roomService;
        this.userService = userService;
    }

    public Reservation createReservation(Reservation reservation) {
        return reservationRepo.save(reservation);
    }

    public List<Reservation> getAllReservations() {
        return reservationRepo.findAll();
    }

    public Reservation getReservationById(String id) {
        return reservationRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("Reservation", id));
    }

    public void deleteReservation(String id) {
        if (!reservationRepo.existsById(id)) {
            throw new NotFoundException("Reservation", id);
        }
        reservationRepo.deleteById(id);
    }

    // attempts to reserve a room - returns a response indicating the assigned roomId
    // or an exception
    public ReservationResponse reserve(ReservationRequest req) {
        List<Room> candidates = roomService.getAllRooms().stream()
                .filter(r -> r.getCapacity() >= req.getMinCapacity())
                .filter(r -> new HashSet<>(r.getSoftwareIds()).containsAll(req.getSoftwareIds()))
                .filter(r -> new HashSet<>(r.getEquipmentIds()).containsAll(req.getEquipmentIds()))
                .toList();

        for (Room r : candidates) {
            List<Reservation> overlaps = reservationRepo.
                    findByRoomIdAndDateAndStartTimeLessThanAndEndTimeGreaterThan(
                            r.getId(),
                            req.getDate(),
                            req.getEndTime(),
                            req.getStartTime()
                    );
            if (overlaps.isEmpty()) {
                // success -> save reservation
                Reservation entity = new Reservation(
                        req.getUserId(),
                        r.getId(),
                        req.getDate(),
                        req.getStartTime(),
                        req.getEndTime(),
                        req.getPurpose(),
                        req.getMinCapacity(),
                        req.getSoftwareIds(),
                        req.getEquipmentIds(),
                        ReservationStatus.CONFIRMED
                );
                reservationRepo.save(entity);
                return new ReservationResponse(
                        entity.getId(),
                        entity.getRoomId(),
                        "Sala przydzielona: " + r.getName()
                );
            }
        }

        throw new NoRoomAvailableException("Brak dostępnych sal w wybranym terminie");
    }

    @Transactional(readOnly = true)
    public List<CalendarReservationDto> getUserCalendar(
            String userId,
            Optional<LocalDate> fromOpt,
            Optional<LocalDate> toOpt
    ) {
        List<Reservation> reservationList;

        if (fromOpt.isEmpty() && toOpt.isEmpty()) {
            reservationList = reservationRepo.findByUserIdOrderByDateAscStartTimeAsc(userId);
        } else {
            LocalDate realFrom = fromOpt.orElse(LocalDate.MIN);
            LocalDate realTo   = toOpt.orElse(LocalDate.MAX);

            reservationList = reservationRepo
                    .findByUserIdAndDateBetweenOrderByDateAscStartTimeAsc(
                            userId, realFrom, realTo
                    );
        }

        List<String> roomIds = reservationList.stream()
                .map(Reservation::getRoomId)
                .distinct()
                .toList();

        Map<String, Room> roomMap = roomService.getRoomsByIds(roomIds).stream()
                .collect(Collectors.toMap(Room::getId, Function.identity()));

        return reservationList.stream()
                .map(r -> {
                    Room room = roomMap.get(r.getRoomId());
                    return CalendarReservationDto.builder()
                            .reservationId(r.getId())
                            .roomId(room.getId())
                            .roomName(room.getName())
                            .roomLocation(room.getLocation())
                            .title(r.getPurpose())
                            .start(LocalDateTime.of(r.getDate(), r.getStartTime()))
                            .end(  LocalDateTime.of(r.getDate(), r.getEndTime()))
                            .minCapacity(r.getMinCapacity())
                            .softwareIds(r.getSoftwareIds())
                            .equipmentIds(r.getEquipmentIds())
                            .build();
                })
                .toList();
    }


    // cancel reservation if you are the owner
    // TODO update the method so that admin can cancel every reservation
    @Transactional
    public void cancelReservation(String reservationId, String userId) {
        Reservation reservation = reservationRepo.findById(reservationId)
                .orElseThrow(() -> new NotFoundException("Reservation", reservationId));

        if (!reservation.getUserId().equals(userId)) {
            throw new ForbiddenException("Nie masz uprawnień do anulowania tej " +
                    "rezerwacji");
        }

        if (reservation.getStatus() != ReservationStatus.CANCELLED) {
            reservation.setStatus(ReservationStatus.CANCELLED);
            reservationRepo.save(reservation);
        }
    }

    public boolean isOwner(String reservationId, String email) {
        Reservation reservation = reservationRepo.findById(reservationId)
                .orElseThrow(() -> new NotFoundException("Reservation", reservationId));

        User currentUser = userService.getUserByEmail(email);

        return reservation.getUserId().equals(currentUser.getId());
    }

}
