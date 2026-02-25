package com.company.portal.test;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/me")
    public String getCurrentUser(Authentication authentication) {
        return "Logged in user: " + authentication.getName();
    }
}