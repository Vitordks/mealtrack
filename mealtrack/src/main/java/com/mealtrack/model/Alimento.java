package com.mealtrack.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "alimento")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Alimento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_alimento")
    private Integer id;

    private String nome;

    private String categoria;
}