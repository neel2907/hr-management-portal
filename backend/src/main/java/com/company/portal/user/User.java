package com.company.portal.user;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;
import com.company.portal.user.Role;


@Entity
@Table(name = "users")
@Builder
public class User {

    @Id
    @Column(length = 36)
    private String id;

    @PrePersist
    public void generateId() {
        if (id == null) {
            id = UUID.randomUUID().toString();
        }
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Builder.Default
    @Column(name = "is_active")
    private Boolean active = true;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @Builder.Default
    @Column(name = "annual_leave_balance")
    private Integer annualLeaveBalance = 30;

    @Builder.Default
    @Column(name = "failed_attempts")
    private Integer failedAttempts = 0;

    @Builder.Default
    @Column(name = "account_locked")
    private Boolean accountLocked = false;

    private LocalDateTime lockTime;

    // Default constructor
    public User() {
        super();
    }

    // Existing constructor (9 fields)
    public User(String id, String name, String email, String password, Role role, Boolean active,
                LocalDateTime createdAt, LocalDateTime updatedAt, Integer annualLeaveBalance) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.active = active;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.annualLeaveBalance = annualLeaveBalance;
    }

    // New constructor including all fields (12)
    public User(String id, String name, String email, String password, Role role, Boolean active,
                LocalDateTime createdAt, LocalDateTime updatedAt, Integer annualLeaveBalance,
                Integer failedAttempts, Boolean accountLocked, LocalDateTime lockTime) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.active = active;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.annualLeaveBalance = annualLeaveBalance;
        this.failedAttempts = failedAttempts;
        this.accountLocked = accountLocked;
        this.lockTime = lockTime;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Integer getAnnualLeaveBalance() { return annualLeaveBalance; }
    public void setAnnualLeaveBalance(Integer annualLeaveBalance) { this.annualLeaveBalance = annualLeaveBalance; }

    public Integer getFailedAttempts() { return failedAttempts; }
    public void setFailedAttempts(Integer failedAttempts) { this.failedAttempts = failedAttempts; }

    public Boolean getAccountLocked() { return accountLocked; }
    public void setAccountLocked(Boolean accountLocked) { this.accountLocked = accountLocked; }

    public LocalDateTime getLockTime() { return lockTime; }
    public void setLockTime(LocalDateTime lockTime) { this.lockTime = lockTime; }
}