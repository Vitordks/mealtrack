package com.mealtrack.service;

import com.mealtrack.model.Alimento;
import com.mealtrack.repository.AlimentoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlimentoService {

    private final AlimentoRepository repository;

    public AlimentoService(AlimentoRepository repository) {
        this.repository = repository;
    }

    public List<Alimento> listarTodos() {
        return repository.findAll();
    }

    public Alimento buscarPorId(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alimento não encontrado."));
    }

    public Alimento salvar(Alimento alimento) {
        alimento.atualizarIndicadores();
        return repository.save(alimento);
    }

    public Alimento atualizar(Integer id, Alimento atualizado) {
        Alimento alimento = buscarPorId(id);
        alimento.setNome(atualizado.getNome());
        alimento.setCategoria(atualizado.getCategoria());
        alimento.setValorPorQuilograma(atualizado.getValorPorQuilograma());
        alimento.setQuantidadeInicialKg(atualizado.getQuantidadeInicialKg());
        alimento.setQuantidadeAtualKg(atualizado.getQuantidadeAtualKg());
        alimento.setQuantidadeDesperdicadoKg(atualizado.getQuantidadeDesperdicadoKg());
        alimento.setQuantidadeProduzida(atualizado.getQuantidadeProduzida());
        alimento.setQuantidadeConsumida(atualizado.getQuantidadeConsumida());
        alimento.setQuantidadeReposicaoKg(atualizado.getQuantidadeReposicaoKg());
        alimento.atualizarIndicadores();
        return repository.save(alimento);
    }

    public void excluir(Integer id) {
        repository.deleteById(id);
    }
}
