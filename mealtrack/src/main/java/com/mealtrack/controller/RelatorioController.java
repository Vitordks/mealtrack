package com.mealtrack.controller;

import com.mealtrack.service.RelatorioService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/relatorios")
public class RelatorioController {

    private final RelatorioService relatorioService;

    public RelatorioController(RelatorioService relatorioService) {
        this.relatorioService = relatorioService;
    }

    @GetMapping
    public Map<String, Object> gerarRelatorio() {
        return relatorioService.gerarRelatorio();
    }

    @GetMapping("/export/csv")
    public ResponseEntity<String> exportarCSV() {
        String csv = relatorioService.gerarRelatorioCSV();
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_PLAIN);
        headers.setContentDispositionFormData("attachment", "relatorio_mealtrack.csv");
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(csv);
    }

    @GetMapping("/export/pdf")
    public ResponseEntity<byte[]> exportarPDF() {
        byte[] pdf = relatorioService.gerarRelatorioPDF();
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "relatorio_mealtrack.pdf");
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(pdf);
    }
}
