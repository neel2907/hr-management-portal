
# Employee Portal – Business Requirements Document (BRD)

## 1. Project Overview

The Employee Portal is a centralized HR management system designed to manage employee attendance, leave requests, performance reviews, and administrative reporting.

The system supports **100–500 employees**, operates with **in-person attendance only**, and follows a **fixed organizational structure**.  
It is deployed as a **cloud-based monolithic application**.

---

## 2. Objectives

- Digitize employee attendance tracking
- Automate leave management workflow
- Enable structured performance reviews
- Provide administrative dashboards and reports
- Maintain secure role-based access control
- Ensure scalability for 100–500 employees

---

## 3. User Roles

### 3.1 ADMIN
- View all employee records
- Approve or reject leave requests
- Create and manage performance reviews
- View attendance reports
- Access audit logs
- Access dashboard statistics

### 3.2 EMPLOYEE
- Check-in and check-out (in-person only)
- View personal attendance records
- View monthly working hours
- Apply for leave
- View leave request status
- View performance reviews
- View leave balance

---

## 4. Functional Requirements

### 4.1 Authentication & Security
- JWT-based authentication
- Stateless session management
- Role-based access (ADMIN, EMPLOYEE)
- Secure password storage (BCrypt)
- Token expiration handling

### 4.2 Attendance Management
- Single check-in per day
- Single check-out per day
- Automatic total working hours calculation
- Monthly working hour summary
- Late arrival detection (after 9:15 AM)
- Overtime detection (over 8 hours)
- Admin view of all attendance records
- Pagination support

### 4.3 Leave Management
- Employees can apply for leave with:
  - Leave type
  - Start date
  - End date
  - Reason
- Leave status: PENDING, APPROVED, REJECTED
- Only ADMIN can approve/reject
- Leave balance starts at **30 days**
- Leave balance deducted only upon approval
- Insufficient balance validation
- Leave balance history (ledger tracking)
- Admin view of all leave requests
- Pagination support

### 4.4 Performance Management
- Admin creates performance reviews
- Employees can view their own reviews
- Rating and comments stored
- Admin view of all reviews
- Pagination support

### 4.5 Admin Dashboard
- Total employees
- Total attendance records
- Pending leave requests
- Monthly attendance summary
- Audit log access

### 4.6 Audit Logging
The system must record important actions:
- Check-in
- Check-out
- Leave application
- Leave approval/rejection
- Performance review creation

Admin can view audit logs with pagination support.

---

## 5. Non-Functional Requirements

### 5.1 Performance
- Support up to 500 employees
- Efficient pagination for large datasets

### 5.2 Security
- Role-based authorization
- Secure JWT handling
- Stateless authentication
- CORS configuration for frontend integration

### 5.3 Scalability
- Cloud deployment
- Monolithic architecture
- Oracle database backend

### 5.4 Reliability
Standardized error response format:

```json
{
  "message": "Descriptive error message"
}
```

---

## 6. Technical Stack

### Backend
- Spring Boot 3.2.5
- Java 17
- Oracle Database (Docker)
- Spring Security
- JWT Authentication
- Maven
- Lombok

### Frontend
- React (Vite)
- Material UI
- Role-based routing

---

## 7. Constraints
- In-person attendance only
- Fixed organizational structure
- Monolithic deployment
- 30 days annual leave default

---

## 8. Success Criteria
- All modules fully functional
- Role-based access enforced
- Pagination across all list endpoints
- Leave balance accurately tracked
- Audit logs capturing critical actions
- Stable frontend-backend integration

---

End of Document
