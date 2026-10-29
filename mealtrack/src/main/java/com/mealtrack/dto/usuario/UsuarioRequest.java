package com.mealtrack.dto.usuario;

import com.mealtrack.model.Restaurante;
import com.mealtrack.model.enums.NivelAcesso;
import com.mealtrack.model.enums.TipoPessoa;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UsuarioRequest {

    private String nome;

    private String email;

    private String senha;

    private String documento;

    private TipoPessoa tipoPessoa;

    private NivelAcesso nivelAcesso;

    private Restaurante restaurante;

}