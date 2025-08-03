package com.smokingcessation.repository;

import com.smokingcessation.model.TaskSupportMeasure;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskSupportMeasureRepository extends JpaRepository<TaskSupportMeasure, Long> {
    List<TaskSupportMeasure> findByPlanTaskFree_TaskId(Integer taskId);

}