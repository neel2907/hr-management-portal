package com.company.portal.attendance;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @PostMapping("/check-in")
    public String checkIn() {
        return attendanceService.checkIn();
    }

    @PostMapping("/check-out")
    public String checkOut() {
        return attendanceService.checkOut();
    }

    @GetMapping("/my-records")
    public List<Attendance> myRecords() {
        return attendanceService.getMyAttendance();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public List<Attendance> allRecords() {
        return attendanceService.getAllAttendance();
    }
    
    @GetMapping("/monthly-summary")
    public Double monthlySummary(@RequestParam int year,
                                 @RequestParam int month) {
        return attendanceService.getMonthlyWorkingHours(year, month);
    }
}