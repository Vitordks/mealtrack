package com.mealtrack.controller;

import com.mealtrack.service.EventoOperacionalService;
import com.mealtrack.service.MonitoramentoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/monitoramento")
public class MonitoramentoController {

    private final MonitoramentoService monitoramentoService;
    private final EventoOperacionalService eventoService;

    public MonitoramentoController(
            MonitoramentoService monitoramentoService,
            EventoOperacionalService eventoService
    ) {
        this.monitoramentoService = monitoramentoService;
        this.eventoService = eventoService;
    }

    @GetMapping
    public List<Map<String, Object>> listar() {
        return monitoramentoService.listarAlimentosMonitorados();
    }

    @GetMapping("/summary")
    public Map<String, Object> summary() {
        return monitoramentoService.obterResumoGeral();
    }

    @GetMapping("/history")
    public List<Map<String, Object>> history() {
        return eventoService.listarRecentes();
    }

    @PostMapping("/repor/{id}")
    public Map<String, Object> repor(@PathVariable Integer id) {
        return monitoramentoService.reporAlimento(id);
    }
}
