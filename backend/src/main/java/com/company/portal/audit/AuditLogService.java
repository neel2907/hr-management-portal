package com.company.portal.audit;

import com.company.portal.user.User;
import com.company.portal.user.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    public AuditLogService(AuditLogRepository auditLogRepository,
                           UserRepository userRepository) {
        this.auditLogRepository = auditLogRepository;
        this.userRepository = userRepository;
    }

    public void record(String action, String details) {
        AuditLog log = new AuditLog();
        log.setAction(action);
        log.setDetails(details);
        log.setTimestamp(LocalDateTime.now());

        String email = null;
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            email = SecurityContextHolder.getContext()
                    .getAuthentication()
                    .getName();
        }

        if (email != null) {
            userRepository.findByEmail(email).ifPresent(log::setUser);
        }

        auditLogRepository.save(log);
    }

    public Page<AuditLog> getLogs(Pageable pageable) {
        return auditLogRepository.findAllByOrderByTimestampDesc(pageable);
    }
}

