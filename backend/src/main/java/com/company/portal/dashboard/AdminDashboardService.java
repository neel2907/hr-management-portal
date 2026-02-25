package com.company.portal.dashboard;

import java.time.LocalDate;

import org.springframework.stereotype.Service;

import com.company.portal.attendance.AttendanceRepository;
import com.company.portal.leave.LeaveRepository;
import com.company.portal.user.UserRepository;

@Service
public class AdminDashboardService {

    private final AttendanceRepository attendanceRepository;
    private final LeaveRepository leaveRepository;
    private final UserRepository userRepository;

    public AdminDashboardService(AttendanceRepository attendanceRepository,
                                  LeaveRepository leaveRepository,
                                  UserRepository userRepository) {
        this.attendanceRepository = attendanceRepository;
        this.leaveRepository = leaveRepository;
        this.userRepository = userRepository;
    }

    public DashboardStats getStats() {

        LocalDate today = LocalDate.now();

        DashboardStats stats = new DashboardStats();
        stats.setTotalEmployees(userRepository.count());
        stats.setPresentToday(attendanceRepository.countByAttendanceDate(today));
        stats.setPendingLeaves(leaveRepository.countByStatus("PENDING"));

        return stats;
    }
}
