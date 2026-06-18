package com.mealtrack.controller;

import com.mealtrack.model.Alimento;
import com.mealtrack.repository.AlimentoRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/alimentos")
@CrossOrigin(origins = "http://localhost:5173")
public class AlimentoController {

    private final AlimentoRepository repository;

    public AlimentoController(AlimentoRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public Alimento cadastrar(@RequestBody Alimento alimento) {

        return repository.save(alimento);

    }

    @GetMapping
    public List<Alimento> listarTodos() {
        return repository.findAll();
    }
    @GetMapping("/{id}")
    public Alimento buscarPorId(@PathVariable Integer id) {
        return repository.findById(id)
                .orElseThrow();
    }
    @PutMapping("/{id}")
    public Alimento atualizar(
            @PathVariable Integer id,
            @RequestBody Alimento alimentoAtualizado) {

        Alimento alimento = repository.findById(id)
                .orElseThrow();

        alimento.setNome(alimentoAtualizado.getNome());
        alimento.setCategoria(alimentoAtualizado.getCategoria());

        return repository.save(alimento);
    }
    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Integer id) {

        repository.deleteById(id);

    }
}