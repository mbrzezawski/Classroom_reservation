package com.to.backend.service;

import com.to.backend.dto.*;
import com.to.backend.exception.ConflictException;
import com.to.backend.exception.ForbiddenException;
import com.to.backend.exception.NoRoomAvailableException;
import com.to.backend.exception.NotFoundException;
import com.to.backend.model.Reservation;
import com.to.backend.model.ReservationProposal;
import com.to.backend.model.Room;
import com.to.backend.model.User;
import com.to.backend.model.utils.ProposalStatus;
import com.to.backend.model.utils.ReservationStatus;
import com.to.backend.repository.ReservationProposalRepository;
import com.to.backend.repository.ReservationRepository;
import com.to.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class ReservationService {
    private final ReservationRepository reservationRepo;
    private final RoomAvailabilityService availabilityService;
    private final UserService userService;
    private final RecurringReservationService recurringReservationService;
    private final RoomAvailabilityService roomAvailabilityService;
    private final ReservationProposalRepository proposalRepo;
    private final UserRepository userRepo;
    private final ZoneId zone = ZoneId.of("Europe/Warsaw");
    private final RoomService roomService;

    public ReservationService(
            ReservationRepository reservationRepo,
            RoomAvailabilityService availabilityService,
            RecurringReservationService recurringReservationService,
            UserService userService, RoomAvailabilityService roomAvailabilityService,
            ReservationProposalRepository proposalRepo,
            UserRepository userRepo, RoomService roomService
    ) {
        this.reservationRepo = reservationRepo;
        this.availabilityService = availabilityService;
        this.recurringReservationService = recurringReservationService;
        this.userService = userService;
        this.roomAvailabilityService = roomAvailabilityService;
        this.proposalRepo = proposalRepo;
        this.userRepo = userRepo;
        this.roomService = roomService;
    }

    public Reservation createReservation(Reservation reservation) {
        return reservationRepo.save(reservation);
    }

    /**
     * Sprawdza dostępność sali i zwraca szczegóły rezerwacji.
     */
    @Transactional
    public ReservationResponse reserve(ReservationRequest req) {
        Room room = availabilityService.findAvailableRoom(
                req,
                Optional.empty(),
                Optional.empty()
        ).orElseThrow(() -> new NoRoomAvailableException(
                "Brak dostępnych sal w zadanym terminie"
        ));

        return createReservationFromRequest(req, room);
    }

    private ReservationResponse createReservationFromRequest(ReservationRequest req,
                                                       Room room) {
        // utwórz encję i zapisz
        Reservation reservation = Reservation.builder()
                .userId(req.getUserId())
                .roomId(room.getId())
                .start(req.getDate().atTime(req.getStartTime()).atZone(zone))
                .end(req.getDate().atTime(req.getEndTime()).atZone(zone))
                .purpose(req.getPurpose())
                .minCapacity(req.getMinCapacity())
                .softwareIds(req.getSoftwareIds())
                .equipmentIds(req.getEquipmentIds())
                .status(ReservationStatus.CONFIRMED)
                .build();
        reservationRepo.save(reservation);

        return new ReservationResponse(
                reservation.getId(),
                reservation.getUserId(),
                reservation.getRoomId(),
                reservation.getRecurrenceId(),
                reservation.getStart(),
                reservation.getEnd(),
                reservation.getPurpose(),
                reservation.getMinCapacity(),
                reservation.getSoftwareIds(),
                reservation.getEquipmentIds(),
                reservation.getStatus()
        );
    }

    // pozostałe metody (get, delete, cancel, updateReservation, zakładki proposal)

    @Transactional(readOnly = true)
    public List<Reservation> getAllReservations() {
        return reservationRepo.findAll();
    }

    @Transactional(readOnly = true)
    public Reservation getReservationById(String id) {
        return reservationRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("Reservation", id));
    }

    @Transactional
    public void deleteReservation(String id) {
        if (!reservationRepo.existsById(id)) {
            throw new NotFoundException("Reservation", id);
        }
        reservationRepo.deleteById(id);
    }

    @Transactional
    public void cancelReservation(String reservationId, String userId) {
        Reservation reservation = reservationRepo.findById(reservationId)
                .orElseThrow(() -> new NotFoundException("Reservation", reservationId));

        if (!reservation.getUserId().equals(userId)) {
            throw new ForbiddenException("Nie masz uprawnień do anulowania tej rezerwacji");
        }
        if (reservation.getStatus() != ReservationStatus.CANCELLED) {
            reservation.setStatus(ReservationStatus.CANCELLED);
            reservationRepo.save(reservation);
        }
    }

    @Transactional
    public ReservationResponse updateReservation(String existingId, ReservationRequest req) {
        Room room = availabilityService.findAvailableRoom(
                req,
                Optional.of(existingId),
                Optional.empty()
        ).orElseThrow(() -> new NoRoomAvailableException(
                "Brak dostępnych sal po aktualizacji terminu"
        ));

        // stwórz nową rezerwację
        ReservationResponse resp = createReservationFromRequest(req, room);
        // skasuj starą
        deleteReservation(existingId);
        return resp;
    }

    // metody dotyczące propozycji pozostają bez zmian i delegują do stworzonego serwisu


    public ReservationProposal createProposal(ProposalRequestDto dto, String teacherEmail) {
        User teacher = userRepo.findByEmail(teacherEmail)
                .orElseThrow(() -> new NotFoundException("User by email", teacherEmail));
        User student = userRepo.findByEmail(dto.getStudentEmail())
                .orElseThrow(() -> new NotFoundException("Student by email", dto.getStudentEmail()));

        if ((dto.getOriginalReservationId() == null) == (dto.getOriginalRecurrenceId() == null)) {
            throw new ConflictException("Dokładnie jedno z originalReservationId lub originalRecurrenceId musi być ustawione");
        }

        List<ReservationRequest> singleReqs = List.of();
        List<RecurringReservationRequest> recurReqs = List.of();

        // Tryb pojedynczy
        if (dto.getReservationRequests() != null && !dto.getReservationRequests().isEmpty()) {
            if (dto.getReservationRequests().size() > 3) {
                throw new ConflictException("Max 3 pojedyncze requesty");
            }

            singleReqs = dto.getReservationRequests().stream()
                    .peek(r -> {
                        if (!r.getEndTime().isAfter(r.getStartTime())) {
                            throw new ConflictException("W każdym request: startTime < endTime");
                        }

                        // sprawdzenie dostępności
                        boolean available = roomAvailabilityService.isSlotAvailable(
                                r, Optional.empty(), Optional.empty());
                        if (!available) {
                            throw new ConflictException("Brak sali dla dnia: " + r.getDate());
                        }
                    })
                    .map(r -> ReservationRequest.builder()
                            .userId(teacher.getId())
                            .date(r.getDate())
                            .startTime(r.getStartTime())
                            .endTime(r.getEndTime())
                            .purpose(r.getPurpose())
                            .minCapacity(r.getMinCapacity())
                            .softwareIds(r.getSoftwareIds())
                            .equipmentIds(r.getEquipmentIds())
                            .build())
                    .toList();
        }

        // Tryb cykliczny
        else if (dto.getRecurringRequests() != null && !dto.getRecurringRequests().isEmpty()) {
            if (dto.getRecurringRequests().size() > 3) {
                throw new ConflictException("Max 3 cykliczne requesty");
            }

            recurReqs = dto.getRecurringRequests().stream()
                    .peek(r -> {
                        if (!r.getEndDate().isAfter(r.getStartDate())) {
                            throw new ConflictException("endDate musi być po startDate");
                        }
                        if (!r.getEndTime().isAfter(r.getStartTime())) {
                            throw new ConflictException("startTime < endTime");
                        }

                        List<LocalDate> dates =
                                recurringReservationService.generateDates(r);
                        for (LocalDate date : dates) {
                            ReservationRequest virtualRequest = ReservationRequest.builder()
                                    .userId(teacher.getId())
                                    .date(date)
                                    .startTime(r.getStartTime())
                                    .endTime(r.getEndTime())
                                    .purpose(r.getPurpose())
                                    .minCapacity(r.getMinCapacity())
                                    .softwareIds(r.getSoftwareIds())
                                    .equipmentIds(r.getEquipmentIds())
                                    .build();

                            boolean available = roomAvailabilityService.isSlotAvailable(
                                    virtualRequest, Optional.empty(), Optional.empty());

                            if (!available) {
                                throw new ConflictException("Brak dostępnej sali dla dnia: " + date);
                            }
                        }
                    })
                    .map(r -> RecurringReservationRequest.builder()
                            .userId(teacher.getId())
                            .startDate(r.getStartDate())
                            .startTime(r.getStartTime())
                            .endTime(r.getEndTime())
                            .purpose(r.getPurpose())
                            .minCapacity(r.getMinCapacity())
                            .softwareIds(r.getSoftwareIds())
                            .equipmentIds(r.getEquipmentIds())
                            .frequency(r.getFrequency())
                            .interval(r.getInterval())
                            .byMonthDays(r.getByMonthDays())
                            .byDays(r.getByDays())
                            .endDate(r.getEndDate())
                            .build())
                    .toList();
        }

        ReservationProposal proposal = ReservationProposal.builder()
                .teacherId(teacher.getId())
                .studentId(student.getId())
                .originalReservationId(dto.getOriginalReservationId())
                .originalRecurrenceId(dto.getOriginalRecurrenceId())
                .reservationRequests(singleReqs)
                .recurringRequests(recurReqs)
                .comment(dto.getComment())
                .status(ProposalStatus.PENDING)
                .build();

        return proposalRepo.save(proposal);
    }

    /**
     * 2. Student pobiera wszystkie swoje propozycje PENDING:
     */
    public List<ProposalResponseDto> listProposalsForStudent(String studentEmail) {
        User student = userRepo.findByEmail(studentEmail)
                .orElseThrow(() -> new NotFoundException("User by email", studentEmail));

        List<ReservationProposal> pending = proposalRepo
                .findByStudentIdAndStatus(student.getId(), ProposalStatus.PENDING);

        return pending.stream()
                .map(p -> {
                    User teacher = userRepo.findById(p.getTeacherId())
                            .orElseThrow(() -> new NotFoundException("User by id", p.getTeacherId()));

                    return ProposalResponseDto.builder()
                            .id(p.getId())
                            .teacherId(teacher.getId())
                            .teacherEmail(teacher.getEmail())
                            .studentId(student.getId())
                            .studentEmail(student.getEmail())
                            .originalReservationId(p.getOriginalReservationId())
                            .originalRecurrenceId(p.getOriginalRecurrenceId())
                            .reservationRequests(p.getReservationRequests())
                            .recurringRequests(p.getRecurringRequests())
                            .status(p.getStatus())
                            .comment(p.getComment())
                            .build();
                })
                .toList();
    }


    @Transactional
    public ReservationResponse confirmProposal(
            String proposalId,
            ConfirmProposalDto confirmDto,
            String studentEmail
    ) {
        User student = userRepo.findByEmail(studentEmail)
                .orElseThrow(() -> new NotFoundException("User by email", studentEmail));

        ReservationProposal proposal = proposalRepo.findById(proposalId)
                .orElseThrow(() -> new NotFoundException("ReservationProposal", proposalId));

        if (!proposal.getStudentId().equals(student.getId())) {
            throw new ConflictException("You’re not allowed to confirm this proposal");
        }
        if (proposal.getStatus() != ProposalStatus.PENDING) {
            throw new ConflictException("Proposal is not PENDING");
        }

        ReservationResponse savedReservation;

        if (proposal.getOriginalReservationId() != null) {
            // Pojedyncza rezerwacja
            int chosen = confirmDto.getChosenIndex();
            if (proposal.getReservationRequests() == null || proposal.getReservationRequests().isEmpty()) {
                throw new ConflictException("Proposal does not contain any reservation requests");
            }
            if (chosen < 0 || chosen >= proposal.getReservationRequests().size()) {
                throw new ConflictException("Invalid chosenIndex");
            }

            ReservationRequest chosenRequest = proposal.getReservationRequests().get(chosen);

            savedReservation = updateReservation(proposal.getOriginalReservationId(), chosenRequest);

        } else if (proposal.getOriginalRecurrenceId() != null) {
            // Rezerwacja cykliczna
            int chosen = confirmDto.getChosenIndex();
            if (proposal.getRecurringRequests() == null || proposal.getRecurringRequests().isEmpty()) {
                throw new ConflictException("Proposal does not contain any recurring requests");
            }
            if (chosen < 0 || chosen >= proposal.getRecurringRequests().size()) {
                throw new ConflictException("Invalid chosenIndex");
            }

            RecurringReservationRequest chosenRequest = proposal.getRecurringRequests().get(chosen);

            RecurringReservationResponse recurringResp =
                    recurringReservationService.updatePattern(proposal.getOriginalRecurrenceId(), chosenRequest);
            String newRecurrenceId = recurringResp.getRecurringReservationId();

            List<Reservation> updatedOccurrences =
                    reservationRepo.findByRecurrenceId(newRecurrenceId);
            if (updatedOccurrences.isEmpty()) {
                throw new NotFoundException("Updated reservations not found", proposal.getOriginalRecurrenceId());
            }
            savedReservation = recurringResp.getReservations().getFirst();

        } else {
            throw new ConflictException("Proposal must reference either a single or recurring reservation");
        }

        proposal.setStatus(ProposalStatus.CONFIRMED);
        proposalRepo.save(proposal);

        List<ReservationProposal> related;
        if (proposal.getOriginalReservationId() != null) {
            related = proposalRepo.findByOriginalReservationId(proposal.getOriginalReservationId());
        } else {
            related = proposalRepo.findByOriginalRecurrenceId(proposal.getOriginalRecurrenceId());
        }

        for (ReservationProposal other : related) {
            if (!other.getId().equals(proposal.getId())) {
                other.setStatus(ProposalStatus.REJECTED);
                proposalRepo.save(other);
            }
        }

        return savedReservation;
    }




    /**
     * 4. (Opcjonalnie) Student odrzuca całą propozycję --> status = REJECTED
     */
    public void rejectProposal(String proposalId, String studentEmail) {
        User student = userRepo.findByEmail(studentEmail)
                .orElseThrow(() -> new NotFoundException("User by email", studentEmail));

        ReservationProposal proposal = proposalRepo.findById(proposalId)
                .orElseThrow(() -> new NotFoundException("ReservationProposal", proposalId));

        if (!proposal.getStudentId().equals(student.getId())) {
            throw new ConflictException("You are not allowed to reject this proposal");
        }
        if (proposal.getStatus() != ProposalStatus.PENDING) {
            throw new ConflictException("Proposal is not in PENDING state");
        }

        proposal.setStatus(ProposalStatus.REJECTED);
        proposalRepo.save(proposal);
    }

    @Transactional(readOnly = true)
    public List<CalendarReservationDto> getUserCalendar(
            String userId,
            Optional<LocalDate> fromOpt,
            Optional<LocalDate> toOpt
    ) {
        ZoneId zone = ZoneId.of("Europe/Warsaw");

        // zakres czasowy od początku dnia do końca dnia w odpowiedniej strefie
        ZonedDateTime realFrom = fromOpt
                .map(d -> d.atStartOfDay(zone))
                .orElse(ZonedDateTime.of(LocalDate.MIN, LocalTime.MIN, zone));

        ZonedDateTime realTo = toOpt
                .map(d -> d.atTime(LocalTime.MAX).atZone(zone))
                .orElse(ZonedDateTime.of(LocalDate.MAX, LocalTime.MAX, zone));

        // pobierz rezerwacje użytkownika
        List<Reservation> reservationList = (fromOpt.isEmpty() && toOpt.isEmpty())
                ? reservationRepo.findByUserIdOrderByStartAsc(userId)
                : reservationRepo.findByUserIdAndStartBetweenOrderByStartAsc(
                userId, realFrom, realTo
        );

        // zbuduj mapę sal
        List<String> roomIds = reservationList.stream()
                .map(Reservation::getRoomId)
                .distinct()
                .toList();
        Map<String, Room> roomMap = roomService.getRoomsByIds(roomIds).stream()
                .collect(Collectors.toMap(Room::getId, Function.identity()));

        // zmapuj na DTO
        return reservationList.stream()
                .map(r -> {
                    Room room = Optional.ofNullable(roomMap.get(r.getRoomId()))
                            .orElseThrow(() -> new NotFoundException("Sala", r.getRoomId()));
                    return CalendarReservationDto.builder()
                            .reservationId(r.getId())
                            .recurrenceId(r.getRecurrenceId())
                            .roomId(room.getId())
                            .roomName(room.getName())
                            .roomLocation(room.getLocation())
                            .title(r.getPurpose())
                            .start(r.getStart())  // r.getStart() musi być ZonedDateTime
                            .end(r.getEnd())
                            .minCapacity(r.getMinCapacity())
                            .softwareIds(r.getSoftwareIds())
                            .equipmentIds(r.getEquipmentIds())
                            .build();
                })
                .toList();
    }

}
