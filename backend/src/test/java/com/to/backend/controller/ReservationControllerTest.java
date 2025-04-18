package com.to.backend.controller;

import com.to.backend.dto.CalendarReservationDto;
import com.to.backend.service.ReservationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.BDDMockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ReservationController.class)
@AutoConfigureMockMvc(addFilters = false)
class ReservationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ReservationService service;

    @Test
    void givenParams_whenGetCalendar_thenReturnsDtoList() throws Exception {
        // example DTO
        CalendarReservationDto dto = CalendarReservationDto.builder()
                .reservationId("res-1")
                .roomId("room-1")
                .roomName("Sala A")
                .roomLocation("Budynek X")
                .title("Testowe zajęcia")
                .start(LocalDateTime.of(2025,5,10,10,0))
                .end(LocalDateTime.of(2025,5,10,12,0))
                .minCapacity(5)
                .softwareIds(List.of("softA"))
                .equipmentIds(List.of("equipA"))
                .build();

        // service stub
        given(service.getUserCalendar(
                eq("jakub123"),
                eq(LocalDate.of(2025,5,1)),
                eq(LocalDate.of(2025,5,31))
        )).willReturn(List.of(dto));

        // perform GET with parameters
        mockMvc.perform(get("/reservations/calendar")
                        .param("userId", "jakub123")
                        .param("from", "2025-05-01")
                        .param("to",   "2025-05-31")
                )
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                // sprawdź elementy JSON-a
                .andExpect(jsonPath("$[0].reservationId").value("res-1"))
                .andExpect(jsonPath("$[0].roomName").value("Sala A"))
                .andExpect(jsonPath("$[0].title").value("Testowe zajęcia"))
                .andExpect(jsonPath("$[0].start").value("2025-05-10T10:00:00"))
                .andExpect(jsonPath("$[0].end").value("2025-05-10T12:00:00"));

        // verify that service was called with expected arguments
        then(service).should().getUserCalendar(
                "jakub123",
                LocalDate.of(2025,5,1),
                LocalDate.of(2025,5,31)
        );
    }

    @Test
    void givenOnlyUserId_whenGetCalendar_thenServiceCalledWithNullDates() throws Exception {
        // stub
        given(service.getUserCalendar(eq("u1"), isNull(), isNull()))
                .willReturn(List.of());

        mockMvc.perform(get("/reservations/calendar")
                        .param("userId", "u1")
                )
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));

        // verify call with nulls
        then(service).should().getUserCalendar("u1", null, null);
    }
}
