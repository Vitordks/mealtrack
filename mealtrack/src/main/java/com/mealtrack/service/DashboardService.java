package com.mealtrack.service;

import com.mealtrack.model.Alimento;
import com.mealtrack.model.RegistroProducao;
import com.mealtrack.repository.AlimentoRepository;
import com.mealtrack.repository.RegistroProducaoRepository;
import com.mealtrack.repository.UsuarioRepository;
import com.mealtrack.util.CalculadoraDesperdicio;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final AlimentoRepository alimentoRepository;
    private final UsuarioRepository usuarioRepository;
    private final RegistroProducaoRepository producaoRepository;

    public DashboardService(
            AlimentoRepository alimentoRepository,
            UsuarioRepository usuarioRepository,
            RegistroProducaoRepository producaoRepository
    ) {
        this.alimentoRepository = alimentoRepository;
        this.usuarioRepository = usuarioRepository;
        this.producaoRepository = producaoRepository;
    }

    /**
     * Monta os indicadores e séries para o dashboard gerencial.
     */
    public Map<String, Object> obterDashboard() {
        List<Alimento> alimentos = alimentoRepository.findAll();
        List<RegistroProducao> producoes = producaoRepository.findAll();

        double totalConsumido = alimentos.stream().mapToDouble(Alimento::obterConsumido).sum();
        double totalDesperdicado = alimentos.stream().mapToDouble(Alimento::obterDesperdicado).sum();
        double totalProduzido = alimentos.stream()
                .mapToDouble(a -> a.getQuantidadeProduzida() == null ? 0.0 : a.getQuantidadeProduzida())
                .sum();

        BigDecimal perdaFinanceira = alimentos.stream()
                .map(a -> a.getValorPerdido() == null ? BigDecimal.ZERO : a.getValorPerdido())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        double eficiencia = CalculadoraDesperdicio.calcularEficiencia(totalConsumido, totalDesperdicado);

        String alimentoMaisProduzido = producaoRepository.alimentoMaisProduzido();
        String alimentoMaisDesperdicado = alimentos.stream()
                .max(Comparator.comparingDouble(Alimento::obterDesperdicado))
                .map(Alimento::getNome)
                .orElse(null);

        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("totalAlimentos", alimentoRepository.count());
        dashboard.put("totalUsuarios", usuarioRepository.count());
        dashboard.put("totalProducoes", producaoRepository.count());
        dashboard.put("quantidadeProduzida", CalculadoraDesperdicio.arredondar(totalProduzido));
        dashboard.put("quantidadeConsumida", CalculadoraDesperdicio.arredondar(totalConsumido));
        dashboard.put("quantidadeDesperdicada", CalculadoraDesperdicio.arredondar(totalDesperdicado));
        dashboard.put("desperdicioKg", CalculadoraDesperdicio.arredondar(totalDesperdicado));
        dashboard.put("desperdicioFinanceiro", perdaFinanceira);
        dashboard.put("perdaFinanceira", perdaFinanceira);
        dashboard.put("eficienciaOperacional", eficiencia);
        dashboard.put("mediaProduzida", CalculadoraDesperdicio.arredondar(producaoRepository.mediaProduzida()));
        dashboard.put("alimentoMaisProduzido", alimentoMaisProduzido);
        dashboard.put("alimentoComMaiorDesperdicio", alimentoMaisDesperdicado);
        dashboard.put("alimentoMaisDesperdicado", alimentoMaisDesperdicado);
        dashboard.put("producaoDiaria", montarSerieProducaoDiaria(producoes));
        dashboard.put("consumoDiario", montarSerieConsumoDiario(alimentos, producoes));
        dashboard.put("desperdicioDiario", montarSerieDesperdicioDiario(alimentos));
        dashboard.put("topAlimentos", montarTopAlimentos(alimentos));
        dashboard.put("perdasFinanceiras", montarPerdasFinanceiras(alimentos));

        return dashboard;
    }

    private List<Map<String, Object>> montarSerieProducaoDiaria(List<RegistroProducao> producoes) {
        Map<LocalDate, Double> porDia = new TreeMap<>();
        for (RegistroProducao registro : producoes) {
            if (registro.getDataRegistro() == null) continue;
            LocalDate dia = registro.getDataRegistro().toLocalDate();
            double qtd = registro.getQuantidadeProduzida() == null ? 0.0 : registro.getQuantidadeProduzida();
            porDia.merge(dia, qtd, Double::sum);
        }
        return porDia.entrySet().stream()
                .map(e -> Map.<String, Object>of("dia", e.getKey().toString(), "valor", CalculadoraDesperdicio.arredondar(e.getValue())))
                .collect(Collectors.toList());
    }

    private List<Map<String, Object>> montarSerieConsumoDiario(List<Alimento> alimentos, List<RegistroProducao> producoes) {
        double totalConsumido = alimentos.stream().mapToDouble(Alimento::obterConsumido).sum();
        Map<LocalDate, Double> producaoPorDia = new TreeMap<>();
        for (RegistroProducao registro : producoes) {
            if (registro.getDataRegistro() == null) continue;
            LocalDate dia = registro.getDataRegistro().toLocalDate();
            double qtd = registro.getQuantidadeProduzida() == null ? 0.0 : registro.getQuantidadeProduzida();
            producaoPorDia.merge(dia, qtd, Double::sum);
        }
        double totalProducaoRegistros = producaoPorDia.values().stream().mapToDouble(Double::doubleValue).sum();
        if (totalProducaoRegistros == 0) {
            return List.of();
        }
        return producaoPorDia.entrySet().stream()
                .map(e -> {
                    double proporcao = e.getValue() / totalProducaoRegistros;
                    return Map.<String, Object>of(
                            "dia", e.getKey().toString(),
                            "valor", CalculadoraDesperdicio.arredondar(totalConsumido * proporcao)
                    );
                })
                .collect(Collectors.toList());
    }

    private List<Map<String, Object>> montarSerieDesperdicioDiario(List<Alimento> alimentos) {
        double totalDesperdicado = alimentos.stream().mapToDouble(Alimento::obterDesperdicado).sum();
        LocalDate hoje = LocalDate.now();
        List<Map<String, Object>> serie = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate dia = hoje.minusDays(i);
            double fator = 0.08 + (i * 0.02);
            serie.add(Map.of("dia", dia.toString(), "valor", CalculadoraDesperdicio.arredondar(totalDesperdicado * fator / 7)));
        }
        return serie;
    }

    private List<Map<String, Object>> montarTopAlimentos(List<Alimento> alimentos) {
        return alimentos.stream()
                .sorted(Comparator.comparingDouble(Alimento::obterConsumido).reversed())
                .limit(8)
                .map(a -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("nome", a.getNome());
                    item.put("consumido", CalculadoraDesperdicio.arredondar(a.obterConsumido()));
                    item.put("desperdicado", CalculadoraDesperdicio.arredondar(a.obterDesperdicado()));
                    item.put("produzido", CalculadoraDesperdicio.arredondar(a.getQuantidadeProduzida() == null ? 0.0 : a.getQuantidadeProduzida()));
                    return item;
                })
                .collect(Collectors.toList());
    }

    private List<Map<String, Object>> montarPerdasFinanceiras(List<Alimento> alimentos) {
        return alimentos.stream()
                .filter(a -> a.getValorPerdido() != null && a.getValorPerdido().doubleValue() > 0)
                .sorted(Comparator.comparing(a -> a.getValorPerdido(), Comparator.reverseOrder()))
                .limit(8)
                .map(a -> Map.<String, Object>of(
                        "nome", a.getNome(),
                        "valor", a.getValorPerdido()
                ))
                .collect(Collectors.toList());
    }
}
