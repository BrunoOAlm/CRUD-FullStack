package com.bruno.CRUD.infrastructure.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    // 🔐 chave (tem que ter pelo menos 32 caracteres)
    private final String SECRET_KEY = "minha_chave_super_secreta_123456789012345";

    // 🔹 gera chave de assinatura
    private Key getSignKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    // 🔥 GERA TOKEN
    public String generateToken(String email) {
        return Jwts
                .builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1h
                .signWith(getSignKey())
                .compact();
    }

    // 🔹 Extrai email do token
    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    // 🔹 Valida token
    public boolean isTokenValid(String token) {
        return !isTokenExpired(token);
    }

    // 🔹 Verifica se expirou
    private boolean isTokenExpired(String token) {
        return extractAllClaims(token)
                .getExpiration()
                .before(new Date());
    }

    // 🔹 Extrai dados do token
    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}