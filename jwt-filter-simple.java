package com.itacademy.petAcademy.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String method = request.getMethod();
        String uri = request.getRequestURI();
        
        System.out.println("🔍 JWT Filter - " + method + " " + uri);
        
        // ⬅️ PERMITIR TODAS LAS PETICIONES OPTIONS (PREFLIGHT)
        if ("OPTIONS".equals(method)) {
            System.out.println("✈️ OPTIONS request - allowing through");
            filterChain.doFilter(request, response);
            return;
        }

        // ⬅️ PERMITIR ENDPOINTS PÚBLICOS
        if (uri.startsWith("/auth/")) {
            System.out.println("🔓 Public endpoint - allowing through");
            filterChain.doFilter(request, response);
            return;
        }

        // ⬅️ VERIFICAR AUTHORIZATION HEADER
        String authHeader = request.getHeader("Authorization");
        System.out.println("🔑 Authorization header: " + (authHeader != null ? "PRESENT" : "NULL"));
        
        if (authHeader != null) {
            System.out.println("🔑 Header value: " + authHeader.substring(0, Math.min(50, authHeader.length())) + "...");
        }

        // ⬅️ AQUÍ IRÍA TU LÓGICA JWT
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            System.out.println("✅ JWT Token found: " + token.substring(0, Math.min(30, token.length())) + "...");
            
            // TODO: Validar token y establecer autenticación
            // validateTokenAndSetAuthentication(token);
        } else {
            System.out.println("❌ No valid JWT token found");
        }

        filterChain.doFilter(request, response);
    }
}
