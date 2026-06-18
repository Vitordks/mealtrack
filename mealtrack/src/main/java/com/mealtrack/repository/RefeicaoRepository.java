package com.mealtrack.repository;

import com.mealtrack.model.Refeicao;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RefeicaoRepository extends JpaRepository<Refeicao, Integer> {
}