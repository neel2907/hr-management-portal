package com.company.portal.user;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

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

	public User() {
		super();
		// TODO Auto-generated constructor stub
	}

	public User(String id, String name, String email, String password, Role role, Boolean active,
			LocalDateTime createdAt, LocalDateTime updatedAt, Integer annualLeaveBalance) {
		super();
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

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}

	public Integer getAnnualLeaveBalance() {
		return annualLeaveBalance;
	}

	public void setAnnualLeaveBalance(Integer annualLeaveBalance) {
		this.annualLeaveBalance = annualLeaveBalance;
	}
    
    
}