package com.to.backend.service;

import com.to.backend.dto.*;
import com.to.backend.exception.ForbiddenException;
import com.to.backend.exception.NoRoomAvailableException;
import com.to.backend.exception.NotFoundException;
import com.to.backend.model.RecurringReservation;
import com.to.backend.model.Reservation;
import com.to.backend.model.Room;
import com.to.backend.model.User;
import com.to.backend.model.utils.ReservationStatus;
import com.to.backend.repository.RecurringReservationRepository;
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
    private final RecurringReservationRepository recurringRepo;
    private final RoomService roomService;
    private final UserService userService;

    public ReservationService(ReservationRepository reservationRepo, RecurringReservationRepository recurringRepo, RoomService roomService, UserService userService) {
        this.reservationRepo = reservationRepo;
        this.recurringRepo = recurringRepo;
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


//     attempts to reserve a room - returns a response indicating the assigned roomId
//     or an exception
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

//    @Transactional
//    public RecurringReservationResponseDto createRecurringReservations(RecurringReservationRequestDto dto) {
//        // 1) Zapisz wzorzec
//        RecurringReservation pattern = RecurringReservation.builder()
//                .userId(dto.getUserId())
//                .roomId(dto.getRoomId())
//                .startDate(dto.getStartDate())
//                .endDate(dto.getEndDate())
//                .startTime(dto.getStartTime())
//                .endTime(dto.getEndTime())
//                .purpose(dto.getPurpose())
//                .minCapacity(dto.getMinCapacity())
//                .softwareIds(dto.getSoftwareIds())
//                .equipmentIds(dto.getEquipmentIds())
//                .frequency(dto.getFrequency())
//                .interval(dto.getInterval())
//                .byDays(dto.getByDays())
//                .status(ReservationStatus.CONFIRMED)
//                .build();
//        pattern = recurringRepo.save(pattern);
//
//        // 2) Wygeneruj listę dat
//        List<LocalDate> dates = new ArrayList<>();
//        LocalDate d = pattern.getStartDate();
//        while (pattern.getEndDate() == null || !d.isAfter(pattern.getEndDate())) {
//            boolean take = switch (pattern.getFrequency()) {
//                case DAILY   -> true;
//                case WEEKLY  -> pattern.getByDays().contains(d.getDayOfWeek());
//                case MONTHLY -> d.getDayOfMonth() == pattern.getStartDate().getDayOfMonth();
//            };
//            if (take) dates.add(d);
//            d = switch (pattern.getFrequency()) {
//                case DAILY   -> d.plusDays(pattern.getInterval());
//                case WEEKLY  -> d.plusWeeks(pattern.getInterval());
//                case MONTHLY -> d.plusMonths(pattern.getInterval());
//            };
//        }
//
//        // 3) Wylicz kandydatów i posortuj po pojemności rosnąco
//        List<Room> candidates = roomService.getAllRooms().stream()
//                .filter(r -> r.getCapacity() >= dto.getMinCapacity())
//                .filter(r -> new HashSet<>(r.getSoftwareIds()).containsAll(dto.getSoftwareIds()))
//                .filter(r -> new HashSet<>(r.getEquipmentIds()).containsAll(dto.getEquipmentIds()))
//                .sorted(Comparator.comparingInt(Room::getCapacity))
//                .toList();
//
//        // 4) Dla każdej sali sprawdź, czy wszystkie daty są wolne
//        for (Room room : candidates) {
//            RecurringReservation finalPattern = pattern;
//            boolean allFree = dates.stream().allMatch(date ->
//                    reservationRepo
//                            .findByRoomIdAndDateAndStartTimeLessThanAndEndTimeGreaterThan(
//                                    room.getId(), date,
//                                    finalPattern.getEndTime(), finalPattern.getStartTime()
//                            ).isEmpty()
//            );
//            if (allFree) {
//                // 5) Rezerwuj tę salę na wszystkie daty
//                List<ReservationResponse> reservations = new ArrayList<>();
//                for (LocalDate date : dates) {
//                    Reservation r = new Reservation(
//                            dto.getUserId(),
//                            room.getId(),
//                            date,
//                            pattern.getStartTime(),
//                            pattern.getEndTime(),
//                            dto.getPurpose(),
//                            dto.getMinCapacity(),
//                            dto.getSoftwareIds(),
//                            dto.getEquipmentIds(),
//                            ReservationStatus.CONFIRMED
//                    );
//                    r.setRecurrenceId(pattern.getId());
//                    reservationRepo.save(r);
//
//                    reservations.add(new ReservationResponse(
//                            r.getId(),
//                            r.getRoomId(),
//                            "Sala przydzielona: " + room.getName() + " (data: " + date + ")"
//                    ));
//                }
//
//                return RecurringReservationResponseDto.builder()
//                        .recurringReservationId(pattern.getId())
//                        .roomId(room.getId())
//                        .startDate(pattern.getStartDate())
//                        .endDate(pattern.getEndDate())
//                        .startTime(pattern.getStartTime())
//                        .endTime(pattern.getEndTime())
//                        .purpose(pattern.getPurpose())
//                        .minCapacity(pattern.getMinCapacity())
//                        .softwareIds(pattern.getSoftwareIds())
//                        .equipmentIds(pattern.getEquipmentIds())
//                        .frequency(pattern.getFrequency())
//                        .interval(pattern.getInterval())
//                        .byDays(pattern.getByDays())
//                        .status(pattern.getStatus())
//                        .reservations(reservations)
//                        .build();
//            }
//        }
//
//        // 6) Jeżeli żadna sala nie przeszła w całości → błąd
//        throw new NoRoomAvailableException("Brak jednej spójnej sali dla wszystkich terminów");
//    }


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
