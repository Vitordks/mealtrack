package com.mealtrack.controller;

import com.mealtrack.model.RegistroProducao;
import com.mealtrack.service.RegistroProducaoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/producoes")
public class RegistroProducaoController {

    private final RegistroProducaoService service;

    public RegistroProducaoController(RegistroProducaoService service) {

        this.service = service;

    }

    @GetMapping
    public List<RegistroProducao> listarTodos() {

        return service.listarTodos();

    }

    @GetMapping("/{id}")
    public RegistroProducao buscarPorId(@PathVariable Integer id) {

        return service.buscarPorId(id);

    }

    @PostMapping
    public RegistroProducao salvar(@RequestBody RegistroProducao registro) {

        return service.salvar(registro);

    }

    @PutMapping("/{id}")
    public RegistroProducao atualizar(
            @PathVariable Integer id,
            @RequestBody RegistroProducao registro) {

        return service.atualizar(id, registro);

    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Integer id) {

        service.excluir(id);

    }

}