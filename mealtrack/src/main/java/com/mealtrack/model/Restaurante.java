package com.mealtrack.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "restaurante")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Restaurante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_restaurante")
    private Integer id;

    private String nome;

    private String cnpj;

    private String email;

    private String telefone;

    private String endereco;

    @Column(name = "data_fundacao")
    private LocalDate dataFundacao;
}