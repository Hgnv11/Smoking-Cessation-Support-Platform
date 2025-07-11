package com.smokingcessation.repository;

import com.smokingcessation.model.ProgressMilestone;
import com.smokingcessation.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProgressMilestoneRepository extends JpaRepository<ProgressMilestone, Long> {
    @Query("SELECT COALESCE(SUM(p.rewardPoints), 0) FROM ProgressMilestone p WHERE p.user = :user")
    int sumRewardPointsByUser(@Param("user") User user);
    List<ProgressMilestone> findByUser(User user);
    Optional<ProgressMilestone> findByUserAndMilestoneType(User user, ProgressMilestone.MilestoneType milestoneType);
}