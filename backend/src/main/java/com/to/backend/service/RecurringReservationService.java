package com.to.backend.service;

import com.to.backend.dto.RecurringReservationRequestDto;
import com.to.backend.dto.RecurringReservationResponseDto;
import com.to.backend.dto.ReservationResponse;
import com.to.backend.exception.NoRoomAvailableException;
import com.to.backend.exception.NotFoundException;
import com.to.backend.model.RecurringReservation;
import com.to.backend.model.Reservation;
import com.to.backend.model.Room;
import com.to.backend.model.utils.ReservationStatus;
import com.to.backend.repository.RecurringReservationRepository;
import com.to.backend.repository.ReservationRepository;
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


    public RecurringReservationService(
            RecurringReservationRepository recurringRepo, ReservationRepository reservationRepo,
            ReservationService reservationService,
            UserService userService, RoomService roomService
    ) {
        this.recurringRepo = recurringRepo;
        this.reservationRepo = reservationRepo;
        this.reservationService = reservationService;
        this.userService = userService;
        this.roomService = roomService;
    }

    private List<LocalDate> generateDates(RecurringReservation pattern) {
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
    public RecurringReservationResponseDto createRecurringReservations(RecurringReservationRequestDto dto) {
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
        List<LocalDate> dates = generateDates(pattern);

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
                    Reservation r = new Reservation(
                            dto.getUserId(),
                            room.getId(),
                            start,
                            end,
                            dto.getPurpose(),
                            dto.getMinCapacity(),
                            dto.getSoftwareIds(),
                            dto.getEquipmentIds(),
                            ReservationStatus.CONFIRMED
                    );
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
                return RecurringReservationResponseDto.builder()
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
    public RecurringReservationResponseDto updatePattern(
            String patternId,
            RecurringReservationRequestDto dto
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
        reservationRepo.deleteReservationsByRecurringReservationId(patternId);
        // delete pattern
        recurringRepo.deleteById(patternId);
    }

    @Transactional(readOnly = true)
    public List<RecurringReservation> getRecurringReservationsForUser(String userId) {
        return recurringRepo.findByUserId(userId);
    }

    @Transactional(readOnly = true)
    public RecurringReservation getRecurringReservation(String recurringReservationId) {
        return recurringRepo.findById(recurringReservationId)
                .orElseThrow(() -> new NotFoundException("RecurringReservation", recurringReservationId));
    }





}
