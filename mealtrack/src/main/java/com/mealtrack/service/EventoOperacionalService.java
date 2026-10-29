package com.mealtrack.service;

import com.mealtrack.model.Alimento;
import com.mealtrack.model.EventoOperacional;
import com.mealtrack.model.Restaurante;
import com.mealtrack.model.enums.TipoEvento;
import com.mealtrack.repository.EventoOperacionalRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EventoOperacionalService {

    private final EventoOperacionalRepository repository;

    public EventoOperacionalService(EventoOperacionalRepository repository) {
        this.repository = repository;
    }

    /**
     * Registra um evento operacional no histórico persistente.
     */
    public EventoOperacional registrar(
            TipoEvento tipo,
            String descricao,
            Alimento alimento,
            Restaurante restaurante,
            LocalDateTime dataHora
    ) {
        EventoOperacional evento = EventoOperacional.builder()
                .tipo(tipo)
                .descricao(descricao)
                .alimento(alimento)
                .restaurante(restaurante)
                .dataHora(dataHora)
                .build();
        return repository.save(evento);
    }

    public List<Map<String, Object>> listarRecentes() {
        return repository.findTop50ByOrderByDataHoraDesc().stream()
                .map(this::paraMapa)
                .toList();
    }

    private Map<String, Object> paraMapa(EventoOperacional evento) {
        Map<String, Object> mapa = new HashMap<>();
        mapa.put("id", evento.getId());
        mapa.put("tipo", evento.getTipo().name());
        mapa.put("descricao", evento.getDescricao());
        mapa.put("dataHora", evento.getDataHora());
        mapa.put("alimento", evento.getAlimento() != null ? evento.getAlimento().getNome() : null);
        return mapa;
    }
}
