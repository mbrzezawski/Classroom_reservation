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
import java.util.Optional;

import static org.mockito.BDDMockito.*;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import org.springframework.security.test.context.support.WithMockUser;

@WebMvcTest(ReservationController.class)
@AutoConfigureMockMvc(addFilters = false)
class ReservationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ReservationService service;

    @Test
    @WithMockUser(username = "jakub123", roles = "USER")
    void givenParams_whenGetCalendar_thenReturnsDtoList() throws Exception {
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

        Optional<LocalDate> from = Optional.of(LocalDate.of(2025,5,1));
        Optional<LocalDate> to   = Optional.of(LocalDate.of(2025,5,31));

        given(service.getUserCalendar(
                eq("jakub123"),
                eq(from),
                eq(to)
        )).willReturn(List.of(dto));

        mockMvc.perform(get("/reservations/calendar")
                        .param("userId", "jakub123")
                        .param("from", "2025-05-01")
                        .param("to",   "2025-05-31")
                )
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].reservationId").value("res-1"))
                .andExpect(jsonPath("$[0].roomName").value("Sala A"))
                .andExpect(jsonPath("$[0].title").value("Testowe zajęcia"))
                .andExpect(jsonPath("$[0].start").value("2025-05-10T10:00:00"))
                .andExpect(jsonPath("$[0].end").value("2025-05-10T12:00:00"));

        then(service).should().getUserCalendar(
                "jakub123",
                Optional.of(LocalDate.of(2025,5,1)),
                Optional.of(LocalDate.of(2025,5,31))
        );
    }


    @Test
    @WithMockUser(username = "someUser", roles = "USER")
    void givenOnlyUserId_whenGetCalendar_thenServiceCalledWithEmptyOptionals() throws Exception {
        // stub for empty Optionals
        Optional<LocalDate> empty = Optional.empty();
        given(service.getUserCalendar(eq("u1"), eq(empty), eq(empty)))
                .willReturn(List.of());

        mockMvc.perform(get("/reservations/calendar")
                        .param("userId", "u1")
                )
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));

        // verify call with Optional.empty()
        then(service).should().getUserCalendar("u1", Optional.empty(), Optional.empty());
    }


}
