package com.mealtrack.service;

import com.mealtrack.model.Alimento;
import com.mealtrack.model.RegistroProducao;
import com.mealtrack.model.Restaurante;
import com.mealtrack.model.Usuario;
import com.mealtrack.model.enums.NivelAcesso;
import com.mealtrack.model.enums.StatusAlimento;
import com.mealtrack.model.enums.TipoEvento;
import com.mealtrack.repository.AlimentoRepository;
import com.mealtrack.repository.RegistroProducaoRepository;
import com.mealtrack.repository.RestauranteRepository;
import com.mealtrack.repository.UsuarioRepository;
import com.mealtrack.util.CalculadoraDesperdicio;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SimulacaoSemanalService {

    private final AlimentoRepository alimentoRepository;
    private final UsuarioRepository usuarioRepository;
    private final RegistroProducaoRepository producaoRepository;
    private final RestauranteRepository restauranteRepository;
    private final EventoOperacionalService eventoService;
    private final Random random = new Random();

    public SimulacaoSemanalService(
            AlimentoRepository alimentoRepository,
            UsuarioRepository usuarioRepository,
            RegistroProducaoRepository producaoRepository,
            RestauranteRepository restauranteRepository,
            EventoOperacionalService eventoService
    ) {
        this.alimentoRepository = alimentoRepository;
        this.usuarioRepository = usuarioRepository;
        this.producaoRepository = producaoRepository;
        this.restauranteRepository = restauranteRepository;
        this.eventoService = eventoService;
    }

    private void criarAlimentosBasicos() {
        Object[][] dados = {
                {"Arroz Branco", "Acompanhamento", "8.50", 25.0},
                {"Feijão Carioca", "Acompanhamento", "6.00", 20.0},
                {"Frango Grelhado", "Proteína", "25.00", 20.0},
                {"Salada Verde", "Vegetal", "5.50", 10.0},
                {"Macarrão ao Molho", "Massa", "7.00", 15.0},
        };

        for (Object[] d : dados) {
            BigDecimal valorKg = new BigDecimal((String) d[2]);
            Alimento alimento = Alimento.builder()
                    .nome((String) d[0])
                    .categoria((String) d[1])
                    .valorPorQuilograma(valorKg)
                    .quantidadeInicialKg((double) d[3])
                    .quantidadeAtualKg((double) d[3])
                    .quantidadeProduzida(0.0)
                    .quantidadeConsumida(0.0)
                    .quantidadeDesperdicadoKg(0.0)
                    .build();
            alimento.atualizarIndicadores();
            alimentoRepository.save(alimento);
        }
    }

    /**
     * Executa uma semana completa de operação, alterando dados reais no banco:
     * produções, consumos, reposições, descartes e eventos operacionais.
     */
    @Transactional
    public Map<String, Object> executarSimulacao() {
        // Criar alimentos básicos se não existirem
        if (alimentoRepository.count() == 0) {
            criarAlimentosBasicos();
        }
        
        List<Alimento> alimentos = alimentoRepository.findAll();
        List<Usuario> funcionarios = usuarioRepository.findAll().stream()
                .filter(u -> u.getNivelAcesso() == NivelAcesso.FUNCIONARIO)
                .collect(Collectors.toList());

        if (funcionarios.isEmpty()) {
            funcionarios = usuarioRepository.findAll();
        }

        Restaurante restaurante = restauranteRepository.findAll().stream().findFirst().orElse(null);
        LocalDate inicioSemana = LocalDate.now().minusDays(6);

        int totalProducoes = 0;
        int totalEventos = 0;
        double totalDesperdicado = 0;
        double totalConsumido = 0;
        double totalProduzido = 0;

        for (int dia = 0; dia < 7; dia++) {
            LocalDate dataAtual = inicioSemana.plusDays(dia);

            for (Alimento alimento : alimentos) {
                double fatorAlimento = fatorComportamento(alimento);
                Usuario funcionario = funcionarios.get(random.nextInt(funcionarios.size()));

                // Produção matinal
                double producao = gerarProducao(alimento) * fatorAlimento;
                if (producao > 0.5) {
                    LocalDateTime horaProducao = dataAtual.atTime(gerarHorario(6, 9));
                    registrarProducao(alimento, funcionario, producao, horaProducao);
                    aplicarProducao(alimento, producao);
                    eventoService.registrar(
                            TipoEvento.NOVA_PRODUCAO,
                            String.format("Nova produção de %s: %.1f kg", alimento.getNome(), producao),
                            alimento, restaurante, horaProducao
                    );
                    totalProducoes++;
                    totalEventos++;
                    totalProduzido += producao;
                }

                // Consumo durante o expediente
                double consumo = calcularConsumo(alimento, producao) * fatorAlimento;
                aplicarConsumo(alimento, consumo);
                totalConsumido += consumo;

                if (consumo > producao * 0.6) {
                    LocalDateTime horaPico = dataAtual.atTime(gerarHorario(11, 13));
                    eventoService.registrar(
                            TipoEvento.PICO_CONSUMO,
                            String.format("Pico de consumo em %s", alimento.getNome()),
                            alimento, restaurante, horaPico
                    );
                    totalEventos++;
                }

                // Reposição quando necessário
                double atual = alimento.getQuantidadeAtualKg() == null ? 0.0 : alimento.getQuantidadeAtualKg();
                double inicial = alimento.getQuantidadeInicialKg() == null ? 10.0 : alimento.getQuantidadeInicialKg();
                if (atual < inicial * 0.3 && random.nextDouble() < 0.7) {
                    double reposicao = inicial * (0.5 + random.nextDouble() * 0.4);
                    LocalDateTime horaReposicao = dataAtual.atTime(gerarHorario(10, 14));
                    aplicarReposicao(alimento, reposicao);
                    eventoService.registrar(
                            TipoEvento.REPOSICAO,
                            String.format("Reposição de %s: %.1f kg", alimento.getNome(), reposicao),
                            alimento, restaurante, horaReposicao
                    );
                    totalEventos++;
                }

                // Troca de bandeja
                if (random.nextDouble() < 0.15) {
                    LocalDateTime horaTroca = dataAtual.atTime(gerarHorario(12, 15));
                    eventoService.registrar(
                            TipoEvento.TROCA_BANDEJA,
                            String.format("Troca de bandeja de %s", alimento.getNome()),
                            alimento, restaurante, horaTroca
                    );
                    totalEventos++;
                }

                // Nível crítico
                alimento.atualizarIndicadores();
                if (alimento.getStatus() == StatusAlimento.CRITICO) {
                    LocalDateTime horaCritico = dataAtual.atTime(gerarHorario(13, 16));
                    eventoService.registrar(
                            TipoEvento.NIVEL_CRITICO,
                            String.format("%s atingiu nível crítico", alimento.getNome()),
                            alimento, restaurante, horaCritico
                    );
                    totalEventos++;
                }

                // Descarte ao final do dia — somente a sobra descartada é desperdício
                double restante = alimento.getQuantidadeAtualKg() == null ? 0.0 : alimento.getQuantidadeAtualKg();
                if (restante > 0.3) {
                    double taxaDescarte = taxaDescarte(alimento);
                    double descarte = restante * taxaDescarte;
                    if (descarte > 0.1) {
                        LocalDateTime horaDescarte = dataAtual.atTime(gerarHorario(17, 20));
                        aplicarDescarte(alimento, descarte);
                        totalDesperdicado += descarte;
                        eventoService.registrar(
                                TipoEvento.ALIMENTO_DESCARTADO,
                                String.format("Descarte de %s: %.1f kg", alimento.getNome(), descarte),
                                alimento, restaurante, horaDescarte
                        );
                        totalEventos++;
                    }
                }

                // Alguns alimentos vencem
                if (random.nextDouble() < 0.03) {
                    alimento.setStatus(StatusAlimento.VENCIDO);
                    alimento.setQuantidadeAtualKg(0.0);
                    double descarteVencido = restante;
                    if (descarteVencido > 0) {
                        aplicarDescarte(alimento, descarteVencido);
                        totalDesperdicado += descarteVencido;
                    }
                    LocalDateTime horaVencido = dataAtual.atTime(gerarHorario(18, 21));
                    eventoService.registrar(
                            TipoEvento.ALIMENTO_DESCARTADO,
                            String.format("%s venceu e foi descartado", alimento.getNome()),
                            alimento, restaurante, horaVencido
                    );
                    totalEventos++;
                }

                alimento.atualizarIndicadores();
                alimentoRepository.save(alimento);
            }

            LocalDateTime horaEncerramento = dataAtual.atTime(20, 30);
            eventoService.registrar(
                    TipoEvento.PRODUCAO_ENCERRADA,
                    String.format("Produção encerrada — %s", formatarDia(dataAtual)),
                    null, restaurante, horaEncerramento
            );
            totalEventos++;
        }

        BigDecimal perdaFinanceira = alimentoRepository.findAll().stream()
                .map(a -> a.getValorPerdido() == null ? BigDecimal.ZERO : a.getValorPerdido())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        double eficiencia = CalculadoraDesperdicio.calcularEficiencia(totalConsumido, totalDesperdicado);

        Map<String, Object> resultado = new HashMap<>();
        resultado.put("mensagem", "Simulação de 7 dias executada com sucesso.");
        resultado.put("diasSimulados", 7);
        resultado.put("totalProducoes", totalProducoes);
        resultado.put("totalEventos", totalEventos);
        resultado.put("totalProduzido", CalculadoraDesperdicio.arredondar(totalProduzido));
        resultado.put("totalConsumido", CalculadoraDesperdicio.arredondar(totalConsumido));
        resultado.put("totalDesperdicado", CalculadoraDesperdicio.arredondar(totalDesperdicado));
        resultado.put("perdaFinanceira", perdaFinanceira);
        resultado.put("eficiencia", eficiencia);
        resultado.put("executadoEm", LocalDateTime.now().toString());

        return resultado;
    }

    private void registrarProducao(Alimento alimento, Usuario funcionario, double quantidade, LocalDateTime dataHora) {
        RegistroProducao registro = new RegistroProducao();
        registro.setAlimento(alimento);
        registro.setUsuario(funcionario);
        registro.setQuantidadeProduzida(quantidade);
        registro.setDataRegistro(dataHora);
        producaoRepository.save(registro);
    }

    private void aplicarProducao(Alimento alimento, double quantidade) {
        double produzido = alimento.getQuantidadeProduzida() == null ? 0.0 : alimento.getQuantidadeProduzida();
        double atual = alimento.getQuantidadeAtualKg() == null ? 0.0 : alimento.getQuantidadeAtualKg();
        alimento.setQuantidadeProduzida(produzido + quantidade);
        alimento.setQuantidadeAtualKg(atual + quantidade);
        if (alimento.getStatus() == StatusAlimento.ESGOTADO || alimento.getStatus() == StatusAlimento.VENCIDO) {
            alimento.setStatus(StatusAlimento.DISPONIVEL);
        }
    }

    private void aplicarConsumo(Alimento alimento, double quantidade) {
        double atual = alimento.getQuantidadeAtualKg() == null ? 0.0 : alimento.getQuantidadeAtualKg();
        double consumido = alimento.obterConsumido();
        double consumoReal = Math.min(quantidade, atual);
        alimento.setQuantidadeAtualKg(Math.max(0.0, atual - consumoReal));
        alimento.setQuantidadeConsumida(consumido + consumoReal);
    }

    private void aplicarReposicao(Alimento alimento, double quantidade) {
        double atual = alimento.getQuantidadeAtualKg() == null ? 0.0 : alimento.getQuantidadeAtualKg();
        alimento.setQuantidadeAtualKg(atual + quantidade);
        alimento.setQuantidadeReposicaoKg(alimento.obterReposicao() + quantidade);
    }

    /**
     * Registra descarte real — única fonte de desperdício no sistema.
     */
    private void aplicarDescarte(Alimento alimento, double quantidade) {
        double atual = alimento.getQuantidadeAtualKg() == null ? 0.0 : alimento.getQuantidadeAtualKg();
        double descarteReal = Math.min(quantidade, atual);
        alimento.setQuantidadeAtualKg(Math.max(0.0, atual - descarteReal));
        alimento.setQuantidadeDesperdicadoKg(alimento.obterDesperdicado() + descarteReal);
    }

    private double gerarProducao(Alimento alimento) {
        double base = alimento.getQuantidadeInicialKg() == null ? 10.0 : alimento.getQuantidadeInicialKg();
        return base * (0.4 + random.nextDouble() * 0.6);
    }

    private double calcularConsumo(Alimento alimento, double producao) {
        return producao * (0.55 + random.nextDouble() * 0.35);
    }

    private double fatorComportamento(Alimento alimento) {
        String nome = alimento.getNome() != null ? alimento.getNome().toLowerCase() : "";
        if (nome.contains("salada") || nome.contains("legume")) return 0.7 + random.nextDouble() * 0.3;
        if (nome.contains("frango") || nome.contains("carne")) return 0.9 + random.nextDouble() * 0.4;
        return 0.6 + random.nextDouble() * 0.5;
    }

    private double taxaDescarte(Alimento alimento) {
        String categoria = alimento.getCategoria() != null ? alimento.getCategoria().toLowerCase() : "";
        if (categoria.contains("vegetal") || categoria.contains("salada")) return 0.25 + random.nextDouble() * 0.25;
        if (categoria.contains("prote")) return 0.08 + random.nextDouble() * 0.12;
        return 0.10 + random.nextDouble() * 0.15;
    }

    private LocalTime gerarHorario(int horaMin, int horaMax) {
        int hora = horaMin + random.nextInt(horaMax - horaMin + 1);
        int minuto = random.nextInt(60);
        return LocalTime.of(hora, minuto);
    }

    private String formatarDia(LocalDate data) {
        return data.format(java.time.format.DateTimeFormatter.ofPattern("dd/MM"));
    }
}
