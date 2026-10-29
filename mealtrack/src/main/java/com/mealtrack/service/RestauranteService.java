package com.mealtrack.service;

import com.mealtrack.model.Restaurante;
import com.mealtrack.repository.RestauranteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RestauranteService {

    private final RestauranteRepository repository;

    public RestauranteService(RestauranteRepository repository) {
        this.repository = repository;
    }

    public List<Restaurante> listarTodos() {
        return repository.findAll();
    }

    public Restaurante buscarPorId(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurante não encontrado."));
    }

    public Restaurante salvar(Restaurante restaurante) {
        return repository.save(restaurante);
    }

    public Restaurante atualizar(Integer id, Restaurante atualizado) {
        Restaurante restaurante = buscarPorId(id);
        restaurante.setCnpj(atualizado.getCnpj());
        restaurante.setNome(atualizado.getNome());
        restaurante.setEndereco(atualizado.getEndereco());
        restaurante.setEmail(atualizado.getEmail());
        restaurante.setTelefone(atualizado.getTelefone());
        restaurante.setDataFundacao(atualizado.getDataFundacao());
        return repository.save(restaurante);
    }

    public void excluir(Integer id) {
        repository.deleteById(id);
    }
}
