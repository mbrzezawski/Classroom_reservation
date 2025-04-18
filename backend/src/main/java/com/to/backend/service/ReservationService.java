package com.to.backend.service;

import com.to.backend.dto.ReservationRequest;
import com.to.backend.dto.ReservationResponse;
import com.to.backend.exception.NoRoomAvailableException;
import com.to.backend.exception.NotFoundException;
import com.to.backend.model.Reservation;
import com.to.backend.model.Room;
import com.to.backend.model.utils.ReservationStatus;
import com.to.backend.repository.ReservationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;

@Service
public class ReservationService {
    private final ReservationRepository reservationRepo;
    private final RoomService roomService;

    public ReservationService(ReservationRepository reservationRepo, RoomService roomService) {
        this.reservationRepo = reservationRepo;
        this.roomService = roomService;
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
}
