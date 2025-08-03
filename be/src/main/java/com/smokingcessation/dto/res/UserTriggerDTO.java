package com.smokingcessation.dto.res;

import com.smokingcessation.model.TriggerCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserTriggerDTO {
    private Integer userId;
    private List<TriggerCategory> triggerCategories;
}