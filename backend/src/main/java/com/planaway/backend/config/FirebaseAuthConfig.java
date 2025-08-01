// src/main/java/com/planaway/backend/config/FirebaseAuthConfig.java
package com.planaway.backend.config;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class FirebaseAuthConfig extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                  HttpServletResponse response, 
                                  FilterChain filterChain) throws ServletException, IOException {
        //testing stuff
        System.out.println("Request to: " + request.getRequestURI());
        
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);
                request.setAttribute("firebaseUid", decodedToken.getUid());
                request.setAttribute("userEmail", decodedToken.getEmail());
                System.out.println("Authenticated user: " + decodedToken.getUid());
            } catch (FirebaseAuthException e) {
                System.out.println("Invalid token: " + e.getMessage());
            }
        }
        
        filterChain.doFilter(request, response);
    }
}