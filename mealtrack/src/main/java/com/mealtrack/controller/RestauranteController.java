package com.mealtrack.controller;

import com.mealtrack.model.Restaurante;
import com.mealtrack.service.RestauranteService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/restaurantes")
public class RestauranteController {

    private final RestauranteService service;

    public RestauranteController(RestauranteService service) {

        this.service = service;

    }

    @GetMapping
    public List<Restaurante> listarTodos() {

        return service.listarTodos();

    }

    @GetMapping("/{id}")
    public Restaurante buscarPorId(@PathVariable Integer id) {

        return service.buscarPorId(id);

    }

    @PostMapping
    public Restaurante salvar(@RequestBody Restaurante restaurante) {

        return service.salvar(restaurante);

    }

    @PutMapping("/{id}")
    public Restaurante atualizar(
            @PathVariable Integer id,
            @RequestBody Restaurante restaurante) {

        return service.atualizar(id, restaurante);

    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Integer id) {

        service.excluir(id);

    }

}