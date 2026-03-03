package com.company.portal.attendance;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;
import java.util.List;

public interface AttendanceRepository
        extends JpaRepository<Attendance, String> {

    Optional<Attendance> findByUserIdAndAttendanceDate(
            String userId, LocalDate date);

    List<Attendance> findByUserId(String userId);

    Page<Attendance> findByUserId(String userId, Pageable pageable);
    
    List<Attendance> findByUserIdAndAttendanceDateBetween(
            String userId,
            LocalDate start,
            LocalDate end);
    
    long countByAttendanceDate(LocalDate date);
}