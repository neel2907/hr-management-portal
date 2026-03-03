package com.company.portal.performance;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PerformanceReviewRepository extends JpaRepository<PerformanceReview, String> {
    Page<PerformanceReview> findByEmployeeId(String employeeId, Pageable pageable);
}

