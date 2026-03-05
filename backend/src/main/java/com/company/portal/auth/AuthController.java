package com.company.portal.auth;

import com.company.portal.security.JwtUtil;
import com.company.portal.security.CustomUserDetailsService;
import com.company.portal.audit.AuditLogService;
import com.company.portal.user.User;
import com.company.portal.user.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final AuthService authService;
    private final RefreshTokenService refreshTokenService;
    private final CustomUserDetailsService userDetailsService;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtUtil jwtUtil,
                          AuthService authService,
                          RefreshTokenService refreshTokenService,
                          CustomUserDetailsService userDetailsService,
                          UserRepository userRepository,
                          AuditLogService auditLogService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.authService = authService;
        this.refreshTokenService = refreshTokenService;
        this.userDetailsService = userDetailsService;
        this.userRepository = userRepository;
        this.auditLogService = auditLogService;
    }

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {
        authService.register(request);
        return "User registered successfully";
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Auto-unlock after 30 minutes
        if (Boolean.TRUE.equals(user.getAccountLocked()) && user.getLockTime() != null) {
            if (user.getLockTime().plusMinutes(30).isBefore(LocalDateTime.now())) {
                user.setAccountLocked(false);
                user.setFailedAttempts(0);
                user.setLockTime(null);
                userRepository.save(user);
            }
        }

        if (Boolean.TRUE.equals(user.getAccountLocked())) {
            throw new RuntimeException("Account is locked. Try again later.");
        }

        try {
            Authentication authentication =
                    authenticationManager.authenticate(
                            new UsernamePasswordAuthenticationToken(
                                    request.getEmail(),
                                    request.getPassword()
                            )
                    );

            // Success: reset attempts
            user.setFailedAttempts(0);
            user.setAccountLocked(false);
            user.setLockTime(null);
            userRepository.save(user);

            UserDetails userDetails =
                    (UserDetails) authentication.getPrincipal();

            String token = jwtUtil.generateToken(userDetails);

            RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

            auditLogService.record("USER_LOGIN",
                    "User " + user.getId() + " logged in");

            return new AuthResponse(token, refreshToken.getToken());

        } catch (BadCredentialsException ex) {
            int attempts = (user.getFailedAttempts() == null ? 0 : user.getFailedAttempts()) + 1;
            user.setFailedAttempts(attempts);
            if (attempts >= 5) {
                user.setAccountLocked(true);
                user.setLockTime(LocalDateTime.now());
            }
            userRepository.save(user);
            throw ex;
        }
    }

    @PostMapping("/refresh")
    public RefreshTokenResponse refresh(@RequestBody RefreshTokenRequest request) {

        RefreshToken refreshToken = refreshTokenService.validateAndGet(request.getRefreshToken());

        User user = refreshToken.getUser();

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());

        String newAccessToken = jwtUtil.generateToken(userDetails);

        return new RefreshTokenResponse(newAccessToken);
    }
}