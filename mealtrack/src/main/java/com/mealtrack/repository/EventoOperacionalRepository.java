package com.mealtrack.repository;

import com.mealtrack.model.EventoOperacional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventoOperacionalRepository extends JpaRepository<EventoOperacional, Integer> {

    List<EventoOperacional> findTop50ByOrderByDataHoraDesc();
}
