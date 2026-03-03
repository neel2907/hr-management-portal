package com.company.portal.leave;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/leave")
public class LeaveController {

    private final LeaveService leaveService;

    public LeaveController(LeaveService leaveService) {
        this.leaveService = leaveService;
    }

    // EMPLOYEE
    @PostMapping("/apply")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public String apply(@RequestBody LeaveRequest request) {
        return leaveService.applyLeave(request);
    }

    @GetMapping("/my-requests")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public Page<LeaveRequest> myLeaves(Pageable pageable) {
        return leaveService.getMyLeaves(pageable);
    }

    // ADMIN
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public Page<LeaveRequest> allLeaves(Pageable pageable) {
        return leaveService.getAllLeaves(pageable);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/review/{leaveId}")
    public String review(@PathVariable String leaveId,
                         @RequestParam String decision) {
        return leaveService.reviewLeave(leaveId, decision);
    }
}