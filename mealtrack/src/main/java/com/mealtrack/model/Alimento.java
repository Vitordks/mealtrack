package com.mealtrack.model;

import com.mealtrack.model.enums.StatusAlimento;
import com.mealtrack.util.CalculadoraDesperdicio;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "alimento")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Alimento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_alimento")
    private Integer id;

    private String nome;

    private String categoria;

    @Column(name = "valor_por_quilograma")
    private BigDecimal valorPorQuilograma;

    @Column(name = "quantidade_inicial_kg")
    private Double quantidadeInicialKg;

    @Column(name = "quantidade_atual_kg")
    private Double quantidadeAtualKg;

    @Column(name = "quantidade_desperdicado_kg")
    private Double quantidadeDesperdicadoKg;

    @Column(name = "quantidade_produzida")
    private Double quantidadeProduzida;

    @Column(name = "quantidade_consumida")
    private Double quantidadeConsumida;

    @Column(name = "quantidade_reposicao_kg")
    private Double quantidadeReposicaoKg;

    @Column(name = "valor_perdido")
    private BigDecimal valorPerdido;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private StatusAlimento status;

    /**
     * Recalcula status e valor perdido após alterações de estoque.
     */
    public void atualizarIndicadores() {
        double inicial = quantidadeInicialKg == null ? 0.0 : quantidadeInicialKg;
        double atual = quantidadeAtualKg == null ? 0.0 : quantidadeAtualKg;
        double desperdicado = quantidadeDesperdicadoKg == null ? 0.0 : quantidadeDesperdicadoKg;

        if (status != StatusAlimento.VENCIDO) {
            this.status = CalculadoraDesperdicio.calcularStatus(atual, inicial);
        }
        this.valorPerdido = CalculadoraDesperdicio.calcularValorPerdido(desperdicado, valorPorQuilograma);
    }

    public double obterConsumido() {
        return quantidadeConsumida == null ? 0.0 : quantidadeConsumida;
    }

    public double obterDesperdicado() {
        return quantidadeDesperdicadoKg == null ? 0.0 : quantidadeDesperdicadoKg;
    }

    public double obterReposicao() {
        return quantidadeReposicaoKg == null ? 0.0 : quantidadeReposicaoKg;
    }
}
