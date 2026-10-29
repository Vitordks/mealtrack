package com.mealtrack.service;

import com.mealtrack.model.RegistroProducao;
import com.mealtrack.repository.RegistroProducaoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RegistroProducaoService {

    private final RegistroProducaoRepository repository;

    public RegistroProducaoService(RegistroProducaoRepository repository) {
        this.repository = repository;
    }

    public List<RegistroProducao> listarTodos() {
        return repository.findAll();
    }

    public RegistroProducao buscarPorId(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registro não encontrado."));
    }

    public RegistroProducao salvar(RegistroProducao registro) {
        return repository.save(registro);
    }

    public RegistroProducao atualizar(Integer id, RegistroProducao atualizado) {
        RegistroProducao registro = buscarPorId(id);
        registro.setAlimento(atualizado.getAlimento());
        registro.setUsuario(atualizado.getUsuario());
        registro.setDataRegistro(atualizado.getDataRegistro());
        registro.setQuantidadeProduzida(atualizado.getQuantidadeProduzida());
        return repository.save(registro);
    }

    public void excluir(Integer id) {
        repository.deleteById(id);
    }
}
