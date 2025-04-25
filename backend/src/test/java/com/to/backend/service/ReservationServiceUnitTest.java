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

    @Mock
    private ReservationRepository reservationRepo;

    @Mock
    private RoomService roomService;

    @InjectMocks
    private ReservationService service;

    private ReservationRequest req;
    private Room room;

    @BeforeEach
    void setUp() {
        // REQUEST: May 10, 2025, from 10:00 to 12:00
        req = new ReservationRequest();
        req.setUserId("user-1");
        req.setDate(LocalDate.of(2025, 5, 10));
        req.setStartTime(LocalTime.of(10, 0));
        req.setEndTime(LocalTime.of(12, 0));
        req.setPurpose("Test");
        req.setMinCapacity(5);
        req.setSoftwareIds(List.of("softA"));
        req.setEquipmentIds(List.of("equipA"));

        // CANDIDATE ROOM: capacity 10, has softwareA and equipmentA
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
        // GIVEN
        given(roomService.getAllRooms()).willReturn(List.of(room));
        // no overlap
        given(reservationRepo.findByRoomIdAndDateAndStartTimeLessThanAndEndTimeGreaterThan(
                eq("room-1"),
                eq(req.getDate()),
                eq(req.getEndTime()),    // existing.start < 12:00
                eq(req.getStartTime())   // existing.end   > 10:00
        )).willReturn(Collections.emptyList());

        willAnswer(invocation -> {
            Reservation toSave = invocation.getArgument(0);
            toSave.setId("res-123");
            return toSave;
        }).given(reservationRepo).save(any(Reservation.class));

        // WHEN
        ReservationResponse resp = service.reserve(req);

        // THEN
        assertThat(resp.reservationId()).isEqualTo("res-123");
        assertThat(resp.roomId()).isEqualTo("room-1");
        assertThat(resp.message()).contains("Sala przydzielona");

        then(reservationRepo).should().save(any(Reservation.class));
    }

    @Test
    void whenNoRoomAvailable_thenThrowException() {
        // GIVEN
        given(roomService.getAllRooms()).willReturn(List.of(room));
        // overlap due to another reservation from 11:00 to 13:00
        Reservation overlapping = new Reservation();
        overlapping.setRoomId("room-1");
        overlapping.setDate(req.getDate());
        overlapping.setStartTime(LocalTime.of(11, 0));
        overlapping.setEndTime(LocalTime.of(13, 0));
        overlapping.setStatus(ReservationStatus.CONFIRMED);
        given(reservationRepo.findByRoomIdAndDateAndStartTimeLessThanAndEndTimeGreaterThan(
                eq("room-1"),
                eq(req.getDate()),
                eq(req.getEndTime()),
                eq(req.getStartTime())
        )).willReturn(List.of(overlapping));

        // expect NoRoomAvailableException
        assertThatThrownBy(() -> service.reserve(req))
                .isInstanceOf(NoRoomAvailableException.class)
                .hasMessageContaining("Brak dostępnych sal");
    }
}
