package com.mealtrack.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "refeicao")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Refeicao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_refeicao")
    private Integer id;

    private String nome;

    private BigDecimal valor;
}