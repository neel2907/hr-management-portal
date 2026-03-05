package com.company.portal.auth;

import com.company.portal.audit.AuditLogService;
import com.company.portal.user.Role;
import com.company.portal.user.User;
import com.company.portal.user.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogService auditLogService;

    // Explicit constructor injection (no Lombok)
    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuditLogService auditLogService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditLogService = auditLogService;
    }

    private static final String PASSWORD_REGEX =
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{8,}$";

    @Transactional
    public void register(RegisterRequest request) {

        if (!request.getPassword().matches(PASSWORD_REGEX)) {
            throw new IllegalArgumentException("Password does not meet complexity requirements");
        }

        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        // Build new user
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.EMPLOYEE)   // Default role
                .active(true)          // IMPORTANT: use active(), not isActive()
                .build();

        userRepository.save(user);

        auditLogService.record("USER_REGISTER",
                "User registered with email " + user.getEmail());
    }
}