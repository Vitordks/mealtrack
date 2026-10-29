package com.mealtrack.config;

import com.mealtrack.model.*;
import com.mealtrack.model.enums.*;
import com.mealtrack.repository.*;
import com.mealtrack.util.CalculadoraDesperdicio;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * Carrega dados mínimos iniciais para o sistema funcionar.
 * Os dados de demonstração serão carregados através da simulação.
 */
@Component
public class DataLoader implements CommandLineRunner {

    private final RestauranteRepository restauranteRepository;
    private final UsuarioRepository usuarioRepository;
    private final AlimentoRepository alimentoRepository;
    private final RegistroProducaoRepository producaoRepository;
    private final EventoOperacionalRepository eventoRepository;
    private final PasswordEncoder passwordEncoder;
    private final Random random = new Random(2026);

    public DataLoader(
            RestauranteRepository restauranteRepository,
            UsuarioRepository usuarioRepository,
            AlimentoRepository alimentoRepository,
            RegistroProducaoRepository producaoRepository,
            EventoOperacionalRepository eventoRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.restauranteRepository = restauranteRepository;
        this.usuarioRepository = usuarioRepository;
        this.alimentoRepository = alimentoRepository;
        this.producaoRepository = producaoRepository;
        this.eventoRepository = eventoRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (restauranteRepository.count() > 0) {
            return;
        }

        Restaurante restaurante = criarRestaurante();
        List<Usuario> usuarios = criarUsuariosMinimos(restaurante);

        System.out.println("Dados mínimos carregados: 1 restaurante, " + usuarios.size() + " usuários.");
        System.out.println("Execute a simulação para carregar dados de demonstração.");
    }

    private Restaurante criarRestaurante() {
        Restaurante restaurante = new Restaurante();
        restaurante.setNome("Restaurante Sabor Caseiro");
        restaurante.setCnpj("12.345.678/0001-99");
        restaurante.setEmail("contato@saborcaseiro.com.br");
        restaurante.setTelefone("(71) 3344-5566");
        restaurante.setEndereco("Av. ACM, 1250 — Salvador, BA");
        restaurante.setDataFundacao(LocalDate.of(2018, 3, 15));
        return restauranteRepository.save(restaurante);
    }

    private List<Usuario> criarUsuariosMinimos(Restaurante restaurante) {
        String senha = passwordEncoder.encode("123456");
        LocalDateTime agora = LocalDateTime.now();

        List<Usuario> usuarios = new ArrayList<>();
        usuarios.add(criarUsuario("Ricardo Almeida", "admin@mealtrack.com", "529.982.247-25", NivelAcesso.ADMIN, restaurante, senha, agora));
        usuarios.add(criarUsuario("Fernanda Lima", "supervisor@mealtrack.com", "390.533.447-05", NivelAcesso.SUPERVISOR, restaurante, senha, agora));
        usuarios.add(criarUsuario("Carlos Eduardo", "carlos@mealtrack.com", "111.222.333-44", NivelAcesso.FUNCIONARIO, restaurante, senha, agora));

        return usuarioRepository.saveAll(usuarios);
    }

    private List<Usuario> criarUsuarios(Restaurante restaurante) {
        String senha = passwordEncoder.encode("123456");
        LocalDateTime agora = LocalDateTime.now().minusMonths(6);

        List<Usuario> usuarios = new ArrayList<>();
        usuarios.add(criarUsuario("Ricardo Almeida", "admin@mealtrack.com", "529.982.247-25", NivelAcesso.ADMIN, restaurante, senha, agora));
        usuarios.add(criarUsuario("Fernanda Lima", "supervisor@mealtrack.com", "390.533.447-05", NivelAcesso.SUPERVISOR, restaurante, senha, agora.plusDays(1)));
        usuarios.add(criarUsuario("Carlos Eduardo", "carlos@mealtrack.com", "111.222.333-44", NivelAcesso.FUNCIONARIO, restaurante, senha, agora.plusDays(2)));
        usuarios.add(criarUsuario("Ana Paula", "ana@mealtrack.com", "555.666.777-88", NivelAcesso.FUNCIONARIO, restaurante, senha, agora.plusDays(3)));
        usuarios.add(criarUsuario("Beatriz Santos", "beatriz@mealtrack.com", "999.888.777-66", NivelAcesso.FUNCIONARIO, restaurante, senha, agora.plusDays(4)));
        usuarios.add(criarUsuario("Marcos Oliveira", "marcos@mealtrack.com", "123.456.789-09", NivelAcesso.FUNCIONARIO, restaurante, senha, agora.plusDays(5)));
        usuarios.add(criarUsuario("Juliana Costa", "juliana@mealtrack.com", "987.654.321-00", NivelAcesso.FUNCIONARIO, restaurante, senha, agora.plusDays(6)));
        usuarios.add(criarUsuario("Pedro Henrique", "pedro@mealtrack.com", "456.789.123-45", NivelAcesso.FUNCIONARIO, restaurante, senha, agora.plusDays(7)));
        usuarios.add(criarUsuario("Camila Rocha", "camila@mealtrack.com", "321.654.987-12", NivelAcesso.FUNCIONARIO, restaurante, senha, agora.plusDays(8)));
        usuarios.add(criarUsuario("Lucas Ferreira", "lucas@mealtrack.com", "654.321.789-30", NivelAcesso.FUNCIONARIO, restaurante, senha, agora.plusDays(9)));
        usuarios.add(criarUsuario("Patrícia Gomes", "patricia@mealtrack.com", "789.123.456-78", NivelAcesso.FUNCIONARIO, restaurante, senha, agora.plusDays(10)));
        usuarios.add(criarUsuario("Rafael Souza", "rafael@mealtrack.com", "147.258.369-00", NivelAcesso.FUNCIONARIO, restaurante, senha, agora.plusDays(11)));
        usuarios.add(criarUsuario("Mariana Dias", "mariana@mealtrack.com", "258.369.147-11", NivelAcesso.FUNCIONARIO, restaurante, senha, agora.plusDays(12)));

        return usuarioRepository.saveAll(usuarios);
    }

    private Usuario criarUsuario(String nome, String email, String cpf, NivelAcesso nivel,
                                  Restaurante restaurante, String senha, LocalDateTime data) {
        Usuario usuario = new Usuario();
        usuario.setNome(nome);
        usuario.setEmail(email);
        usuario.setSenha(senha);
        usuario.setDocumento(cpf);
        usuario.setTipoPessoa(TipoPessoa.FISICA);
        usuario.setNivelAcesso(nivel);
        usuario.setRestaurante(restaurante);
        usuario.setDataCadastro(data);
        return usuario;
    }

    private List<Alimento> criarAlimentos() {
        Object[][] dados = {
                {"Arroz Branco", "Acompanhamento", "8.50", 25.0, 18.5, 42.0, 38.5, 2.1, 0.8},
                {"Feijão Carioca", "Acompanhamento", "6.00", 20.0, 14.2, 35.0, 30.8, 1.5, 0.5},
                {"Feijão Preto", "Acompanhamento", "6.50", 18.0, 12.0, 30.0, 26.0, 1.2, 0.4},
                {"Macarrão ao Molho", "Massa", "7.00", 15.0, 10.5, 28.0, 24.0, 1.8, 0.6},
                {"Lasanha", "Massa", "18.00", 12.0, 8.0, 22.0, 19.5, 1.0, 0.3},
                {"Frango Grelhado", "Proteína", "25.00", 20.0, 12.5, 45.0, 40.0, 2.5, 0.8},
                {"Carne de Panela", "Proteína", "32.00", 18.0, 10.0, 38.0, 34.0, 2.0, 0.6},
                {"Peixe Assado", "Proteína", "28.00", 14.0, 8.5, 25.0, 22.0, 1.5, 0.4},
                {"Salada Verde", "Vegetal", "5.50", 10.0, 5.0, 18.0, 12.0, 4.5, 1.2},
                {"Salada de Beterraba", "Vegetal", "6.00", 8.0, 4.0, 15.0, 10.0, 3.5, 1.0},
                {"Purê de Batata", "Acompanhamento", "7.50", 16.0, 11.0, 30.0, 26.5, 1.8, 0.5},
                {"Farofa", "Acompanhamento", "9.00", 12.0, 8.5, 24.0, 21.0, 1.2, 0.3},
                {"Couve Refogada", "Vegetal", "4.50", 8.0, 4.5, 16.0, 13.5, 1.5, 0.4},
                {"Abóbora Refogada", "Vegetal", "5.00", 10.0, 6.0, 18.0, 15.0, 1.8, 0.5},
                {"Strogonoff de Frango", "Proteína", "22.00", 16.0, 9.0, 32.0, 28.0, 2.2, 0.7},
                {"Moqueca de Peixe", "Proteína", "30.00", 14.0, 7.5, 26.0, 22.5, 1.8, 0.5},
                {"Vatapá", "Acompanhamento", "12.00", 10.0, 6.5, 20.0, 17.0, 1.5, 0.4},
                {"Acarajé", "Entrada", "15.00", 8.0, 5.0, 16.0, 13.5, 1.2, 0.3},
                {"Bobó de Camarão", "Proteína", "35.00", 12.0, 6.0, 22.0, 18.5, 2.0, 0.5},
                {"Sopa de Legumes", "Sopa", "6.50", 14.0, 9.0, 28.0, 24.0, 2.5, 0.8},
                {"Polenta", "Acompanhamento", "5.00", 12.0, 8.0, 22.0, 19.0, 1.5, 0.4},
                {"Mandioca Cozida", "Acompanhamento", "4.00", 15.0, 10.0, 28.0, 24.5, 1.8, 0.5},
                {"Quiabo Refogado", "Vegetal", "5.50", 8.0, 4.0, 14.0, 11.5, 1.8, 0.5},
                {"Berinjela Empanada", "Vegetal", "8.00", 10.0, 6.5, 18.0, 15.0, 1.5, 0.4},
                {"Pudim", "Sobremesa", "12.00", 6.0, 3.5, 12.0, 10.5, 0.8, 0.2},
        };

        List<Alimento> alimentos = new ArrayList<>();
        for (Object[] d : dados) {
            double desperdicado = (double) d[8];
            BigDecimal valorKg = new BigDecimal((String) d[2]);
            Alimento alimento = Alimento.builder()
                    .nome((String) d[0])
                    .categoria((String) d[1])
                    .valorPorQuilograma(valorKg)
                    .quantidadeInicialKg((double) d[3])
                    .quantidadeAtualKg((double) d[4])
                    .quantidadeProduzida((double) d[5])
                    .quantidadeConsumida((double) d[6])
                    .quantidadeReposicaoKg((double) d[7])
                    .quantidadeDesperdicadoKg(desperdicado)
                    .valorPerdido(CalculadoraDesperdicio.calcularValorPerdido(desperdicado, valorKg))
                    .status(CalculadoraDesperdicio.calcularStatus((double) d[4], (double) d[3]))
                    .build();
            alimentos.add(alimento);
        }

        return alimentoRepository.saveAll(alimentos);
    }

    private void criarProducoes(List<Alimento> alimentos, List<Usuario> usuarios) {
        List<Usuario> funcionarios = usuarios.stream()
                .filter(u -> u.getNivelAcesso() == NivelAcesso.FUNCIONARIO)
                .toList();

        List<RegistroProducao> producoes = new ArrayList<>();
        LocalDate inicio = LocalDate.now().minusDays(14);

        for (int dia = 0; dia < 14; dia++) {
            int producoesNoDia = 12 + random.nextInt(8);
            for (int i = 0; i < producoesNoDia; i++) {
                Alimento alimento = alimentos.get(random.nextInt(alimentos.size()));
                Usuario funcionario = funcionarios.get(random.nextInt(funcionarios.size()));
                double quantidade = 2.0 + random.nextDouble() * 15.0;
                LocalTime hora = LocalTime.of(6 + random.nextInt(6), random.nextInt(60));

                RegistroProducao registro = new RegistroProducao();
                registro.setAlimento(alimento);
                registro.setUsuario(funcionario);
                registro.setQuantidadeProduzida(Math.round(quantidade * 10.0) / 10.0);
                registro.setDataRegistro(inicio.plusDays(dia).atTime(hora));
                producoes.add(registro);
            }
        }

        producaoRepository.saveAll(producoes);
    }

    private void criarEventosHistoricos(List<Alimento> alimentos, Restaurante restaurante) {
        List<EventoOperacional> eventos = new ArrayList<>();
        LocalDate hoje = LocalDate.now();

        Object[][] historico = {
                {0, TipoEvento.REPOSICAO, "Reposição de arroz", 9, 10},
                {1, TipoEvento.NIVEL_CRITICO, "Frango atingiu nível crítico", 9, 42},
                {2, TipoEvento.NOVA_PRODUCAO, "Nova produção iniciada", 10, 35},
                {3, TipoEvento.ALIMENTO_DESCARTADO, "Descarte realizado — salada verde", 11, 18},
                {4, TipoEvento.REPOSICAO, "Reposição de feijão carioca", 12, 0},
                {5, TipoEvento.PICO_CONSUMO, "Pico de consumo no frango grelhado", 12, 30},
                {6, TipoEvento.TROCA_BANDEJA, "Troca de bandeja — macarrão", 13, 15},
                {7, TipoEvento.PRODUCAO_ENCERRADA, "Produção encerrada", 20, 30},
                {8, TipoEvento.REPOSICAO, "Reposição de carne de panela", 10, 20},
                {0, TipoEvento.ALIMENTO_DESCARTADO, "Descarte de sobra — arroz branco", 17, 45},
                {9, TipoEvento.NIVEL_CRITICO, "Salada verde em nível crítico", 14, 10},
                {5, TipoEvento.PICO_CONSUMO, "Pico de consumo — strogonoff", 12, 45},
        };

        for (Object[] ev : historico) {
            int alimentoIdx = (int) ev[0];
            TipoEvento tipo = (TipoEvento) ev[1];
            String descricao = (String) ev[2];
            int hora = (int) ev[3];
            int minuto = (int) ev[4];

            eventos.add(EventoOperacional.builder()
                    .tipo(tipo)
                    .descricao(descricao)
                    .alimento(alimentos.get(alimentoIdx))
                    .restaurante(restaurante)
                    .dataHora(hoje.atTime(hora, minuto))
                    .build());
        }

        eventoRepository.saveAll(eventos);
    }
}
