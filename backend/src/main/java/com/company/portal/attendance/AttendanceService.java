package com.company.portal.attendance;

import com.company.portal.audit.AuditLogService;
import com.company.portal.user.User;
import com.company.portal.user.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    public AttendanceService(AttendanceRepository attendanceRepository,
                             UserRepository userRepository,
                             AuditLogService auditLogService) {
        this.attendanceRepository = attendanceRepository;
        this.userRepository = userRepository;
        this.auditLogService = auditLogService;
    }

    // ✅ CHECK-IN
    public String checkIn() {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDate today = LocalDate.now();

        if (attendanceRepository
                .findByUserIdAndAttendanceDate(user.getId(), today)
                .isPresent()) {

            throw new RuntimeException("Already checked in today");
        }

        Attendance attendance = new Attendance();
        attendance.setUser(user);
        attendance.setAttendanceDate(today);
        attendance.setCheckIn(LocalDateTime.now());
        attendance.setStatus("PRESENT");

        attendanceRepository.save(attendance);

        auditLogService.record("ATTENDANCE_CHECK_IN",
                "User " + user.getId() + " checked in for " + today);

        return "Checked in successfully";
    }

    // ✅ CHECK-OUT
    @Transactional
    public String checkOut() {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDate today = LocalDate.now();

        Attendance attendance = attendanceRepository
                .findByUserIdAndAttendanceDate(user.getId(), today)
                .orElseThrow(() ->
                        new RuntimeException("You have not checked in today"));

        if (attendance.getCheckOut() != null) {
            throw new RuntimeException("Already checked out today");
        }

        LocalDateTime checkOutTime = LocalDateTime.now();
        attendance.setCheckOut(checkOutTime);

        // Calculate total working hours
        Duration duration = Duration.between(
                attendance.getCheckIn(),
                checkOutTime
        );

        double hours = duration.toMinutes() / 60.0;
        attendance.setTotalWorkingHours(hours);

        attendanceRepository.save(attendance);

        auditLogService.record("ATTENDANCE_CHECK_OUT",
                "User " + user.getId() + " checked out for " + today +
                        " with hours=" + hours);

        return "Checked out successfully";
    }

    // ✅ View My Attendance
    public Page<Attendance> getMyAttendance(Pageable pageable) {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return attendanceRepository.findByUserId(user.getId(), pageable);
    }

    // ✅ ADMIN — View All
    public Page<Attendance> getAllAttendance(Pageable pageable) {
        return attendanceRepository.findAll(pageable);
    }
    
    public Double getMonthlyWorkingHours(int year, int month) {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

        List<Attendance> records =
                attendanceRepository.findByUserIdAndAttendanceDateBetween(
                        user.getId(), start, end);

        return records.stream()
                .filter(a -> a.getTotalWorkingHours() != null)
                .mapToDouble(Attendance::getTotalWorkingHours)
                .sum();
    }
}