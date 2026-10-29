package com.mealtrack.dto.usuario;

import com.mealtrack.model.enums.NivelAcesso;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UsuarioResponse {

    private Integer id;

    private String nome;

    private String email;

    private NivelAcesso nivelAcesso;

}