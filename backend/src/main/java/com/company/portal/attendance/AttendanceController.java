package com.company.portal.attendance;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @PostMapping("/check-in")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public String checkIn() {
        return attendanceService.checkIn();
    }

    @PostMapping("/check-out")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public String checkOut() {
        return attendanceService.checkOut();
    }

    @GetMapping("/my-records")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public Page<Attendance> myRecords(Pageable pageable) {
        return attendanceService.getMyAttendance(pageable);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public Page<Attendance> allRecords(Pageable pageable) {
        return attendanceService.getAllAttendance(pageable);
    }
    
    @GetMapping("/monthly-summary")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public Double monthlySummary(@RequestParam int year,
                                 @RequestParam int month) {
        return attendanceService.getMonthlyWorkingHours(year, month);
    }
}