package com.to.backend.service;

import com.to.backend.dto.CalendarReservationDto;
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
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.BDDMockito.*;

@ExtendWith(MockitoExtension.class)
class ReservationServiceCalendarTest {

    @Mock
    private ReservationRepository reservationRepo;

    @Mock
    private RoomService roomService;

    @InjectMocks
    private ReservationService service;

    private static final String USER = "instr-1";
    private static final Optional<LocalDate> FROM = Optional.of(LocalDate.of(2025, 5, 1));
    private static final Optional<LocalDate> TO   = Optional.of(LocalDate.of(2025, 5, 31));

    private Reservation r1, r2;
    private Room room1, room2;

    @BeforeEach
    void setUp() {
        r1 = new Reservation();
        r1.setId("res-1");
        r1.setUserId(USER);
        r1.setRoomId("room-1");
        r1.setStart(LocalDateTime.of(LocalDate.of(2025,5,10), LocalTime.of(10, 0)));
        r1.setEnd(LocalDateTime.of(LocalDate.of(2025,5,10), LocalTime.of(12, 0)));
        r1.setPurpose("Zajęcia A");
        r1.setStatus(ReservationStatus.CONFIRMED);

        r2 = new Reservation();
        r2.setId("res-2");
        r2.setUserId(USER);
        r2.setRoomId("room-2");
        r1.setStart(LocalDateTime.of(LocalDate.of(2025,5,15), LocalTime.of(14, 0)));
        r1.setEnd(LocalDateTime.of(LocalDate.of(2025,5,15), LocalTime.of(16, 30)));
        r2.setPurpose("Ćwiczenia B");
        r2.setStatus(ReservationStatus.CONFIRMED);

        room1 = new Room();
        room1.setId("room-1");
        room1.setName("Sala A");
        room1.setLocation("Budynek X");
        room1.setSoftwareIds(List.of("softA"));
        room1.setEquipmentIds(List.of("equipA"));

        room2 = new Room();
        room2.setId("room-2");
        room2.setName("Sala B");
        room2.setLocation("Budynek Y");
        room2.setSoftwareIds(List.of());
        room2.setEquipmentIds(List.of());
    }

    @Test
    void whenCalendarRequested_thenReturnsMappedDtoList() {
        given(reservationRepo
                .findByUserIdAndDateBetweenOrderByDateAscStartTimeAsc(
                        USER,
                        FROM.orElse(LocalDate.MIN),
                        TO.orElse(LocalDate.MAX)
                ))
                .willReturn(List.of(r1, r2));

        given(roomService.getRoomsByIds(List.of("room-1","room-2")))
                .willReturn(List.of(room1, room2));

        List<CalendarReservationDto> events = service.getUserCalendar(USER, FROM, TO);

        assertThat(events).hasSize(2);

        CalendarReservationDto e1 = events.getFirst();
        assertThat(e1.getReservationId()).isEqualTo("res-1");
        assertThat(e1.getRoomName()).isEqualTo("Sala A");
        assertThat(e1.getRoomLocation()).isEqualTo("Budynek X");
        assertThat(e1.getStart()).isEqualTo(LocalDateTime.of(2025,5,10,10,0));
        assertThat(e1.getEnd()).isEqualTo(LocalDateTime.of(2025,5,10,12,0));

        CalendarReservationDto e2 = events.get(1);
        assertThat(e2.getReservationId()).isEqualTo("res-2");
        assertThat(e2.getRoomName()).isEqualTo("Sala B");
    }

    @Test
    void whenNoReservations_thenReturnsEmptyList() {
        given(reservationRepo
                .findByUserIdAndDateBetweenOrderByDateAscStartTimeAsc(
                        USER,
                        FROM.orElse(LocalDate.MIN),
                        TO.orElse(LocalDate.MAX)
                ))
                .willReturn(List.of());

        given(roomService.getRoomsByIds(List.of())).willReturn(List.of());

        List<CalendarReservationDto> events = service.getUserCalendar(USER, FROM, TO);

        assertThat(events).isEmpty();

        then(roomService).should().getRoomsByIds(List.of());
    }
}
