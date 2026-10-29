package com.mealtrack.controller;

import com.mealtrack.model.Alimento;
import org.springframework.web.bind.annotation.*;
import com.mealtrack.service.AlimentoService;
import java.util.List;

@RestController
@RequestMapping("/alimentos")
public class AlimentoController {

    private final AlimentoService service;

    public AlimentoController(AlimentoService service) {

        this.service = service;

    }

    @GetMapping
    public List<Alimento> listarTodos() {

        return service.listarTodos();

    }

    @GetMapping("/{id}")
    public Alimento buscarPorId(@PathVariable Integer id) {

        return service.buscarPorId(id);

    }

    @PostMapping
    public Alimento salvar(@RequestBody Alimento alimento) {

        return service.salvar(alimento);

    }

    @PutMapping("/{id}")
    public Alimento atualizar(
            @PathVariable Integer id,
            @RequestBody Alimento alimento) {

        return service.atualizar(id, alimento);

    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Integer id) {

        service.excluir(id);

    }

}