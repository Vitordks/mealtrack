package com.mealtrack.config;

import java.util.List;

/**
 * Origens permitidas para requisições CORS do frontend em desenvolvimento.
 */
public final class CorsOrigins {

    public static final List<String> PERMITIDAS = List.of(
            "http://localhost:5173",
            "http://localhost:9090",
            "http://localhost:9091"
    );

    private CorsOrigins() {
    }
}
