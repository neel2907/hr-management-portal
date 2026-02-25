package com.company.portal.performance;

import java.time.LocalDate;
import java.util.UUID;

import com.company.portal.user.User;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "performance_review")
public class PerformanceReview {

    @Id
    private String id;

    @PrePersist
    public void generateId() {
        if (id == null) id = UUID.randomUUID().toString();
    }

    @ManyToOne
    private User employee;

    @ManyToOne
    private User reviewedBy;

    private Integer rating; // 1-5

    private String comments;

    private LocalDate reviewDate;

	public PerformanceReview() {
		super();
		// TODO Auto-generated constructor stub
	}

	public PerformanceReview(String id, User employee, User reviewedBy, Integer rating, String comments,
			LocalDate reviewDate) {
		super();
		this.id = id;
		this.employee = employee;
		this.reviewedBy = reviewedBy;
		this.rating = rating;
		this.comments = comments;
		this.reviewDate = reviewDate;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public User getEmployee() {
		return employee;
	}

	public void setEmployee(User employee) {
		this.employee = employee;
	}

	public User getReviewedBy() {
		return reviewedBy;
	}

	public void setReviewedBy(User reviewedBy) {
		this.reviewedBy = reviewedBy;
	}

	public Integer getRating() {
		return rating;
	}

	public void setRating(Integer rating) {
		this.rating = rating;
	}

	public String getComments() {
		return comments;
	}

	public void setComments(String comments) {
		this.comments = comments;
	}

	public LocalDate getReviewDate() {
		return reviewDate;
	}

	public void setReviewDate(LocalDate reviewDate) {
		this.reviewDate = reviewDate;
	}
    
    
}
