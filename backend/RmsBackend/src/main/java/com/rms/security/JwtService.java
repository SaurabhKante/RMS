package com.rms.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    /**
     * Generate JWT Token
     */
    public String generateToken(Integer userId,
                                String email,
                                String role) {

        Map<String, Object> claims = new HashMap<>();

        claims.put("userId", userId);
        claims.put("role", role);

        return buildToken(claims, email);
    }

    /**
     * Build JWT
     */
    private String buildToken(Map<String, Object> claims,
                              String subject) {

        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSignInKey())
                .compact();
    }

    /**
     * Secret Key
     */
    private SecretKey getSignInKey() {

        byte[] keyBytes = Decoders.BASE64.decode(secretKey);

        return Keys.hmacShaKeyFor(keyBytes);

    }

    /**
     * Extract Username (Email)
     */
    public String extractUsername(String token) {

        return extractClaim(token, Claims::getSubject);

    }

    /**
     * Extract UserId
     */
    public Integer extractUserId(String token) {

        return extractAllClaims(token)
                .get("userId", Integer.class);

    }

    /**
     * Extract Role
     */
    public String extractRole(String token) {

        return extractAllClaims(token)
                .get("role", String.class);

    }

    /**
     * Extract Expiration
     */
    public Date extractExpiration(String token) {

        return extractClaim(token, Claims::getExpiration);

    }

    /**
     * Generic Claim Extractor
     */
    public <T> T extractClaim(String token,
                              Function<Claims, T> claimsResolver) {

        Claims claims = extractAllClaims(token);

        return claimsResolver.apply(claims);

    }

    /**
     * Read All Claims
     */
    private Claims extractAllClaims(String token) {

        return Jwts.parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

    }

    /**
     * Token Expired?
     */
    public boolean isTokenExpired(String token) {

        return extractExpiration(token)
                .before(new Date());

    }

    /**
     * Validate Token
     */
    public boolean isTokenValid(String token,
                                String email) {

        String username = extractUsername(token);

        return username.equals(email)
                && !isTokenExpired(token);

    }

}