package com.mealtrack.service;

import com.mealtrack.dto.usuario.UsuarioRequest;
import com.mealtrack.dto.usuario.UsuarioResponse;
import com.mealtrack.mapper.UsuarioMapper;
import com.mealtrack.model.Usuario;
import com.mealtrack.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final UsuarioMapper mapper;

    public UsuarioService(
            UsuarioRepository repository,
            PasswordEncoder passwordEncoder,
            UsuarioMapper mapper
    ) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.mapper = mapper;
    }

    public List<UsuarioResponse> listarTodos() {
        return mapper.toResponseList(repository.findAll());
    }

    public UsuarioResponse buscarPorId(Integer id) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
        return mapper.toResponse(usuario);
    }

    public UsuarioResponse salvar(UsuarioRequest request) {
        Usuario usuario = mapper.toEntity(request);
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        return mapper.toResponse(repository.save(usuario));
    }

    public UsuarioResponse atualizar(Integer id, Usuario usuarioAtualizado) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        usuario.setNome(usuarioAtualizado.getNome());
        usuario.setEmail(usuarioAtualizado.getEmail());

        if (usuarioAtualizado.getSenha() != null && !usuarioAtualizado.getSenha().isBlank()) {
            usuario.setSenha(passwordEncoder.encode(usuarioAtualizado.getSenha()));
        }

        usuario.setDocumento(usuarioAtualizado.getDocumento());
        usuario.setTipoPessoa(usuarioAtualizado.getTipoPessoa());
        usuario.setNivelAcesso(usuarioAtualizado.getNivelAcesso());
        usuario.setRestaurante(usuarioAtualizado.getRestaurante());

        return mapper.toResponse(repository.save(usuario));
    }

    public void excluir(Integer id) {
        repository.deleteById(id);
    }

    public List<Usuario> listarFuncionarios() {
        return repository.findAll().stream()
                .filter(u -> u.getNivelAcesso() != null)
                .toList();
    }
}
