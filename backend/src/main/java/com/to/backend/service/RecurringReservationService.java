package com.to.backend.service;

import com.to.backend.dto.*;
import com.to.backend.exception.ConflictException;
import com.to.backend.exception.NoRoomAvailableException;
import com.to.backend.exception.NotFoundException;
import com.to.backend.model.RecurringReservation;
import com.to.backend.model.Reservation;
import com.to.backend.model.Room;
import com.to.backend.model.utils.ReservationStatus;
import com.to.backend.repository.RecurringReservationRepository;
import com.to.backend.repository.ReservationRepository;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecurringReservationService {
    private final RecurringReservationRepository recurringRepo;
    private final ReservationRepository reservationRepo;
    private final ReservationService reservationService;
    private final UserService userService;
    private final RoomService roomService;
    private final ZoneId zone = ZoneId.of("Europe/Warsaw");


    public RecurringReservationService(
            RecurringReservationRepository recurringRepo, ReservationRepository reservationRepo,
            @Lazy ReservationService reservationService,
            UserService userService, RoomService roomService
    ) {
        this.recurringRepo = recurringRepo;
        this.reservationRepo = reservationRepo;
        this.reservationService = reservationService;
        this.userService = userService;
        this.roomService = roomService;
    }

    List<LocalDate> generateDates(RecurringReservationRequest pattern) {
        List<LocalDate> dates = new ArrayList<>();
        LocalDate start = pattern.getStartDate();
        LocalDate d = start;

        while (pattern.getEndDate() == null || !d.isAfter(pattern.getEndDate())) {
            boolean take = switch (pattern.getFrequency()) {

                /* co N dni */
                case DAILY -> ChronoUnit.DAYS.between(start, d) % pattern.getInterval() == 0;

                /* co N tygodni, tylko wybrane dni tygodnia */
                case WEEKLY -> {
                    long weeks = ChronoUnit.WEEKS.between(start, d);
                    yield weeks % pattern.getInterval() == 0
                            && pattern.getByDays().contains(d.getDayOfWeek());
                }

                /* co N miesięcy, tego samego dnia miesiąca */
                case MONTHLY -> {
                    long months = ChronoUnit.MONTHS.between(
                            start.withDayOfMonth(1), d.withDayOfMonth(1));

                    yield months % pattern.getInterval() == 0
                            && pattern.getByMonthDays().contains(d.getDayOfMonth());

                }
            };

            if (take) dates.add(d);
            d = d.plusDays(1);      // iterujemy dzień-po-dniu
        }
        return dates;
    }




    @Transactional
    public RecurringReservationResponse createRecurringReservations(RecurringReservationRequest dto) {
        ZoneId zone = ZoneId.of("Europe/Warsaw");

        // 1) Zapisz wzorzec bez roomId
        RecurringReservation pattern = RecurringReservation.builder()
                .userId(dto.getUserId())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .purpose(dto.getPurpose())
                .minCapacity(dto.getMinCapacity())
                .softwareIds(dto.getSoftwareIds())
                .equipmentIds(dto.getEquipmentIds())
                .frequency(dto.getFrequency())
                .interval(dto.getInterval())
                .byDays(dto.getByDays())
                .byMonthDays(dto.getByMonthDays())
                .status(ReservationStatus.CONFIRMED)
                .build();
        pattern = recurringRepo.save(pattern);

        // 2) Wygeneruj daty
        List<LocalDate> dates = generateDates(dto);

        // 3) Kandydaci sal
        List<Room> candidates = roomService.getAllRooms().stream()
                .filter(r -> r.getCapacity() >= dto.getMinCapacity())
                .filter(r -> new HashSet<>(r.getSoftwareIds()).containsAll(dto.getSoftwareIds()))
                .filter(r -> new HashSet<>(r.getEquipmentIds()).containsAll(dto.getEquipmentIds()))
                .sorted(Comparator.comparingInt(Room::getCapacity))
                .toList();

        // 4) Sprawdź dostępność
        for (Room room : candidates) {
            LocalTime sTime = pattern.getStartTime();
            LocalTime eTime = pattern.getEndTime();
            boolean allFree = dates.stream().allMatch(date -> {
                ZonedDateTime start = ZonedDateTime.of(date, sTime, zone);
                ZonedDateTime end   = ZonedDateTime.of(date, eTime, zone);
                return reservationRepo
                        .findByRoomIdAndStartLessThanAndEndGreaterThan(room.getId(), end, start)
                        .isEmpty();
            });

            if (allFree) {
                // 5) Zarezerwuj
                List<ReservationResponse> reservations = new ArrayList<>();
                for (LocalDate date : dates) {
                    ZonedDateTime start = ZonedDateTime.of(date, sTime, zone);
                    ZonedDateTime end   = ZonedDateTime.of(date, eTime, zone);
                    Reservation r = Reservation.builder()
                            .userId(dto.getUserId())
                            .roomId(room.getId())
                            .start(start)
                            .end(end)
                            .purpose(dto.getPurpose())
                            .minCapacity(dto.getMinCapacity())
                            .softwareIds(dto.getSoftwareIds())
                            .equipmentIds(dto.getEquipmentIds())
                            .status(ReservationStatus.CONFIRMED)
                            .build();

                    r.setRecurrenceId(pattern.getId());
                    reservationRepo.save(r);

                    reservations.add(new ReservationResponse(
                            r.getId(),
                            r.getUserId(),
                            r.getRoomId(),
                            r.getRecurrenceId(),
                            r.getStart(),
                            r.getEnd(),
                            r.getPurpose(),
                            r.getMinCapacity(),
                            r.getSoftwareIds(),
                            r.getEquipmentIds(),
                            r.getStatus()
                    ));
                }

                // 6) Uzupełnij roomId i zapisz
                pattern = pattern.toBuilder()
                        .roomId(room.getId())
                        .build();
                recurringRepo.save(pattern);

                // 7) Zwróć
                return RecurringReservationResponse.builder()
                        .recurringReservationId(pattern.getId())
                        .roomId(room.getId())
                        .startDate(pattern.getStartDate())
                        .endDate(pattern.getEndDate())
                        .startTime(pattern.getStartTime())
                        .endTime(pattern.getEndTime())
                        .purpose(pattern.getPurpose())
                        .minCapacity(pattern.getMinCapacity())
                        .softwareIds(pattern.getSoftwareIds())
                        .equipmentIds(pattern.getEquipmentIds())
                        .frequency(pattern.getFrequency())
                        .interval(pattern.getInterval())
                        .byDays(pattern.getByDays())
                        .status(pattern.getStatus())
                        .reservations(reservations)
                        .build();
            }
        }

        throw new NoRoomAvailableException("Brak jednej spójnej sali dla wszystkich terminów");
    }



    /**
     * Aktualizuje wzorzec (np. zmiana czasu, daty) i regeneruje rezerwacje.
     */
    @Transactional
    public RecurringReservationResponse updatePattern(
            String patternId,
            RecurringReservationRequest dto
    ) {
        RecurringReservation existing = recurringRepo.findById(patternId)
                .orElseThrow(() -> new NotFoundException("RecurringReservation", patternId));

        // delete old pattern and reservations
        deletePattern(existing.getId());
        // create new pattern and reservations with createRecurringReservations
        return createRecurringReservations(dto);
    }

    @Transactional
    public void deletePattern(String patternId) {
        if (!recurringRepo.existsById(patternId)) {
            throw new NotFoundException("RecurringReservation", patternId);
        }

        // delete all reservations
        reservationRepo.deleteByRecurrenceId(patternId);
        // delete pattern
        recurringRepo.deleteById(patternId);
    }

    @Transactional(readOnly = true)
    public List<RecurringReservationResponse> listRecurringReservationResponsesForUser(String userId) {
        return recurringRepo.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RecurringReservationResponse getRecurringReservationResponse(String patternId) {
        RecurringReservation pattern = recurringRepo.findById(patternId)
                .orElseThrow(() -> new NotFoundException("RecurringReservation", patternId));
        return mapToResponse(pattern);
    }

    @Transactional(readOnly = true)
    public RecurringReservationResponse mapToResponse(RecurringReservation pattern) {
        List<ReservationResponse> reservations = reservationRepo
                .findByRecurrenceId(pattern.getId()).stream()
                .map(r -> new ReservationResponse(
                        r.getId(),
                        r.getUserId(),
                        r.getRoomId(),
                        r.getRecurrenceId(),
                        r.getStart(),
                        r.getEnd(),
                        r.getPurpose(),
                        r.getMinCapacity(),
                        r.getSoftwareIds(),
                        r.getEquipmentIds(),
                        r.getStatus()
                ))
                .collect(Collectors.toList());

        return RecurringReservationResponse.builder()
                .recurringReservationId(pattern.getId())
                .roomId(pattern.getRoomId())
                .startDate(pattern.getStartDate())
                .endDate(pattern.getEndDate())
                .startTime(pattern.getStartTime())
                .endTime(pattern.getEndTime())
                .purpose(pattern.getPurpose())
                .minCapacity(pattern.getMinCapacity())
                .softwareIds(pattern.getSoftwareIds())
                .equipmentIds(pattern.getEquipmentIds())
                .frequency(pattern.getFrequency())
                .interval(pattern.getInterval())
                .byDays(pattern.getByDays())
                .status(pattern.getStatus())
                .reservations(reservations)
                .build();
    }
}
