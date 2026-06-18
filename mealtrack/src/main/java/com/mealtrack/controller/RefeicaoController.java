package com.mealtrack.controller;

import com.mealtrack.model.Refeicao;
import com.mealtrack.repository.RefeicaoRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/refeicoes")
@CrossOrigin(origins = "http://localhost:5173")
public class RefeicaoController {

    private final RefeicaoRepository repository;

    public RefeicaoController(RefeicaoRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Refeicao> listarTodos() {
        return repository.findAll();
    }
}