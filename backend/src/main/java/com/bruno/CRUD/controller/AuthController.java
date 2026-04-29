package com.bruno.CRUD.controller;


import com.bruno.CRUD.business.AuthService;
import com.bruno.CRUD.business.dtos.in.LoginRequest;
import com.bruno.CRUD.business.dtos.in.RegisterRequest;
import com.bruno.CRUD.business.dtos.out.LoginResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.status(201).build();
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
    @GetMapping("/teste")
    public String teste() {
        return "ok";
    }


}
