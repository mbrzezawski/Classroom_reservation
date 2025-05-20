package com.to.backend.service;

import com.to.backend.dto.RecurringReservationRequestDto;
import com.to.backend.dto.RecurringReservationResponseDto;
import com.to.backend.exception.NoRoomAvailableException;
import com.to.backend.model.RecurringReservation;
import com.to.backend.model.Reservation;
import com.to.backend.model.Room;
import com.to.backend.model.utils.Frequency;
import com.to.backend.repository.RecurringReservationRepository;
import com.to.backend.repository.ReservationRepository;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.test.context.support.WithMockUser;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RecurringReservationServiceTest {

    @Mock private RecurringReservationRepository recurringRepo;
    @Mock private ReservationRepository reservationRepo;
    @Mock private ReservationService reservationService;
    @Mock private RoomService roomService;

    @InjectMocks
    private RecurringReservationService service;

    private RecurringReservationRequestDto dto;

    @BeforeEach
    void setUp() {
        dto = new RecurringReservationRequestDto();
        dto.setUserId("user-1");
        dto.setPurpose("Team Sync");
        dto.setMinCapacity(5);
        dto.setSoftwareIds(List.of("sw1"));
        dto.setEquipmentIds(List.of("eq1"));
        dto.setFrequency(Frequency.WEEKLY);
        dto.setInterval(1);
        dto.setByDays(List.of(DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY));
        dto.setStartDate(LocalDate.of(2025, 5, 5));  // Monday
        dto.setEndDate(LocalDate.of(2025, 5, 13));   // Next Wednesday
        dto.setStartTime(LocalTime.of(10, 0));
        dto.setEndTime(LocalTime.of(11, 0));
    }

    private RecurringReservationRequestDto buildTestDto() {
        RecurringReservationRequestDto dto = new RecurringReservationRequestDto();
        dto.setUserId("user-1");
        dto.setPurpose("Team Sync");
        dto.setMinCapacity(5);
        dto.setSoftwareIds(List.of("sw1"));
        dto.setEquipmentIds(List.of("eq1"));
        dto.setFrequency(Frequency.WEEKLY);
        dto.setInterval(1);
        dto.setByDays(List.of(DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY));
        dto.setStartDate(LocalDate.of(2025, 5, 5));
        dto.setEndDate(LocalDate.of(2025, 5, 13));
        dto.setStartTime(LocalTime.of(10, 0));
        dto.setEndTime(LocalTime.of(11, 0));
        return dto;
    }

    @Test
    @WithMockUser(username = "user-1", roles = {"ADMIN"})
    void createRecurringReservations_success() {
        // przygotuj wzorzec do zapisania
        when(recurringRepo.save(any())).thenAnswer(inv -> {
            RecurringReservation pattern = inv.getArgument(0);
            return pattern.toBuilder()
                    .id(new ObjectId().toHexString())
                    .build();
        });

        Room room = new Room();
        room.setId("R1");
        room.setName("Room1");
        room.setCapacity(10);
        room.setSoftwareIds(List.of("sw1"));
        room.setEquipmentIds(List.of("eq1"));
        when(roomService.getAllRooms()).thenReturn(List.of(room));

        // Mock: wszystkie daty są wolne
        when(reservationRepo.findByRoomIdAndStartLessThanAndEndGreaterThan(
                anyString(), any(LocalDate.class), any(), any()))
                .thenReturn(List.of());

        RecurringReservationRequestDto dto = buildTestDto();  // pomocnicza metoda poniżej

        RecurringReservationResponseDto response = service.createRecurringReservations(dto);

        assertNotNull(response.getRecurringReservationId());
        assertEquals("R1", response.getRoomId());
        assertEquals(3, response.getReservations().size()); // 5.05, 7.05, 12.05
    }



    @Test
    @WithMockUser(username = "user-1", roles = {"ADMIN"})
    void createRecurringReservations_success_picksSmallestRoom() {
        when(recurringRepo.save(any())).thenAnswer(inv ->
                ((RecurringReservation) inv.getArgument(0))
                        .toBuilder()
                        .id("patternX")
                        .build()
        );


        Room small = new Room();
        small.setId("R1"); small.setName("Small"); small.setCapacity(6);
        small.setSoftwareIds(List.of("sw1")); small.setEquipmentIds(List.of("eq1"));
        Room large = new Room();
        large.setId("R2"); large.setName("Large"); large.setCapacity(10);
        large.setSoftwareIds(List.of("sw1")); large.setEquipmentIds(List.of("eq1"));

        when(roomService.getAllRooms()).thenReturn(List.of(large, small));
        when(reservationRepo.findByRoomIdAndDateAndStartTimeLessThanAndEndTimeGreaterThan(
                anyString(), any(), any(), any())).thenReturn(List.of());

        RecurringReservationResponseDto result = service.createRecurringReservations(dto);

        assertNotNull(result.getRecurringReservationId());
        assertEquals("R1", result.getRoomId(), "Should pick the smallest sufficient room");
        assertEquals(3, result.getReservations().size());
        verify(reservationRepo, times(3)).save(any());
    }

    @Test
    @WithMockUser(username = "user-1", roles = {"ADMIN"})
    void createRecurringReservations_conflictOnSecondDate_throws() {
        when(recurringRepo.save(any())).thenAnswer(invocation -> {
            RecurringReservation pattern = invocation.getArgument(0);
            return RecurringReservation.builder()
                    .id("patternX")
                    .userId(pattern.getUserId())
                    .purpose(pattern.getPurpose())
                    .roomId(pattern.getRoomId())
                    .minCapacity(pattern.getMinCapacity())
                    .softwareIds(pattern.getSoftwareIds())
                    .equipmentIds(pattern.getEquipmentIds())
                    .frequency(pattern.getFrequency())
                    .interval(pattern.getInterval())
                    .byDays(pattern.getByDays())
                    .startDate(pattern.getStartDate())
                    .endDate(pattern.getEndDate())
                    .startTime(pattern.getStartTime())
                    .endTime(pattern.getEndTime())
                    .build();
        });

        Room room = new Room();
        room.setId("R");
        room.setName("Room");
        room.setCapacity(8);
        room.setSoftwareIds(List.of("sw1"));
        room.setEquipmentIds(List.of("eq1"));
        when(roomService.getAllRooms()).thenReturn(List.of(room));

        // 5 maja - OK (wolne)
        when(reservationRepo.findByRoomIdAndDateAndStartTimeLessThanAndEndTimeGreaterThan(
                eq("R"), eq(LocalDate.of(2025,5,5)), any(), any()))
                .thenReturn(List.of());

        // 7 maja - konflikt (zajęte)
        when(reservationRepo.findByRoomIdAndDateAndStartTimeLessThanAndEndTimeGreaterThan(
                eq("R"), eq(LocalDate.of(2025,5,7)), any(), any()))
                .thenReturn(List.of(new Reservation()));

        // -- test właściwy
        assertThrows(NoRoomAvailableException.class,
                () -> service.createRecurringReservations(dto));

        verify(reservationRepo, never()).save(any());
    }

}
