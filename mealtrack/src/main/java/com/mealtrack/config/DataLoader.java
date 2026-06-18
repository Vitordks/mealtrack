package com.mealtrack.config;

import com.mealtrack.model.Alimento;
import com.mealtrack.model.Restaurante;
import com.mealtrack.model.Usuario;
import com.mealtrack.model.enums.NivelAcesso;
import com.mealtrack.model.enums.TipoPessoa;
import com.mealtrack.repository.AlimentoRepository;
import com.mealtrack.repository.RefeicaoRepository;
import com.mealtrack.repository.RestauranteRepository;
import com.mealtrack.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {

    private final RestauranteRepository restauranteRepository;
    private final UsuarioRepository usuarioRepository;
    private final AlimentoRepository alimentoRepository;
    private final RefeicaoRepository refeicaoRepository;

    public DataLoader(RestauranteRepository restauranteRepository,
                      UsuarioRepository usuarioRepository,
                      AlimentoRepository alimentoRepository,
                      RefeicaoRepository refeicaoRepository) {
        this.restauranteRepository = restauranteRepository;
        this.usuarioRepository = usuarioRepository;
        this.alimentoRepository = alimentoRepository;
        this.refeicaoRepository = refeicaoRepository;
    }

    @Override
    public void run(String... args) {

        Restaurante restaurante;

        // =========================
        // RESTAURANTE BASE
        // =========================
        if (restauranteRepository.count() == 0) {

            restaurante = new Restaurante();
            restaurante.setNome("Restaurante Sabor Caseiro");
            restaurante.setCnpj("12345678000199");
            restaurante.setEmail("contato@sabor.com");
            restaurante.setTelefone("(71)99999-9999");
            restaurante.setEndereco("Rua Central, 100");
            restaurante.setDataFundacao(LocalDate.of(2020, 1, 10));

            restaurante = restauranteRepository.save(restaurante);
        } else {
            restaurante = restauranteRepository.findAll().get(0);
        }

        // =========================
        // USUÁRIOS (5 BASES)
        // =========================
        if (usuarioRepository.count() == 0) {

            Usuario admin = new Usuario(null, "Admin", "admin@mealtrack.com", "123456",
                    "12345678911", TipoPessoa.FISICA, NivelAcesso.ADMIN, restaurante, LocalDateTime.now());

            Usuario supervisor = new Usuario(null, "Supervisor", "sup@mealtrack.com", "123456",
                    "98765432100", TipoPessoa.FISICA, NivelAcesso.SUPERVISOR, restaurante, LocalDateTime.now());

            Usuario funcionario1 = new Usuario(null, "Carlos", "carlos@mealtrack.com", "123456",
                    "11122233344", TipoPessoa.FISICA, NivelAcesso.FUNCIONARIO, restaurante, LocalDateTime.now());

            Usuario funcionario2 = new Usuario(null, "Ana", "ana@mealtrack.com", "123456",
                    "55566677788", TipoPessoa.FISICA, NivelAcesso.FUNCIONARIO, restaurante, LocalDateTime.now());

            Usuario funcionario3 = new Usuario(null, "Beatriz", "bia@mealtrack.com", "123456",
                    "99988877766", TipoPessoa.FISICA, NivelAcesso.FUNCIONARIO, restaurante, LocalDateTime.now());

            usuarioRepository.saveAll(List.of(admin, supervisor, funcionario1, funcionario2, funcionario3));
        }

        // =========================
        // ALIMENTOS (5 BASES)
        // =========================
        if (alimentoRepository.count() == 0) {

            alimentoRepository.saveAll(List.of(
                    new Alimento(null, "Arroz", "Acompanhamento"),
                    new Alimento(null, "Feijão", "Acompanhamento"),
                    new Alimento(null, "Macarrão", "Massa"),
                    new Alimento(null, "Frango", "Proteína"),
                    new Alimento(null, "Salada", "Vegetal")
            ));
        }



        System.out.println("Seed completo carregado com sucesso!");
    }
}