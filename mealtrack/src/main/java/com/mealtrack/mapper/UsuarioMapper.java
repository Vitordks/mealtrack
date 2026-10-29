package com.mealtrack.mapper;

import com.mealtrack.dto.usuario.LoginResponse;
import com.mealtrack.dto.usuario.UsuarioRequest;
import com.mealtrack.dto.usuario.UsuarioResponse;
import com.mealtrack.model.Usuario;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class UsuarioMapper {

    public Usuario toEntity(UsuarioRequest request) {

        Usuario usuario = new Usuario();

        usuario.setNome(request.getNome());
        usuario.setEmail(request.getEmail());
        usuario.setSenha(request.getSenha());
        usuario.setDocumento(request.getDocumento());
        usuario.setTipoPessoa(request.getTipoPessoa());
        usuario.setNivelAcesso(request.getNivelAcesso());
        usuario.setRestaurante(request.getRestaurante());

        return usuario;
    }

    public UsuarioResponse toResponse(Usuario usuario) {

        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getNivelAcesso()
        );

    }

    public LoginResponse toLoginResponse(
            Usuario usuario,
            String token
    ) {

        return new LoginResponse(

                token,

                usuario.getId(),

                usuario.getNome(),

                usuario.getEmail(),

                usuario.getNivelAcesso()

        );

    }

    public List<UsuarioResponse> toResponseList(List<Usuario> usuarios) {

        return usuarios.stream()
                .map(this::toResponse)
                .toList();

    }

}