package com.smokingcessation.repository;

import com.smokingcessation.model.SmokingEvent;
import com.smokingcessation.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Repository
public interface SmokingEventRepository extends JpaRepository<SmokingEvent, Integer> {

    @Query("SELECT COALESCE(SUM(e.cigarettesSmoked), 0) " +
            "FROM SmokingEvent e WHERE e.user.userId = :userId AND e.eventTime >= :since")
    int sumCigarettesSmokedSince(@Param("userId") int userId, @Param("since") LocalDateTime since);

    @Query("SELECT COALESCE(SUM(e.cigarettesSmoked), 0) " +
            "FROM SmokingEvent e " +
            "WHERE e.user.id = :userId AND e.eventTime BETWEEN :from AND :to")
    int sumCigarettesSmokedBetween(
            @Param("userId") int userId,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to
    );
    List<SmokingEvent> findByUserAndEventTimeBetween(User user, LocalDateTime from, LocalDateTime to);
    List<SmokingEvent> findByUser(User user);
    Optional<SmokingEvent> findTopByUserOrderByEventTimeDesc(User user);
    List<SmokingEvent> findByUser_UserIdAndEventTimeAfter(Integer userId, LocalDateTime time);
    void deleteAllByUserAndEventTimeBetween(User user, LocalDateTime from, LocalDateTime to);
    boolean existsByUserAndCravingLevelGreaterThan(User user, int level);
}
