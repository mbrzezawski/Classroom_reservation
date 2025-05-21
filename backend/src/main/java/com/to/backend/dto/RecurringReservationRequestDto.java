package com.to.backend.dto;

import com.to.backend.model.utils.Frequency;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class RecurringReservationRequestDto {
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

    public RecurringReservationRequestDto() {}


    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public String getPurpose() {
        return purpose;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }

    public int getMinCapacity() {
        return minCapacity;
    }

    public void setMinCapacity(int minCapacity) {
        this.minCapacity = minCapacity;
    }

    public List<String> getSoftwareIds() {
        return softwareIds;
    }

    public void setSoftwareIds(List<String> softwareIds) {
        this.softwareIds = softwareIds;
    }

    public List<String> getEquipmentIds() {
        return equipmentIds;
    }

    public void setEquipmentIds(List<String> equipmentIds) {
        this.equipmentIds = equipmentIds;
    }

    public Frequency getFrequency() {
        return frequency;
    }

    public void setFrequency(Frequency frequency) {
        this.frequency = frequency;
    }

    public int getInterval() {
        return interval;
    }

    public void setInterval(int interval) {
        this.interval = interval;
    }

    public List<Integer> getByMonthDays() {
        return byMonthDays;
    }
    public void setByMonthDays(List<Integer> byMonthDays) {
        this.byMonthDays = byMonthDays;
    }

    @AssertTrue(message = "Musisz podać przynajmniej jeden dzień miesiąca, gdy frequency=MONTHLY")
    private boolean isByMonthDaysValid() {
        if (this.frequency == Frequency.MONTHLY) {
            return this.byMonthDays != null && !this.byMonthDays.isEmpty();
        }
        return true;
    }

    public List<DayOfWeek> getByDays() {
        return byDays;
    }

    public void setByDays(List<DayOfWeek> byDays) {
        this.byDays = byDays;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }


}
