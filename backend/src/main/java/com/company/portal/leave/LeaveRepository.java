package com.company.portal.leave;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeaveRepository
        extends JpaRepository<LeaveRequest, String> {

    List<LeaveRequest> findByUserId(String userId);
    
    long countByStatus(String status);
}