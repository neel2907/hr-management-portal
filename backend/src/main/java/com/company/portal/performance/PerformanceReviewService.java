package com.company.portal.performance;

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

@Service
public class PerformanceReviewService {

    private final PerformanceReviewRepository performanceReviewRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    public PerformanceReviewService(PerformanceReviewRepository performanceReviewRepository,
                                    UserRepository userRepository,
                                    AuditLogService auditLogService) {
        this.performanceReviewRepository = performanceReviewRepository;
        this.userRepository = userRepository;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public PerformanceReview createReview(CreatePerformanceReviewRequest request) {
        User reviewer = getCurrentUser();
        if (reviewer.getRole() != Role.ADMIN) {
            throw new RuntimeException("Only ADMIN can create performance reviews");
        }

        if (request.getEmployeeId() == null || request.getEmployeeId().isBlank()) {
            throw new RuntimeException("employeeId is required");
        }

        User employee = userRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        PerformanceReview review = new PerformanceReview();
        review.setEmployee(employee);
        review.setReviewedBy(reviewer);
        review.setRating(request.getRating());
        review.setComments(request.getComments());
        review.setReviewDate(request.getReviewDate() != null ? request.getReviewDate() : LocalDate.now());

        PerformanceReview saved = performanceReviewRepository.save(review);

        auditLogService.record("PERFORMANCE_REVIEW_CREATE",
                "Admin " + reviewer.getId() +
                        " created performance review " + saved.getId() +
                        " for employee " + employee.getId());

        return saved;
    }

    public Page<PerformanceReview> getAllReviews(Pageable pageable) {
        User current = getCurrentUser();
        if (current.getRole() != Role.ADMIN) {
            throw new RuntimeException("Only ADMIN can view all performance reviews");
        }
        return performanceReviewRepository.findAll(pageable);
    }

    public Page<PerformanceReview> getMyReviews(Pageable pageable) {
        User current = getCurrentUser();
        return performanceReviewRepository.findByEmployeeId(current.getId(), pageable);
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}

