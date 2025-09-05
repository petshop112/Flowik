package fooTalent.flowik.auth.services;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import fooTalent.flowik.users.entity.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class JwtService {

    private static final String SECRET_KEY = "clave-super-secreta";

    public String generateToken(User user) {
        return buildToken(user.getEmail(),
                user.getId(),
                user.getLastName(),
                user.getFirstName(),
                user.getUserName());
    }

    public String generateToken(UserDetails userDetails) {
        return JWT.create()
                .withSubject(userDetails.getUsername())
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + (2 * 60 * 60 * 1000)))
                .sign(Algorithm.HMAC256(SECRET_KEY));
    }

    private String buildToken(String email, Long id, String lastName, String firstName, String userName) {
        return JWT.create()
                .withSubject(email)
                .withClaim("id", id)
                .withClaim("lastName", lastName)
                .withClaim("firstName", firstName)
                .withClaim("userName", userName)
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + (2 * 60 * 60 * 1000)))
                .sign(Algorithm.HMAC256(SECRET_KEY));
    }

    public String extractUsername(String token) {
        return JWT.require(Algorithm.HMAC256(SECRET_KEY))
                .build()
                .verify(token)
                .getSubject();
    }

    public Date extractExpiration(String token) {
        return JWT.require(Algorithm.HMAC256(SECRET_KEY))
                .build()
                .verify(token)
                .getExpiresAt();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
}