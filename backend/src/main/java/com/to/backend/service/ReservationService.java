package com.to.backend.service;

import com.to.backend.dto.*;
import com.to.backend.exception.ConflictException;
import com.to.backend.exception.ForbiddenException;
import com.to.backend.exception.NoRoomAvailableException;
import com.to.backend.exception.NotFoundException;
import com.to.backend.model.*;
import com.to.backend.model.utils.ProposalStatus;
import com.to.backend.model.utils.ReservationStatus;
import com.to.backend.repository.RecurringReservationRepository;
import com.to.backend.repository.ReservationProposalRepository;
import com.to.backend.repository.ReservationRepository;
import com.to.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class ReservationService {
    private final ReservationRepository reservationRepo;
    private final RoomService roomService;
    private final UserService userService;
    private final ReservationProposalRepository proposalRepo;
    private final UserRepository userRepo;
    private final ZoneId zone = ZoneId.of("Europe/Warsaw");

    public ReservationService(ReservationRepository reservationRepo,
                              RecurringReservationRepository recurringRepo,
                              RoomService roomService, UserService userService,
                              ReservationProposalRepository proposalRepo,
                              UserRepository userRepo) {
        this.reservationRepo = reservationRepo;
        this.roomService = roomService;
        this.userService = userService;
        this.proposalRepo = proposalRepo;
        this.userRepo = userRepo;
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
        // pobierz listę wymaganych zasobów
        List<String> requestedSoftware = Optional.ofNullable(req.getSoftwareIds())
                .orElse(Collections.emptyList());
        List<String> requestedEquipment = Optional.ofNullable(req.getEquipmentIds())
                .orElse(Collections.emptyList());

        // 1) Filtrowanie po minimalnej pojemności
        List<Room> byCapacity = roomService.getAllRooms().stream()
                .filter(r -> r.getCapacity() >= req.getMinCapacity())
                .toList();
        if (byCapacity.isEmpty()) {
            throw new NoRoomAvailableException(
                    "Brak sal o minimalnej pojemności " + req.getMinCapacity());
        }

        // 2) Filtrowanie po wymaganym oprogramowaniu
        List<Room> bySoftware = byCapacity.stream()
                .filter(r -> {
                    List<String> roomSoftware = Optional.ofNullable(r.getSoftwareIds())
                            .orElse(Collections.emptyList());
                    return new HashSet<>(roomSoftware).containsAll(requestedSoftware);
                })
                .toList();
        if (bySoftware.isEmpty()) {
            throw new NoRoomAvailableException(
                    "Brak sal wyposażonych we wszystkie programy: " + requestedSoftware);
        }

        // 3) Filtrowanie po wymaganym sprzęcie (posortowane po pojemności rosnąco)
        List<Room> byEquipment = bySoftware.stream()
                .filter(r -> {
                    List<String> roomEquipment = Optional.ofNullable(r.getEquipmentIds())
                            .orElse(Collections.emptyList());
                    return new HashSet<>(roomEquipment).containsAll(requestedEquipment);
                })
                .sorted(Comparator.comparing(Room::getCapacity))
                .toList();
        if (byEquipment.isEmpty()) {
            throw new NoRoomAvailableException(
                    "Brak sal posiadających cały wymagany sprzęt: " + requestedEquipment);
        }

        // 4) Sprawdź dla kolejnych pokoi, czy nie ma nakładających się rezerwacji
        ZoneId zone = ZoneId.of("Europe/Warsaw");
        ZonedDateTime start = ZonedDateTime.of(req.getDate(), req.getStartTime(), zone);
        ZonedDateTime end   = ZonedDateTime.of(req.getDate(), req.getEndTime(),   zone);

        for (Room r : byEquipment) {
            // znajdź rezerwacje, które nachodzą na przedział [start, end)
            List<Reservation> overlaps = reservationRepo
                    .findByRoomIdAndStartLessThanAndEndGreaterThan(
                            r.getId(),
                            end,
                            start
                    );

            if (overlaps.isEmpty()) {
                // brak konfliktu → można zapisać rezerwację
                Reservation entity = new Reservation(
                        req.getUserId(),
                        r.getId(),
                        start,
                        end,
                        req.getPurpose(),
                        req.getMinCapacity(),
                        requestedSoftware,
                        requestedEquipment,
                        ReservationStatus.CONFIRMED
                );
                reservationRepo.save(entity);

                // zwróć DTO na podstawie nowo utworzonej encji (z entity.getId(), entity.getStart() itd.)
                return new ReservationResponse(
                        entity.getId(),
                        entity.getUserId(),
                        entity.getRoomId(),
                        entity.getRecurrenceId(),
                        entity.getStart(),
                        entity.getEnd(),
                        entity.getPurpose(),
                        entity.getMinCapacity(),
                        entity.getSoftwareIds(),
                        entity.getEquipmentIds(),
                        entity.getStatus()
                );
            }
        }

        // Jeśli nic nie zwróciliśmy w pętli, to nie było sal wolnych w zadanym terminie
        throw new NoRoomAvailableException("Brak dostępnych sal w zadanym terminie");
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

    @Transactional
    public ReservationResponse updateReservation(String existingId, ReservationRequest req) {
        ReservationResponse resp = reserve(req);
        deleteReservation(existingId);

        return resp;
    }

    /**
     * Tworzenie nowej propozycji:
     * - teacherEmail: login nauczyciela (z `UserDetails.getUsername()`)
     * - dto.getProposedSlots(): teraz każdy slot ma swoją datę i godziny
     */
    public ReservationProposal createProposal(ProposalRequestDto dto, String teacherEmail) {
        // 1) Znajdź nauczyciela
        User teacher = userRepo.findByEmail(teacherEmail)
                .orElseThrow(() -> new NotFoundException("User by email", teacherEmail));

        // 2) Znajdź studenta
        User student = userRepo.findByEmail(dto.getStudentEmail())
                .orElseThrow(() -> new NotFoundException("Student by email", dto.getStudentEmail()));

        // 3) Sprawdź liczbę slotów (max 3)
        List<SlotWithDateDto> slots = dto.getProposedSlots();
        if (slots == null || slots.isEmpty() || slots.size() > 3) {
            throw new ConflictException("You must propose between 1 and 3 slots");
        }

        // 4) Zrób konwersję z List<SlotWithDateDto> →  List<ZonedDateTime> (start w strefie) i List<ZonedDateTime> (end)
        List<ZonedDateTime> startTimes = new ArrayList<>();
        List<ZonedDateTime> endTimes   = new ArrayList<>();

        for (SlotWithDateDto slot : slots) {
            if (slot.getDate() == null || slot.getStartTime() == null || slot.getEndTime() == null) {
                throw new ConflictException("Each slot must have date, startTime and endTime");
            }

            ZonedDateTime zStart = ZonedDateTime.of(slot.getDate(), slot.getStartTime(), zone);
            ZonedDateTime zEnd   = ZonedDateTime.of(slot.getDate(), slot.getEndTime(),   zone);

            if (!zStart.isBefore(zEnd)) {
                throw new ConflictException("In each slot: startTime must be before endTime");
            }

            startTimes.add(zStart);
            endTimes.add(zEnd);
        }

        // 5) Jeśli podano originalReservationId (edycja istniejącej rezerwacji),
        // to sprawdzamy, czy faktycznie istnieje taka rezerwacja:
        String origId = dto.getOriginalReservationId();
        System.out.println(origId);
        if (origId != null) {
            // Jeżeli nie znaleziono – rzucamy NotFoundException
            reservationRepo.findById(origId)
                    .orElseThrow(() -> new NotFoundException("Original Reservation", origId));
        }

        // 6) Tworzymy nowy obiekt ReservationProposal i zapisujemy
        ReservationProposal proposal = new ReservationProposal(
                teacher.getId(),
                student.getId(),
                origId,
                startTimes,
                endTimes,
                dto.getComment()
        );
        return proposalRepo.save(proposal);
    }

    /**
     * 2. Student pobiera wszystkie swoje propozycje PENDING:
     */
    public List<ProposalResponseDto> listProposalsForStudent(String studentEmail) {
        // Zaczynamy od znalezienia studentId
        User student = userRepo.findByEmail(studentEmail)
                .orElseThrow(() -> new NotFoundException("User by email", studentEmail));

        List<ReservationProposal> pending = proposalRepo
                .findByStudentIdAndStatus(student.getId(), ProposalStatus.PENDING);

        // mapowanie do DTO
        List<ProposalResponseDto> result = new ArrayList<>();
        for (ReservationProposal p : pending) {
            // Pobieramy dane nauczyciela: mail i id
            User teacher = userRepo.findById(p.getTeacherId())
                    .orElseThrow(() -> new NotFoundException("User by id", p.getTeacherId()));

            result.add(new ProposalResponseDto(
                    p.getId(),
                    teacher.getId(),
                    teacher.getEmail(),
                    student.getId(),
                    student.getEmail(),
                    p.getOriginalReservationId(),
                    p.getProposalsStart(),
                    p.getProposalsEnd(),
                    p.getStatus(),
                    p.getChosenIndex(),
                    p.getComment()
            ));
        }
        return result;
    }

    public ReservationResponse confirmProposal(
            String proposalId,
            ConfirmProposalDto confirmDto,
            String studentEmail
    ) {
        // 1) Znajdź studenta
        User student = userRepo.findByEmail(studentEmail)
                .orElseThrow(() -> new NotFoundException("User by email", studentEmail));

        // 2) Znajdź ReservationProposal
        ReservationProposal proposal = proposalRepo.findById(proposalId)
                .orElseThrow(() -> new NotFoundException("ReservationProposal", proposalId));

        // 3) Walidacje: jeśli nie jest PENDING lub należysz do innego studenta → błąd
        if (!proposal.getStudentId().equals(student.getId())) {
            throw new ConflictException("You’re not allowed to confirm this proposal");
        }
        if (proposal.getStatus() != ProposalStatus.PENDING) {
            throw new ConflictException("Proposal is not PENDING");
        }

        // 4) Pobierz chosenIndex od studenta (0.. lista-1)
        Integer chosen = confirmDto.getChosenIndex();
        if (chosen == null
                || chosen < 0
                || chosen >= proposal.getProposalsStart().size()) {
            throw new ConflictException("Invalid chosenIndex");
        }

        // 5) Oznaczamy w propozycji: chosenIndex i status = CONFIRMED
        proposal.setChosenIndex(chosen);
        proposal.setStatus(ProposalStatus.CONFIRMED);
        proposalRepo.save(proposal);

        // 6) Odczytujemy wybrane ZonedDateTime
        ZonedDateTime selectedStart = proposal.getProposalsStart().get(chosen);
        ZonedDateTime selectedEnd   = proposal.getProposalsEnd().get(chosen);

        // 7) Jeśli mamy edycję istniejącej rezerwacji (originalReservationId != null),
        //    odczytaj encję Reservation, ustaw start/end i status = CONFIRMED, zapisz.
        String origId = proposal.getOriginalReservationId();
        Reservation savedReservation;
        if (origId != null) {
            Reservation existing = reservationRepo.findById(origId)
                    .orElseThrow(() -> new NotFoundException("Original Reservation", origId));

            existing.setStart(selectedStart);
            existing.setEnd(selectedEnd);
            existing.setStatus(ReservationStatus.CONFIRMED);
            savedReservation = reservationRepo.save(existing);
        } else {
            // 8) Jeżeli to nowa rezerwacja → w tym miejscu tworzymy nowy obiekt Reservation korzystając
            //    z wcześniej przygotowanej logiki “reserve(...)” lub bezpośrednio zapisujemy, jeśli
            //    w ProposalRequestDto przekazaliśmy wszystkie niezbędne dane (roomId, purpose, minCapacity itd.).
            //
            //    Poniżej fragment pseudokodu do utworzenia nowej rezerwacji:
            //
            // ReservationRequest req = ReservationRequest.builder()
            //        .userId(student.getId())
            //        .roomId(dtoRoomId)            // musisz mieć to w ProposalRequestDto
            //        .date(selectedStart.toLocalDate())
            //        .startTime(selectedStart.toLocalTime())
            //        .endTime(selectedEnd.toLocalTime())
            //        .purpose(dtoPurpose)
            //        .minCapacity(dtoMinCapacity)
            //        .softwareIds(dtoSoftwareIds)
            //        .equipmentIds(dtoEquipmentIds)
            //        .build();
            //
            // savedReservation = this.reserve(req);
            //
            // Jeśli nie ma pełnych danych w DTO, rzuć wyjątek albo dopisz te pola do DTO.
            throw new UnsupportedOperationException(
                    "Brakuje danych do utworzenia nowej rezerwacji – uzupełnij ProposalRequestDto o roomId/purpose/etc."
            );
        }

        // 3.6) Usuwamy (lub oznaczamy jako odrzucone) inne propozycje:
        //      wszystkie Proposal z tą samą originalReservationId (lub null + teacherId + studentId)
        //      oprócz bieżącej. Żeby nie zostawiać “ścieków” w bazie.
        if (origId != null) {
            List<ReservationProposal> all = proposalRepo.findByOriginalReservationId(origId);
            for (ReservationProposal other : all) {
                if (!other.getId().equals(proposal.getId())) {
                    other.setStatus(ProposalStatus.REJECTED);
                    proposalRepo.save(other);
                }
            }
        } else {
            // usuwamy lub zmieniamy status na REJECTED dla wszystkich, które mają studentId+teacherId i originalReservationId = null
            // (tzn. gdyby nauczyciel wysłał więcej niż jedną propozycję nowej rezerwacji)
            List<ReservationProposal> all = proposalRepo.findAll();
            for (ReservationProposal other : all) {
                if (other.getOriginalReservationId() == null
                        && other.getTeacherId().equals(proposal.getTeacherId())
                        && other.getStudentId().equals(proposal.getStudentId())
                        && !other.getId().equals(proposal.getId())) {
                    other.setStatus(ProposalStatus.REJECTED);
                    proposalRepo.save(other);
                }
            }
        }

        // 10) Zwracamy w odpowiedzi pełne dane nowej / zaktualizowanej rezerwacji:
        return new ReservationResponse(
                savedReservation.getId(),
                savedReservation.getUserId(),
                savedReservation.getRoomId(),
                savedReservation.getRecurrenceId(),
                savedReservation.getStart(),
                savedReservation.getEnd(),
                savedReservation.getPurpose(),
                savedReservation.getMinCapacity(),
                savedReservation.getSoftwareIds(),
                savedReservation.getEquipmentIds(),
                savedReservation.getStatus()
        );
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

}
