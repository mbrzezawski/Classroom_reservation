package com.to.backend.service;

import com.to.backend.model.RecurringReservation;
import com.to.backend.model.utils.Frequency;
import org.junit.jupiter.api.Test;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class RecurringReservationServiceDateGenerationTest {

    private final RecurringReservationService service = new RecurringReservationService(
            null, null, null, null, null
    ); // konstruktor, bo testujemy tylko prywatną metodę

    @Test
    void generateDates_daily_everyDay() {
        RecurringReservation pattern = RecurringReservation.builder()
                .startDate(LocalDate.of(2025, 5, 1))
                .endDate(LocalDate.of(2025, 5, 5))
                .frequency(Frequency.DAILY)
                .interval(1)
                .build();

        List<LocalDate> dates = serviceTest_generateDates(pattern);

        assertEquals(List.of(
                LocalDate.of(2025,5,1),
                LocalDate.of(2025,5,2),
                LocalDate.of(2025,5,3),
                LocalDate.of(2025,5,4),
                LocalDate.of(2025,5,5)
        ), dates);
    }

    @Test
    void generateDates_weekly_everyWeekMondayWednesday() {
        RecurringReservation pattern = RecurringReservation.builder()
                .startDate(LocalDate.of(2025, 5, 5)) // Monday
                .endDate(LocalDate.of(2025, 5, 14))
                .frequency(Frequency.WEEKLY)
                .interval(1)
                .byDays(List.of(DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY))
                .build();

        List<LocalDate> dates = serviceTest_generateDates(pattern);

        assertEquals(List.of(
                LocalDate.of(2025,5,5),
                LocalDate.of(2025,5,7),
                LocalDate.of(2025,5,12),
                LocalDate.of(2025,5,14)
        ), dates);
    }

    @Test
    void generateDates_monthly_everyMonthSameDay() {
        RecurringReservation pattern = RecurringReservation.builder()
                .startDate(LocalDate.of(2025, 1, 15))
                .endDate(LocalDate.of(2025, 4, 20))
                .frequency(Frequency.MONTHLY)
                .interval(1)
                .build();

        List<LocalDate> dates = serviceTest_generateDates(pattern);

        assertEquals(List.of(
                LocalDate.of(2025,1,15),
                LocalDate.of(2025,2,15),
                LocalDate.of(2025,3,15),
                LocalDate.of(2025,4,15)
        ), dates);
    }

    @Test
    void generateDates_daily_every2Days() {
        RecurringReservation pattern = RecurringReservation.builder()
                .startDate(LocalDate.of(2025, 5, 1))
                .endDate(LocalDate.of(2025, 5, 7))
                .frequency(Frequency.DAILY)
                .interval(2)
                .build();

        List<LocalDate> dates = serviceTest_generateDates(pattern);

        assertEquals(List.of(
                LocalDate.of(2025,5,1),
                LocalDate.of(2025,5,3),
                LocalDate.of(2025,5,5),
                LocalDate.of(2025,5,7)
        ), dates);
    }

    // ----------------------
    // Pomocnicze: wywołanie prywatnej metody przez Reflection (bo generateDates() jest private)
    private List<LocalDate> serviceTest_generateDates(RecurringReservation pattern) {
        try {
            var method = RecurringReservationService.class.getDeclaredMethod("generateDates", RecurringReservation.class);
            method.setAccessible(true);
            return (List<LocalDate>) method.invoke(service, pattern);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
