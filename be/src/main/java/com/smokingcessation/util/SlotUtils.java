package com.smokingcessation.util;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class SlotUtils {

    public static LocalDateTime getSlotStartTime(int slotNumber, LocalDate date) {
        return switch (slotNumber) {
            case 1 -> date.atTime(7, 0);
            case 2 -> date.atTime(9, 30);
            case 3 -> date.atTime(13, 0);
            case 4 -> date.atTime(15, 30);
            default -> throw new IllegalArgumentException("Invalid slot number");
        };
    }

    public static LocalDateTime getSlotEndTime(int slotNumber, LocalDate date) {
        return switch (slotNumber) {
            case 1 -> date.atTime(9, 30);
            case 2 -> date.atTime(12, 0);
            case 3 -> date.atTime(15, 30);
            case 4 -> date.atTime(17, 0);
            default -> throw new IllegalArgumentException("Invalid slot number");
        };
    }
}
