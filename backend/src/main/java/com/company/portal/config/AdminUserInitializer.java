package com.company.portal.config;

import com.company.portal.user.Role;
import com.company.portal.user.User;
import com.company.portal.user.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminUserInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminUserInitializer(UserRepository userRepository,
                                PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        boolean adminExists = userRepository.findAll().stream()
                .anyMatch(user -> user.getRole() == Role.ADMIN);

        if (adminExists) {
            return;
        }

        User admin = new User();
        admin.setName("System Admin");
        admin.setEmail("admin@portal.com");
        admin.setPassword(passwordEncoder.encode("Admin@123"));
        admin.setRole(Role.ADMIN);
        admin.setAnnualLeaveBalance(30);
        admin.setActive(true);
        userRepository.save(admin);
    }
}

