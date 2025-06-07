package com.smokingcessation.repository;

import com.smokingcessation.model.SmokingEvent;
import com.smokingcessation.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SmokingEventRepository extends JpaRepository<SmokingEvent, Integer> {

    @Query("SELECT COALESCE(SUM(e.cigarettesSmoked), 0) " +
            "FROM SmokingEvent e WHERE e.user.id = :userId AND e.eventTime >= :since")
    int sumCigarettesSmokedSince(@Param("userId") int userId, @Param("since") LocalDateTime since);

    List<SmokingEvent> findByUser(User user);
    Optional<SmokingEvent> findTopByUserOrderByEventTimeDesc(User user);
}
