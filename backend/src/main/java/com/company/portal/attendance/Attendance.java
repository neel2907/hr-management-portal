package com.company.portal.attendance;

import com.company.portal.user.User;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "attendance",
       uniqueConstraints = {
           @UniqueConstraint(columnNames = {"user_id", "attendance_date"})
       })
public class Attendance {

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

    @Column(name = "attendance_date", nullable = false)
    private LocalDate attendanceDate;

    @Column(name = "check_in", nullable = false)
    private LocalDateTime checkIn;

    @Column(name = "check_out")
    private LocalDateTime checkOut;

    @Column(name = "total_working_hours")
    private Double totalWorkingHours;

    @Column(nullable = false)
    private String status;

    @Column(name = "is_late", nullable = false)
    private boolean late;

    @Column(name = "is_overtime", nullable = false)
    private boolean overtime;

	public Attendance(String id, User user, LocalDate attendanceDate, LocalDateTime checkIn, LocalDateTime checkOut,
			Double totalWorkingHours, String status, boolean late, boolean overtime) {
		super();
		this.id = id;
		this.user = user;
		this.attendanceDate = attendanceDate;
		this.checkIn = checkIn;
		this.checkOut = checkOut;
		this.totalWorkingHours = totalWorkingHours;
		this.status = status;
		this.late = late;
		this.overtime = overtime;
	}

	public Attendance() {
		super();
		// TODO Auto-generated constructor stub
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

	public LocalDate getAttendanceDate() {
		return attendanceDate;
	}

	public void setAttendanceDate(LocalDate attendanceDate) {
		this.attendanceDate = attendanceDate;
	}

	public LocalDateTime getCheckIn() {
		return checkIn;
	}

	public void setCheckIn(LocalDateTime checkIn) {
		this.checkIn = checkIn;
	}

	public LocalDateTime getCheckOut() {
		return checkOut;
	}

	public void setCheckOut(LocalDateTime checkOut) {
		this.checkOut = checkOut;
	}

	public Double getTotalWorkingHours() {
		return totalWorkingHours;
	}

	public void setTotalWorkingHours(Double totalWorkingHours) {
		this.totalWorkingHours = totalWorkingHours;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public boolean isLate() {
		return late;
	}

	public void setLate(boolean late) {
		this.late = late;
	}

	public boolean isOvertime() {
		return overtime;
	}

	public void setOvertime(boolean overtime) {
		this.overtime = overtime;
	}

}