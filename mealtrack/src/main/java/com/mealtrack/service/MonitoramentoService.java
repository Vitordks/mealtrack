package com.mealtrack.service;

import com.mealtrack.model.Alimento;
import com.mealtrack.model.Restaurante;
import com.mealtrack.model.enums.TipoEvento;
import com.mealtrack.repository.AlimentoRepository;
import com.mealtrack.repository.RestauranteRepository;
import com.mealtrack.util.CalculadoraDesperdicio;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MonitoramentoService {

    private final AlimentoRepository alimentoRepository;
    private final RestauranteRepository restauranteRepository;
    private final EventoOperacionalService eventoService;

    public MonitoramentoService(
            AlimentoRepository alimentoRepository,
            RestauranteRepository restauranteRepository,
            EventoOperacionalService eventoService
    ) {
        this.alimentoRepository = alimentoRepository;
        this.restauranteRepository = restauranteRepository;
        this.eventoService = eventoService;
    }

    /**
     * Lista todos os alimentos com indicadores operacionais para a central de monitoramento.
     */
    public List<Map<String, Object>> listarAlimentosMonitorados() {
        return alimentoRepository.findAll().stream()
                .map(this::montarDetalheAlimento)
                .toList();
    }

    /**
     * Monta o resumo geral da operação com destaques e indicadores agregados.
     */
    public Map<String, Object> obterResumoGeral() {
        List<Alimento> alimentos = alimentoRepository.findAll();

        double totalProduzido = alimentos.stream()
                .mapToDouble(a -> a.getQuantidadeProduzida() == null ? 0.0 : a.getQuantidadeProduzida())
                .sum();
        double totalConsumido = alimentos.stream().mapToDouble(Alimento::obterConsumido).sum();
        double totalDesperdicado = alimentos.stream().mapToDouble(Alimento::obterDesperdicado).sum();
        double totalReposicao = alimentos.stream().mapToDouble(Alimento::obterReposicao).sum();
        double totalAtual = alimentos.stream()
                .mapToDouble(a -> a.getQuantidadeAtualKg() == null ? 0.0 : a.getQuantidadeAtualKg())
                .sum();

        BigDecimal perdaFinanceira = alimentos.stream()
                .map(a -> a.getValorPerdido() == null ? BigDecimal.ZERO : a.getValorPerdido())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        double eficienciaMedia = CalculadoraDesperdicio.calcularEficiencia(totalConsumido, totalDesperdicado);

        Alimento maiorDesperdicio = alimentos.stream()
                .max(Comparator.comparingDouble(Alimento::obterDesperdicado))
                .orElse(null);

        Alimento maiorConsumo = alimentos.stream()
                .max(Comparator.comparingDouble(Alimento::obterConsumido))
                .orElse(null);

        Alimento maiorLucroPerdido = alimentos.stream()
                .max(Comparator.comparing(a -> a.getValorPerdido() == null ? BigDecimal.ZERO : a.getValorPerdido()))
                .orElse(null);

        Alimento maisProduzido = alimentos.stream()
                .max(Comparator.comparingDouble(a -> a.getQuantidadeProduzida() == null ? 0.0 : a.getQuantidadeProduzida()))
                .orElse(null);

        Map<String, Object> resumo = new HashMap<>();
        resumo.put("totalProduzido", CalculadoraDesperdicio.arredondar(totalProduzido));
        resumo.put("totalConsumido", CalculadoraDesperdicio.arredondar(totalConsumido));
        resumo.put("totalDesperdicado", CalculadoraDesperdicio.arredondar(totalDesperdicado));
        resumo.put("totalReposicao", CalculadoraDesperdicio.arredondar(totalReposicao));
        resumo.put("totalAtual", CalculadoraDesperdicio.arredondar(totalAtual));
        resumo.put("perdaFinanceira", perdaFinanceira);
        resumo.put("eficienciaMedia", eficienciaMedia);
        resumo.put("alimentoMaiorDesperdicio", maiorDesperdicio != null ? maiorDesperdicio.getNome() : null);
        resumo.put("alimentoMaiorConsumo", maiorConsumo != null ? maiorConsumo.getNome() : null);
        resumo.put("alimentoMaiorLucroPerdido", maiorLucroPerdido != null ? maiorLucroPerdido.getNome() : null);
        resumo.put("alimentoMaisProduzido", maisProduzido != null ? maisProduzido.getNome() : null);
        resumo.put("alimentoMaisConsumido", maiorConsumo != null ? maiorConsumo.getNome() : null);
        resumo.put("alimentoMaisDesperdicado", maiorDesperdicio != null ? maiorDesperdicio.getNome() : null);

        return resumo;
    }

    /**
     * Realiza reposição de um alimento na bandeja.
     */
    public Map<String, Object> reporAlimento(Integer id) {
        Alimento alimento = alimentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alimento não encontrado."));

        double reposicao = alimento.getQuantidadeInicialKg() == null ? 0.0 : alimento.getQuantidadeInicialKg();
        alimento.setQuantidadeAtualKg(reposicao);
        alimento.setQuantidadeReposicaoKg(alimento.obterReposicao() + reposicao);
        alimento.atualizarIndicadores();
        alimentoRepository.save(alimento);

        Restaurante restaurante = restauranteRepository.findAll().stream().findFirst().orElse(null);
        eventoService.registrar(
                TipoEvento.REPOSICAO,
                String.format("Reposição de %s: %.1f kg", alimento.getNome(), reposicao),
                alimento,
                restaurante,
                LocalDateTime.now()
        );

        return montarDetalheAlimento(alimento);
    }

    private Map<String, Object> montarDetalheAlimento(Alimento alimento) {
        double inicial = alimento.getQuantidadeInicialKg() == null ? 0.0 : alimento.getQuantidadeInicialKg();
        double atual = alimento.getQuantidadeAtualKg() == null ? 0.0 : alimento.getQuantidadeAtualKg();
        double consumido = alimento.obterConsumido();
        double desperdicado = alimento.obterDesperdicado();
        double reposicao = alimento.obterReposicao();
        double eficiencia = CalculadoraDesperdicio.calcularEficiencia(consumido, desperdicado);

        Map<String, Object> detalhe = new HashMap<>();
        detalhe.put("id", alimento.getId());
        detalhe.put("nome", alimento.getNome());
        detalhe.put("categoria", alimento.getCategoria());
        detalhe.put("quantidadeInicialKg", inicial);
        detalhe.put("quantidadeAtualKg", atual);
        detalhe.put("quantidadeConsumida", consumido);
        detalhe.put("quantidadeReposicaoKg", reposicao);
        detalhe.put("quantidadeDesperdicada", desperdicado);
        detalhe.put("desperdicioKg", desperdicado);
        detalhe.put("valorPerdido", alimento.getValorPerdido());
        detalhe.put("desperdicioFinanceiro", alimento.getValorPerdido());
        detalhe.put("eficiencia", eficiencia);
        detalhe.put("status", alimento.getStatus() != null ? alimento.getStatus().name() : "DISPONIVEL");
        detalhe.put("valorPorQuilograma", alimento.getValorPorQuilograma());
        detalhe.put("percentualRestante", inicial == 0 ? 0.0 : CalculadoraDesperdicio.arredondar((atual / inicial) * 100.0));
        return detalhe;
    }
}
