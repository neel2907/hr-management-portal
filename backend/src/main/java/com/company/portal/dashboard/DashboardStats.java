package com.company.portal.dashboard;

public class DashboardStats {

	private long totalEmployees;
	private long presentToday;
	private long pendingLeaves;
	private long totalAttendanceRecords;
	private long attendanceRecordsThisMonth;
	private long approvedLeavesThisMonth;
	private double averageWorkingHoursThisMonth;
	
	public DashboardStats() {
		super();
		// TODO Auto-generated constructor stub
	}

	public DashboardStats(long totalEmployees, long presentToday, long pendingLeaves,
			long totalAttendanceRecords, long attendanceRecordsThisMonth,
			long approvedLeavesThisMonth, double averageWorkingHoursThisMonth) {
		super();
		this.totalEmployees = totalEmployees;
		this.presentToday = presentToday;
		this.pendingLeaves = pendingLeaves;
		this.totalAttendanceRecords = totalAttendanceRecords;
		this.attendanceRecordsThisMonth = attendanceRecordsThisMonth;
		this.approvedLeavesThisMonth = approvedLeavesThisMonth;
		this.averageWorkingHoursThisMonth = averageWorkingHoursThisMonth;
	}

	public long getTotalEmployees() {
		return totalEmployees;
	}

	public void setTotalEmployees(long totalEmployees) {
		this.totalEmployees = totalEmployees;
	}

	public long getPresentToday() {
		return presentToday;
	}

	public void setPresentToday(long presentToday) {
		this.presentToday = presentToday;
	}

	public long getPendingLeaves() {
		return pendingLeaves;
	}

	public void setPendingLeaves(long pendingLeaves) {
		this.pendingLeaves = pendingLeaves;
	}

	public long getTotalAttendanceRecords() {
		return totalAttendanceRecords;
	}

	public void setTotalAttendanceRecords(long totalAttendanceRecords) {
		this.totalAttendanceRecords = totalAttendanceRecords;
	}

	public long getAttendanceRecordsThisMonth() {
		return attendanceRecordsThisMonth;
	}

	public void setAttendanceRecordsThisMonth(long attendanceRecordsThisMonth) {
		this.attendanceRecordsThisMonth = attendanceRecordsThisMonth;
	}

	public long getApprovedLeavesThisMonth() {
		return approvedLeavesThisMonth;
	}

	public void setApprovedLeavesThisMonth(long approvedLeavesThisMonth) {
		this.approvedLeavesThisMonth = approvedLeavesThisMonth;
	}

	public double getAverageWorkingHoursThisMonth() {
		return averageWorkingHoursThisMonth;
	}

	public void setAverageWorkingHoursThisMonth(double averageWorkingHoursThisMonth) {
		this.averageWorkingHoursThisMonth = averageWorkingHoursThisMonth;
	}
	
	
	
}
