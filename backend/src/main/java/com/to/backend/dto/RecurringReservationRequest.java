package com.to.backend.dto;

import com.to.backend.model.utils.Frequency;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecurringReservationRequest {

    private String userId;

    @NotNull
    private LocalDate startDate;

    @NotNull
    private LocalTime startTime;

    @NotNull
    private LocalTime endTime;

    @NotBlank
    private String purpose;

    @Min(1)
    private int minCapacity;

    private List<String> softwareIds;
    private List<String> equipmentIds;

    @NotNull
    private Frequency frequency;

    @Min(1)
    private int interval;

    private List<Integer> byMonthDays;
    private List<DayOfWeek> byDays;

    @NotNull
    private LocalDate endDate;

    @AssertTrue(message = "Musisz podać przynajmniej jeden dzień miesiąca, gdy frequency=MONTHLY")
    private boolean isByMonthDaysValid() {
        if (this.frequency == Frequency.MONTHLY) {
            return this.byMonthDays != null && !this.byMonthDays.isEmpty();
        }
        return true;
    }
}
