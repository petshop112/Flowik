package fooTalent.misino.Auth.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import fooTalent.misino.users.entity.user;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class jwtService {

    private static final String SECRET_KEY = "clave-super-secreta";

    public String generateToken(user user) {
        return JWT.create()
                .withSubject(user.getEmail())
                .withClaim("id", user.getId())
                .withClaim("lastName", user.getLastName())
                .withClaim("firstName", user.getFirstName())
                .withClaim("userName", user.getUserName())
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + 86400000)) // 1 día
                .sign(Algorithm.HMAC256(SECRET_KEY));
    }

    public String extractUsername(String token) {
        return JWT.require(Algorithm.HMAC256(SECRET_KEY))
                .build()
                .verify(token)
                .getSubject();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        return username.equals(userDetails.getUsername());
    }
}
