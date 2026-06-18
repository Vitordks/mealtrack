package com.mealtrack.repository;

import com.mealtrack.model.RegistroProducao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDateTime;
import java.util.List;


public interface RegistroProducaoRepository extends JpaRepository<RegistroProducao, Integer> {


    @Query("""
           SELECT COALESCE(SUM(r.quantidadeProduzida),0)
           FROM RegistroProducao r
           """)
    Double totalProduzido();

    List<RegistroProducao>
    findByDataRegistroBetween(
            LocalDateTime inicio,
            LocalDateTime fim
    );
}