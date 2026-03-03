
# Employee Portal – Backend Requirements Document

## 1. Overview

This document defines the backend requirements for the Employee Portal system.

The backend is designed as a cloud-ready monolithic Spring Boot application supporting 100–500 employees, implementing secure, scalable, and enterprise-grade HR functionality.

---

## 2. Architecture Requirements

### 2.1 Architectural Style
- Monolithic architecture
- Layered structure:
  - Controller
  - Service
  - Repository
- Stateless REST API
- JWT-based authentication
- Oracle Database (Dockerized)

### 2.2 Technology Stack
- Spring Boot 3.2.5
- Java 17
- Spring Security
- Spring Data JPA
- Oracle DB (21c XE in Docker)
- Maven
- Lombok
- Swagger / OpenAPI

---

## 3. Authentication & Security Requirements

### 3.1 Authentication
- JWT-based authentication
- Stateless session management
- Token must include:
  - sub (email)
  - role (ADMIN | EMPLOYEE)
  - iat
  - exp

### 3.2 Authorization
- Role-based access control
- Method-level security using @PreAuthorize
- ADMIN-only endpoints enforced at backend level

### 3.3 Password Management
- BCrypt password encoding
- No plaintext storage

### 3.4 Security Configuration
- CSRF disabled for REST API
- CORS enabled for frontend domain
- Unauthorized requests return proper HTTP status codes

---

## 4. Core Functional Modules

### 4.1 Attendance Module
- Single check-in per day
- Single check-out per day
- Total working hours calculation
- Monthly working hours summary
- Late detection (after 9:15 AM)
- Overtime detection (over 8 hours)
- Admin access to all records
- Pageable list endpoints

### 4.2 Leave Management Module
- Leave application (type, date range, reason)
- Leave statuses: PENDING, APPROVED, REJECTED
- Only ADMIN can review
- Leave balance starts at 30 days
- Deduction only upon approval
- Insufficient balance validation
- Leave balance ledger tracking
- Pageable endpoints for employee and admin

### 4.3 Performance Module
- Admin creates performance reviews
- Employees view own reviews
- Store rating and comments
- Pageable listing

### 4.4 Admin Dashboard
- Total employees
- Total attendance records
- Pending leave requests
- Monthly summaries

### 4.5 Audit Logging
- Log check-in and check-out
- Log leave application and review
- Log performance review creation
- Admin pageable access to logs

---

## 5. API Standards

### 5.1 Pagination Contract (Locked)

All list endpoints must return:

{
  "content": [...],
  "totalElements": number,
  "totalPages": number,
  "size": number,
  "number": number,
  "first": boolean,
  "last": boolean
}

Supported query parameters:
?page=0&size=20&sort=field,desc

---

### 5.2 Error Handling

All errors must return:

{
  "message": "Descriptive error message"
}

---

## 6. Database Requirements

### Core Entities
- User
- Attendance
- LeaveRequest
- LeaveBalanceHistory
- PerformanceReview
- AuditLog

### Constraints
- Unique email for users
- Referential integrity enforced
- Indexed frequently queried fields

---

## 7. Non-Functional Requirements

### Performance
- Support up to 500 employees
- Efficient pageable queries

### Scalability
- Cloud deployment compatible
- Dockerized database
- Externalized configuration

### Reliability
- Global exception handling
- Consistent JSON responses
- Proper HTTP status codes

---

## 8. Deployment Requirements
- Default backend port: 8081
- Oracle DB containerized
- Environment-based configuration
- Ready for AWS/Azure deployment

---

## 9. Success Criteria
- All modules fully functional
- Role-based security enforced
- Pagination implemented system-wide
- Leave ledger operational
- Audit logging active
- API contract stable

---

End of Backend Requirements Document
