package com.mealtrack.security.service;

import com.mealtrack.model.Usuario;
import com.mealtrack.repository.UsuarioRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UsuarioRepository repository;

    public CustomUserDetailsService(
            UsuarioRepository repository
    ) {

        this.repository = repository;

    }

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        Usuario usuario = repository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("Usuário não encontrado."));

        return new User(

                usuario.getEmail(),

                usuario.getSenha(),

                List.of(
                        new SimpleGrantedAuthority(
                                "ROLE_" + usuario.getNivelAcesso().name()
                        )
                )

        );

    }

}