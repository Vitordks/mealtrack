package com.mealtrack.controller;

import com.mealtrack.dto.usuario.LoginRequest;
import com.mealtrack.dto.usuario.UsuarioRequest;
import com.mealtrack.dto.usuario.UsuarioResponse;
import com.mealtrack.model.Usuario;

import com.mealtrack.security.service.AuthService;
import com.mealtrack.service.UsuarioService;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final AuthService authService;
    private final UsuarioService service;

    public UsuarioController(
            AuthService authService,
            UsuarioService service
    ) {
        this.authService = authService;
        this.service = service;
    }

    @GetMapping
    public List<UsuarioResponse> listarTodos() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public UsuarioResponse buscarPorId(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request
    ) {

        return authService.login(request);

    }

    @PostMapping
    public UsuarioResponse salvar(
            @RequestBody UsuarioRequest request
    ) {

        return service.salvar(request);

    }

    @PutMapping("/{id}")
    public UsuarioResponse atualizar(
            @PathVariable Integer id,
            @RequestBody Usuario usuarioAtualizado
    ) {
        return service.atualizar(id, usuarioAtualizado);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Integer id) {
        service.excluir(id);
    }
}