package com.company.portal.dashboard;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminDashboardController {
	private AdminDashboardService adminDashboardService;
	
	public AdminDashboardController(AdminDashboardService adminDashboardService) {
		super();
		this.adminDashboardService = adminDashboardService;
	}
	
	
	@PreAuthorize("hasRole('ADMIN')")
	@GetMapping("/dashboard")
	
	
	public DashboardStats dashboard() {
	    return adminDashboardService.getStats();
	}

}
