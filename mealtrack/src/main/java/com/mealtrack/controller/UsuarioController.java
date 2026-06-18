package com.mealtrack.controller;

import com.mealtrack.model.Usuario;
import com.mealtrack.repository.UsuarioRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "http://localhost:5173")
public class UsuarioController {

    private final UsuarioRepository repository;

    public UsuarioController(UsuarioRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Usuario> listarTodos() {
        return repository.findAll();
    }

    @PostMapping("/login")
    public Usuario login(@RequestBody Usuario usuario) {

        return repository.findByEmailAndSenha(
                usuario.getEmail(),
                usuario.getSenha()
        ).orElseThrow();

    }

    @GetMapping("/{id}")
    public Usuario buscarPorId(@PathVariable Integer id) {

        return repository.findById(id)
                .orElseThrow();

    }

    @PostMapping
    public Usuario salvar(@RequestBody Usuario usuario) {

        return repository.save(usuario);

    }

    @PutMapping("/{id}")
    public Usuario atualizar(
            @PathVariable Integer id,
            @RequestBody Usuario usuarioAtualizado) {

        Usuario usuario = repository.findById(id)
                .orElseThrow();

        usuario.setNome(usuarioAtualizado.getNome());
        usuario.setEmail(usuarioAtualizado.getEmail());
        usuario.setSenha(usuarioAtualizado.getSenha());
        usuario.setDocumento(usuarioAtualizado.getDocumento());
        usuario.setTipoPessoa(usuarioAtualizado.getTipoPessoa());
        usuario.setNivelAcesso(usuarioAtualizado.getNivelAcesso());
        usuario.setRestaurante(usuarioAtualizado.getRestaurante());

        return repository.save(usuario);

    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Integer id) {

        repository.deleteById(id);

    }
}