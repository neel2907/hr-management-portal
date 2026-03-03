package com.company.portal.leave;

import com.company.portal.user.Role;
import com.company.portal.user.User;
import com.company.portal.user.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class LeaveService {

    private final LeaveRepository leaveRepository;
    private final UserRepository userRepository;

    public LeaveService(LeaveRepository leaveRepository,
                        UserRepository userRepository) {
        this.leaveRepository = leaveRepository;
        this.userRepository = userRepository;
    }

    // ✅ Apply Leave (EMPLOYEE)
    public String applyLeave(LeaveRequest request) {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new RuntimeException("Invalid date range");
        }

        long days = ChronoUnit.DAYS.between(
                request.getStartDate(),
                request.getEndDate()
        ) + 1;

        LeaveRequest leave = new LeaveRequest();
        leave.setUser(user);
        leave.setLeaveType(request.getLeaveType());
        leave.setStartDate(request.getStartDate());
        leave.setEndDate(request.getEndDate());
        leave.setTotalDays((int) days);
        leave.setReason(request.getReason());
        leave.setStatus("PENDING");

        leaveRepository.save(leave);

        return "Leave request submitted successfully";
    }

    // ✅ View My Leaves
    public Page<LeaveRequest> getMyLeaves(Pageable pageable) {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return leaveRepository.findByUserId(user.getId(), pageable);
    }

    // ✅ ADMIN — View All
    public Page<LeaveRequest> getAllLeaves(Pageable pageable) {
        return leaveRepository.findAll(pageable);
    }

    // ✅ ADMIN — Approve / Reject
    @Transactional
    public String reviewLeave(String leaveId, String decision) {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User admin = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (admin.getRole() != Role.ADMIN) {
            throw new RuntimeException("Only ADMIN can review leave");
        }

        LeaveRequest leave = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new RuntimeException("Leave not found"));

        if (!leave.getStatus().equals("PENDING")) {
            throw new RuntimeException("Leave already reviewed");
        }

        if (!decision.equals("APPROVED") && !decision.equals("REJECTED")) {
            throw new RuntimeException("Invalid decision");
        }

        // ✅ Deduct balance ONLY if APPROVED
        if (decision.equals("APPROVED")) {

            User employee = leave.getUser();

            if (employee.getAnnualLeaveBalance() < leave.getTotalDays()) {
                throw new RuntimeException("Insufficient leave balance");
            }

            employee.setAnnualLeaveBalance(
                    employee.getAnnualLeaveBalance() - leave.getTotalDays()
            );

            userRepository.save(employee);
        }

        // ✅ Status update (for both APPROVED and REJECTED)
        leave.setStatus(decision);
        leave.setReviewedBy(admin);
        leave.setReviewedAt(LocalDateTime.now());

        leaveRepository.save(leave);

        return "Leave " + decision;
    }
}