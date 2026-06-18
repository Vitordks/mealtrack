package com.mealtrack.controller;

import com.mealtrack.model.RegistroProducao;
import com.mealtrack.repository.RegistroProducaoRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/producoes")
@CrossOrigin(origins = "http://localhost:5173")
public class RegistroProducaoController {
    @GetMapping("/relatorio-periodo")
    public List<RegistroProducao> relatorioPeriodo(

            @RequestParam String dataInicial,
            @RequestParam String dataFinal

    ) {

        return repository.findByDataRegistroBetween(

                LocalDateTime.parse(
                        dataInicial + "T00:00:00"
                ),

                LocalDateTime.parse(
                        dataFinal + "T23:59:59"
                )

        );
    }
    private final RegistroProducaoRepository repository;

    public RegistroProducaoController(RegistroProducaoRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<RegistroProducao> listarTodos() {
        return repository.findAll();
    }


    @GetMapping("/relatorio")
    public List<RegistroProducao> relatorio() {
        return repository.findAll();
    }

    @PostMapping
    public RegistroProducao salvar(
            @RequestBody RegistroProducao producao) {

        producao.setDataRegistro(LocalDateTime.now());

        return repository.save(producao);
    }
}