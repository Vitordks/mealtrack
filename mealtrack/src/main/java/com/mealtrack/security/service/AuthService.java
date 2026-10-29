package com.mealtrack.security.service;

import com.mealtrack.dto.response.ApiResponse;
import com.mealtrack.dto.usuario.LoginRequest;
import com.mealtrack.mapper.UsuarioMapper;
import com.mealtrack.model.Usuario;
import com.mealtrack.repository.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.mealtrack.security.JwtService;
@Service
public class AuthService {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final UsuarioMapper mapper;
    private final JwtService jwtService;
    public AuthService(
            UsuarioRepository repository,
            PasswordEncoder passwordEncoder,
            UsuarioMapper mapper,
            JwtService jwtService
    ) {

        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.mapper = mapper;
        this.jwtService = jwtService;

    }

    public ResponseEntity<?> login(LoginRequest request) {

        Usuario usuarioBanco = repository.findByEmail(
                request.getEmail()
        ).orElse(null);

        if (usuarioBanco == null) {

            return ResponseEntity.status(401)

                    .body(

                            new ApiResponse<>(

                                    false,

                                    "Email ou senha inválidos.",

                                    null

                            )

                    );

        }

        if (!passwordEncoder.matches(
                request.getSenha(),
                usuarioBanco.getSenha()
        )) {

            return ResponseEntity.status(401)

                    .body(

                            new ApiResponse<>(

                                    false,

                                    "Email ou senha inválidos.",

                                    null

                            )

                    );

        }

        String token = jwtService.gerarToken(
                usuarioBanco.getEmail()
        );

        return ResponseEntity.ok(

                new ApiResponse<>(

                        true,

                        "Login realizado com sucesso.",

                        mapper.toLoginResponse(
                                usuarioBanco,
                                token
                        )

                )

        );

    }

}