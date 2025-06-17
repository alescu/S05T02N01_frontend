package com.itacademy.petAcademy.security;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Enumeration;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtRequestFilter.class);

    private final JwtService jwtService;

    @Autowired
    @Lazy
    private UserDetailsService userDetailsService;

    public JwtRequestFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String method = request.getMethod();
        String uri = request.getRequestURI();
        
        // ⬅️ DEBUG COMPLETO
        System.out.println("🔍 JWT Filter - " + method + " " + uri);
        
        // ⬅️ MOSTRAR TODOS LOS HEADERS RECIBIDOS
        System.out.println("📋 Headers recibidos en JWT Filter:");
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            String headerValue = request.getHeader(headerName);
            System.out.println("  " + headerName + ": " + headerValue);
        }

        final String authorizationHeader = request.getHeader("Authorization");
        
        // ⬅️ LOG ESPECÍFICO PARA AUTHORIZATION
        System.out.println("🔑 Authorization header en JWT Filter: " + 
            (authorizationHeader != null ? authorizationHeader.substring(0, Math.min(50, authorizationHeader.length())) + "..." : "NULL"));

        // ⬅️ PERMITIR OPTIONS SIN PROCESAMIENTO JWT
        if ("OPTIONS".equals(method)) {
            System.out.println("✈️ OPTIONS request - saltando JWT processing");
            chain.doFilter(request, response);
            return;
        }

        // ⬅️ PERMITIR ENDPOINTS PÚBLICOS
        if (uri.startsWith("/auth/")) {
            System.out.println("🔓 Public endpoint - saltando JWT processing");
            chain.doFilter(request, response);
            return;
        }

        String username = null;
        String jwt = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            System.out.println("✅ JWT Token extraído: " + jwt.substring(0, Math.min(30, jwt.length())) + "...");
            
            try {
                username = jwtService.extractUsername(jwt);
                System.out.println("✅ Username extraído del JWT: " + username);
            } catch (ExpiredJwtException e) {
                log.warn("JWT Token ha expirat: " + e.getMessage());
                System.out.println("❌ JWT Token expirado");
            } catch (MalformedJwtException e) {
                log.warn("JWT Token invàlid o mal format: " + e.getMessage());
                System.out.println("❌ JWT Token mal formateado");
            } catch (Exception e) {
                log.error("Error inesperat en processar el JWT: " + e.getMessage(), e);
                System.out.println("❌ Error inesperado procesando JWT: " + e.getMessage());
            }
        } else {
            System.out.println("❌ No se encontró Authorization header válido");
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            System.out.println("🔄 Validando token para usuario: " + username);
            
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            if (jwtService.validateToken(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                usernamePasswordAuthenticationToken
                        .setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
                
                System.out.println("✅ Usuario autenticado correctamente: " + username);
                log.debug("Usuari autenticat amb JWT: " + username);
            } else {
                System.out.println("❌ JWT Token no válido para usuario: " + username);
                log.warn("JWT Token no vàlid per a l'usuari: " + username);
            }
        } else if (username == null && jwt != null) {
            System.out.println("⚠️ JWT presente pero username no extraído");
            log.debug("JWT present però username no extret (potser per expiració o error de signatura)");
        } else if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            System.out.println("ℹ️ No Authorization header o no empieza con 'Bearer '");
            log.debug("No s'ha trobat capçalera Authorization amb 'Bearer ' o no s'ha processat el JWT.");
        }

        chain.doFilter(request, response);
    }
}
