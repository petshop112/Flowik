package fooTalent.flowik.Auth.service;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final CustomUserDetailService userDetailsService;
    private final JwtService jwtService;


    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String path = request.getServletPath();
        if (
                        path.startsWith("/api/auth/login") ||
                        path.startsWith("/api/auth/register") ||
                        path.startsWith("/api/auth/forgot_password") ||
                        path.startsWith("/swagger-ui") ||
                        path.startsWith("/v3/api-docs")
        ) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);
        String username;
        try {
            username = jwtService.extractUsername(token);
        } catch (Exception e) {
            filterChain.doFilter(request, response);
            return;
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            if (jwtService.isTokenValid(token, userDetails)) {

                var authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities()
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);

                long expirationTime = jwtService.extractExpiration(token).getTime();
                long now = System.currentTimeMillis();
                long remainingTime = expirationTime - now;

                if (remainingTime < Duration.ofMinutes(30).toMillis()) {
                    String newToken = jwtService.generateToken(userDetails);
                    ResponseCookie cookie = ResponseCookie.from("token", newToken)
                            .httpOnly(true)
                            .secure(false) // CAMBIAR A TRUE EN PRODUCCION!!!
                            .path("/")
                            .maxAge(Duration.ofHours(2))
                            .sameSite("Strict")
                            .build();
                    response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
                }
            }
        }

        filterChain.doFilter(request, response);
    }

}
