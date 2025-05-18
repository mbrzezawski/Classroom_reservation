package com.to.backend.service;

import com.to.backend.dto.ReservationRequest;
import com.to.backend.dto.ReservationResponse;
import com.to.backend.exception.NoRoomAvailableException;
import com.to.backend.model.Reservation;
import com.to.backend.model.Room;
import com.to.backend.model.utils.ReservationStatus;
import com.to.backend.repository.ReservationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.*;

@ExtendWith(MockitoExtension.class)
class ReservationServiceUnitTest {

    @Mock  private ReservationRepository reservationRepo;
    @Mock  private RoomService        roomService;
    @InjectMocks private ReservationService service;

    private ReservationRequest req;   // ← pola klasy
    private Room room;

    @BeforeEach
    void setUp() {
        /*  ---------- REQUEST ---------- */
        req = ReservationRequest.builder()       // ← przypisanie DO POLA
                .userId("user-1")
                .date(LocalDate.of(2025, 5, 10))
                .startTime(LocalTime.of(10, 0))
                .endTime(LocalTime.of(12, 0))
                .purpose("Test")
                .minCapacity(5)
                .softwareIds(List.of("softA"))
                .equipmentIds(List.of("equipA"))
                .build();

        /*  ---------- ROOM ---------- */
        room = new Room();
        room.setId("room-1");
        room.setName("Sala 1");
        room.setCapacity(10);
        room.setSoftwareIds(List.of("softA", "softB"));
        room.setEquipmentIds(List.of("equipA", "equipB"));
        room.setLocation("Budynek X");
    }

    @Test
    void whenRoomAvailable_thenReturnsConfirmedResponse() {
        /* rooms spełniające kryteria */
        given(roomService.getAllRooms()).willReturn(List.of(room));

        /* brak kolizji */
        given(reservationRepo.findByRoomIdAndDateAndStartTimeLessThanAndEndTimeGreaterThan(
                eq(room.getId()),
                eq(req.getDate()),
                eq(req.getEndTime()),          // new.start < existing.end
                eq(req.getStartTime())         // new.end   > existing.start
        )).willReturn(Collections.emptyList());

        /* nadaj id zapisywanej rezerwacji */
        given(reservationRepo.save(any(Reservation.class)))
                .willAnswer(inv -> {
                    Reservation saved = inv.getArgument(0);
                    saved.setId("res-123");
                    return saved;
                });

        /* --- wywołanie --- */
        ReservationResponse resp = service.reserve(req);

        /* --- asercje --- */
        assertThat(resp.reservationId()).isEqualTo("res-123");
        assertThat(resp.roomId()).isEqualTo("room-1");
        assertThat(resp.message()).containsIgnoringCase("sala");

        then(reservationRepo).should().save(any(Reservation.class));
    }

    @Test
    void whenNoRoomAvailable_thenThrowException() {
        given(roomService.getAllRooms()).willReturn(List.of(room));

        Reservation overlap = new Reservation();
        overlap.setRoomId(room.getId());
        overlap.setDate(req.getDate());
        overlap.setStartTime(LocalTime.of(11, 0));
        overlap.setEndTime(LocalTime.of(13, 0));
        overlap.setStatus(ReservationStatus.CONFIRMED);

        /* kolizja -> zwróć jeden wpis */
        given(reservationRepo.findByRoomIdAndDateAndStartTimeLessThanAndEndTimeGreaterThan(
                eq(room.getId()),
                eq(req.getDate()),
                eq(req.getEndTime()),
                eq(req.getStartTime())
        )).willReturn(List.of(overlap));

        /* --- oczekujemy wyjątku --- */
        assertThatThrownBy(() -> service.reserve(req))
                .isInstanceOf(NoRoomAvailableException.class)
                .hasMessageContaining("Brak");
    }
}

