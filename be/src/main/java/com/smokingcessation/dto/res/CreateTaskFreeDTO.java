package com.smokingcessation.dto.res;

import lombok.Data;
import java.time.LocalDate;
import java.util.Date;

@Data
public class CreateTaskFreeDTO {
    private Integer userId;
    private Date taskDay;
}