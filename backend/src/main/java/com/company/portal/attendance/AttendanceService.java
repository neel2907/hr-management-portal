package com.company.portal.attendance;

import com.company.portal.user.User;
import com.company.portal.user.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final UserRepository userRepository;

    public AttendanceService(AttendanceRepository attendanceRepository,
                             UserRepository userRepository) {
        this.attendanceRepository = attendanceRepository;
        this.userRepository = userRepository;
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

        return "Checked in successfully";
    }

    // ✅ CHECK-OUT
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

        return "Checked out successfully";
    }

    // ✅ View My Attendance
    public List<Attendance> getMyAttendance() {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return attendanceRepository.findByUserId(user.getId());
    }

    // ✅ ADMIN — View All
    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
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