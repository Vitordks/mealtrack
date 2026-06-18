package com.mealtrack.controller;

import com.mealtrack.model.Restaurante;
import com.mealtrack.repository.RestauranteRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/restaurantes")
@CrossOrigin(origins = "http://localhost:5173")
public class RestauranteController {

    private final RestauranteRepository repository;

    public RestauranteController(RestauranteRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Restaurante> listarTodos() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Restaurante buscarPorId(@PathVariable Integer id) {

        return repository.findById(id)
                .orElseThrow();

    }

    @PostMapping
    public Restaurante salvar(@RequestBody Restaurante restaurante) {

        return repository.save(restaurante);

    }

    @PutMapping("/{id}")
    public Restaurante atualizar(
            @PathVariable Integer id,
            @RequestBody Restaurante restauranteAtualizado) {

        Restaurante restaurante = repository.findById(id)
                .orElseThrow();

        restaurante.setNome(restauranteAtualizado.getNome());
        restaurante.setCnpj(restauranteAtualizado.getCnpj());
        restaurante.setEmail(restauranteAtualizado.getEmail());
        restaurante.setTelefone(restauranteAtualizado.getTelefone());
        restaurante.setEndereco(restauranteAtualizado.getEndereco());
        restaurante.setDataFundacao(restauranteAtualizado.getDataFundacao());

        return repository.save(restaurante);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Integer id) {

        repository.deleteById(id);

    }
}