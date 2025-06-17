package com.itacademy.petAcademy.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.Enumeration;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String method = request.getMethod();
        String uri = request.getRequestURI();
        
        System.out.println("🔍 JWT Filter - Método: " + method + ", URI: " + uri);
        
        // DEBUG: Mostrar TODOS los headers
        System.out.println("📋 Headers recibidos:");
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            String headerValue = request.getHeader(headerName);
            System.out.println("  " + headerName + ": " + headerValue);
        }

        // Verificar específicamente Authorization
        String authHeader = request.getHeader("Authorization");
        System.out.println("🔑 Authorization header: " + (authHeader != null ? authHeader.substring(0, Math.min(50, authHeader.length())) + "..." : "NULL"));

        // Verificar si es petición OPTIONS (preflight)
        if ("OPTIONS".equals(method)) {
            System.out.println("✈️ Petición OPTIONS (preflight) - saltando JWT filter");
            filterChain.doFilter(request, response);
            return;
        }

        // Verificar si es endpoint público
        if (uri.startsWith("/auth/")) {
            System.out.println("🔓 Endpoint público - saltando JWT filter");
            filterChain.doFilter(request, response);
            return;
        }

        // Aquí iría tu lógica JWT normal
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            System.out.println("✅ Token JWT encontrado: " + token.substring(0, Math.min(30, token.length())) + "...");
            
            // Aquí validarías el token y establecerías la autenticación
            // validateTokenAndSetAuthentication(token);
        } else {
            System.out.println("❌ No se encontró token JWT válido");
        }

        filterChain.doFilter(request, response);
    }
}
