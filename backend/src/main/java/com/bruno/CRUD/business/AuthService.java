package com.bruno.CRUD.business;

import com.bruno.CRUD.business.dtos.in.LoginRequest;
import com.bruno.CRUD.business.dtos.in.RegisterRequest;
import com.bruno.CRUD.business.dtos.out.LoginResponse;
import com.bruno.CRUD.infrastructure.entity.Usuario;
import com.bruno.CRUD.infrastructure.repository.UsuarioRepository;
import com.bruno.CRUD.infrastructure.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder encoder;
    private final JwtService jwtService;

    public AuthService(UsuarioRepository usuarioRepository, JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.jwtService = jwtService;
        this.encoder = new BCryptPasswordEncoder();
    }

    public LoginResponse login(LoginRequest request) {

        if (request == null || request.getEmail() == null || request.getSenha() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email e senha obrigatórios");
        }

        String email = request.getEmail();
        String senha = request.getSenha();

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Usuário não encontrado"));

        if (usuario.getSenha() == null) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR, "Senha do usuário não configurada no banco");
        }

        if (!encoder.matches(senha, usuario.getSenha())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Senha inválida");
        }

        String token = jwtService.generateToken(usuario.getEmail());

        return new LoginResponse(token);
    }

    public void register(RegisterRequest request) {

        if (request == null || request.getEmail() == null || request.getSenha() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email e senha obrigatórios");
        }

        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Usuário já existe");
        }

        Usuario usuario = new Usuario();
        usuario.setEmail(request.getEmail());
        usuario.setSenha(encoder.encode(request.getSenha()));

        usuarioRepository.save(usuario);
    }
}