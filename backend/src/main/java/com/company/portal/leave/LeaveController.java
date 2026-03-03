package com.company.portal.leave;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public List<LeaveRequest> myLeaves() {
        return leaveService.getMyLeaves();
    }

    // ADMIN
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public List<LeaveRequest> allLeaves() {
        return leaveService.getAllLeaves();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/review/{leaveId}")
    public String review(@PathVariable String leaveId,
                         @RequestParam String decision) {
        return leaveService.reviewLeave(leaveId, decision);
    }
}