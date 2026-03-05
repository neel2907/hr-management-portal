package com.company.portal.leave;

import com.company.portal.audit.AuditLogService;
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
    private final LeaveBalanceHistoryRepository leaveBalanceHistoryRepository;
    private final AuditLogService auditLogService;

    public LeaveService(LeaveRepository leaveRepository,
                        UserRepository userRepository,
                        LeaveBalanceHistoryRepository leaveBalanceHistoryRepository,
                        AuditLogService auditLogService) {
        this.leaveRepository = leaveRepository;
        this.userRepository = userRepository;
        this.leaveBalanceHistoryRepository = leaveBalanceHistoryRepository;
        this.auditLogService = auditLogService;
    }

    // ✅ Apply Leave (EMPLOYEE)
    @Transactional
    public String applyLeave(LeaveRequest request) {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDate today = LocalDate.now();
        if (request.getStartDate().isBefore(today)) {
            throw new RuntimeException("Start date cannot be in the past");
        }

        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new RuntimeException("End date must be after start date");
        }

        long days = ChronoUnit.DAYS.between(
                request.getStartDate(),
                request.getEndDate()
        ) + 1;

        if (user.getAnnualLeaveBalance() < days) {
            throw new RuntimeException("Insufficient leave balance");
        }

        // prevent overlap with existing PENDING / APPROVED leaves
        List<String> statuses = List.of("PENDING", "APPROVED");
        List<LeaveRequest> existing = leaveRepository.findByUserIdAndStatusIn(user.getId(), statuses);
        boolean hasOverlap = existing.stream().anyMatch(l ->
                !l.getEndDate().isBefore(request.getStartDate()) &&
                !l.getStartDate().isAfter(request.getEndDate())
        );
        if (hasOverlap) {
            throw new RuntimeException("Leave overlaps with an existing request");
        }

        LeaveRequest leave = new LeaveRequest();
        leave.setUser(user);
        leave.setLeaveType(request.getLeaveType());
        leave.setStartDate(request.getStartDate());
        leave.setEndDate(request.getEndDate());
        leave.setTotalDays((int) days);
        leave.setReason(request.getReason());
        leave.setStatus("PENDING");

        leaveRepository.save(leave);

        auditLogService.record("LEAVE_APPLY",
                "User " + user.getId() +
                        " applied for leave request " + leave.getId() +
                        " for " + days + " days");

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

            int changeAmount = -leave.getTotalDays();
            int newBalance = employee.getAnnualLeaveBalance() + changeAmount;
            employee.setAnnualLeaveBalance(newBalance);

            userRepository.save(employee);

            LeaveBalanceHistory history = new LeaveBalanceHistory();
            history.setUser(employee);
            history.setChangeAmount(changeAmount);
            history.setRemainingBalance(newBalance);
            history.setReason("Leave " + decision + " for request " + leave.getId());
            history.setTimestamp(LocalDateTime.now());

            leaveBalanceHistoryRepository.save(history);
        }

        // ✅ Status update (for both APPROVED and REJECTED)
        leave.setStatus(decision);
        leave.setReviewedBy(admin);
        leave.setReviewedAt(LocalDateTime.now());

        leaveRepository.save(leave);

        auditLogService.record("LEAVE_REVIEW",
                "Admin " + admin.getId() +
                        " set leave request " + leave.getId() +
                        " to " + decision);

        return "Leave " + decision;
    }
}