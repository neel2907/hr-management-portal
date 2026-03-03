package com.company.portal.performance;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/performance")
public class PerformanceReviewController {

    private final PerformanceReviewService performanceReviewService;

    public PerformanceReviewController(PerformanceReviewService performanceReviewService) {
        this.performanceReviewService = performanceReviewService;
    }

    // ADMIN
    @PostMapping("/reviews")
    @PreAuthorize("hasRole('ADMIN')")
    public PerformanceReview create(@RequestBody CreatePerformanceReviewRequest request) {
        return performanceReviewService.createReview(request);
    }

    @GetMapping("/reviews")
    @PreAuthorize("hasRole('ADMIN')")
    public Page<PerformanceReview> all(Pageable pageable) {
        return performanceReviewService.getAllReviews(pageable);
    }

    // EMPLOYEE
    @GetMapping("/my-reviews")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public Page<PerformanceReview> my(Pageable pageable) {
        return performanceReviewService.getMyReviews(pageable);
    }
}

