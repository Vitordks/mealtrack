package com.mealtrack.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "registro_producao")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegistroProducao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_registro")
    private Integer id;


    @ManyToOne
    @JoinColumn(name = "id_alimento")
    private Alimento alimento;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    @Column(name = "quantidade_produzida")
    private Double quantidadeProduzida;

    @Column(name = "data_registro")
    private LocalDateTime dataRegistro;


}