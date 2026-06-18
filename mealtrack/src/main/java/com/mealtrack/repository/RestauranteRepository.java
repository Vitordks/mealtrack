package com.mealtrack.repository;

import com.mealtrack.model.Restaurante;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RestauranteRepository extends JpaRepository<Restaurante, Integer> {
}