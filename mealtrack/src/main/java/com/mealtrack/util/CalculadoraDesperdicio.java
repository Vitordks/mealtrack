package com.mealtrack.util;

import com.mealtrack.model.enums.StatusAlimento;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Centraliza as regras de negócio de desperdício, eficiência e perdas financeiras.
 * O desperdício é somente a sobra descartada — não o que restou na bandeja.
 */
public final class CalculadoraDesperdicio {

    private CalculadoraDesperdicio() {
    }

    /**
     * Calcula a eficiência considerando consumo e descarte real.
     * Exemplo: 44 kg consumidos e 2 kg descartados = 96% de eficiência.
     */
    public static double calcularEficiencia(double quantidadeConsumida, double quantidadeDesperdicada) {
        double totalUtilizado = quantidadeConsumida + quantidadeDesperdicada;
        if (totalUtilizado <= 0) {
            return 100.0;
        }
        return arredondar((quantidadeConsumida / totalUtilizado) * 100.0);
    }

    /**
     * Calcula o valor financeiro perdido com base no descarte real.
     */
    public static BigDecimal calcularValorPerdido(double quantidadeDesperdicada, BigDecimal valorPorQuilograma) {
        BigDecimal valor = valorPorQuilograma == null ? BigDecimal.ZERO : valorPorQuilograma;
        return valor.multiply(BigDecimal.valueOf(Math.max(0.0, quantidadeDesperdicada)))
                .setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Define o status operacional com base na quantidade restante na bandeja.
     */
    public static StatusAlimento calcularStatus(double quantidadeAtual, double quantidadeInicial) {
        if (quantidadeInicial <= 0) {
            return StatusAlimento.DISPONIVEL;
        }
        if (quantidadeAtual <= 0) {
            return StatusAlimento.ESGOTADO;
        }
        double percentualRestante = (quantidadeAtual / quantidadeInicial) * 100.0;
        if (percentualRestante <= 10) {
            return StatusAlimento.CRITICO;
        }
        if (percentualRestante <= 40) {
            return StatusAlimento.ATENCAO;
        }
        return StatusAlimento.DISPONIVEL;
    }

    public static double arredondar(double valor) {
        return Math.round(valor * 10.0) / 10.0;
    }
}
