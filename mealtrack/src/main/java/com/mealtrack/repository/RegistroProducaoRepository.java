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

    List<RegistroProducao> findByDataRegistroBetween(
            LocalDateTime inicio,
            LocalDateTime fim
    );

    @Query("""
        SELECT COALESCE(AVG(r.quantidadeProduzida),0)
        FROM RegistroProducao r
    """)
    Double mediaProduzida();

    @Query(
            value = """
                    SELECT a.nome
                    FROM registro_producao r
                    JOIN alimento a ON a.id_alimento = r.id_alimento
                    GROUP BY a.nome
                    ORDER BY SUM(r.quantidade_produzida) DESC
                    LIMIT 1
                    """,
            nativeQuery = true
    )
    String alimentoMaisProduzido();

}
