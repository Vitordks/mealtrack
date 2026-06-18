package com.mealtrack.controller;

import com.mealtrack.repository.AlimentoRepository;
import com.mealtrack.repository.UsuarioRepository;
import com.mealtrack.repository.RegistroProducaoRepository;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    private final AlimentoRepository alimentoRepository;
    private final UsuarioRepository usuarioRepository;
    private final RegistroProducaoRepository producaoRepository;

    public DashboardController(
            AlimentoRepository alimentoRepository,
            UsuarioRepository usuarioRepository,
            RegistroProducaoRepository producaoRepository) {

        this.alimentoRepository = alimentoRepository;
        this.usuarioRepository = usuarioRepository;
        this.producaoRepository = producaoRepository;
    }

    @GetMapping
    public Map<String, Object> obterDashboard() {

        Map<String, Object> dashboard = new HashMap<>();

        dashboard.put("totalAlimentos", alimentoRepository.count());

        dashboard.put("totalUsuarios", usuarioRepository.count());

        dashboard.put("totalProducoes", producaoRepository.count());

        dashboard.put("quantidadeProduzida",
                producaoRepository.totalProduzido());

        return dashboard;
    }
}