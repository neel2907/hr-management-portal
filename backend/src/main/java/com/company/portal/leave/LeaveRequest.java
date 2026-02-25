package com.company.portal.leave;

import com.company.portal.user.User;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "leave_request")
public class LeaveRequest {

    @Id
    @Column(length = 36)
    private String id;

    @PrePersist
    public void generateId() {
        if (id == null) {
            id = UUID.randomUUID().toString();
        }
    }

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String leaveType;

    private LocalDate startDate;
    private LocalDate endDate;

    private Integer totalDays;

    private String reason;

    private String status; // PENDING, APPROVED, REJECTED

    @ManyToOne
    @JoinColumn(name = "reviewed_by")
    private User reviewedBy;

    private LocalDateTime reviewedAt;

	public LeaveRequest() {
		super();
		// TODO Auto-generated constructor stub
	}

	public LeaveRequest(String id, User user, String leaveType, LocalDate startDate, LocalDate endDate,
			Integer totalDays, String reason, String status, User reviewedBy, LocalDateTime reviewedAt) {
		super();
		this.id = id;
		this.user = user;
		this.leaveType = leaveType;
		this.startDate = startDate;
		this.endDate = endDate;
		this.totalDays = totalDays;
		this.reason = reason;
		this.status = status;
		this.reviewedBy = reviewedBy;
		this.reviewedAt = reviewedAt;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public String getLeaveType() {
		return leaveType;
	}

	public void setLeaveType(String leaveType) {
		this.leaveType = leaveType;
	}

	public LocalDate getStartDate() {
		return startDate;
	}

	public void setStartDate(LocalDate startDate) {
		this.startDate = startDate;
	}

	public LocalDate getEndDate() {
		return endDate;
	}

	public void setEndDate(LocalDate endDate) {
		this.endDate = endDate;
	}

	public Integer getTotalDays() {
		return totalDays;
	}

	public void setTotalDays(Integer totalDays) {
		this.totalDays = totalDays;
	}

	public String getReason() {
		return reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public User getReviewedBy() {
		return reviewedBy;
	}

	public void setReviewedBy(User reviewedBy) {
		this.reviewedBy = reviewedBy;
	}

	public LocalDateTime getReviewedAt() {
		return reviewedAt;
	}

	public void setReviewedAt(LocalDateTime reviewedAt) {
		this.reviewedAt = reviewedAt;
	}

    // getters and setters
    
}