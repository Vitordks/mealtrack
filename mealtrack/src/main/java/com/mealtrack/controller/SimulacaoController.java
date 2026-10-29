package com.mealtrack.controller;

import com.mealtrack.service.SimulacaoSemanalService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/simulacao")
public class SimulacaoController {

    private final SimulacaoSemanalService simulacaoService;

    public SimulacaoController(SimulacaoSemanalService simulacaoService) {
        this.simulacaoService = simulacaoService;
    }

    /**
     * Executa simulação de uma semana completa, evoluindo todos os dados do sistema.
     */
    @PostMapping("/executar")
    public Map<String, Object> executarSimulacao() {
        return simulacaoService.executarSimulacao();
    }
}
