package com.saas.pharmaguard.controller;

import com.saas.pharmaguard.dto.response.PharmaGuardResponse;
import com.saas.pharmaguard.service.VcfService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/vcf")
public class AnalysisController {

    private final VcfService vcfService;

    public AnalysisController(VcfService vcfService) {
        this.vcfService = vcfService;
    }

    /**
     * POST /api/vcf/analyse
     *
     * Production endpoint. Runs the full pipeline:
     *   validate → parse → interpret → return AnalysisResponse
     *
     * Returns:
     * {
     *   "metadata":    { "fileformat": "VCFv4.2", ... },
     *   "geneProfiles": [
     *     { "gene": "CYP2C19", "allele1": "*1", "allele2": "*2",
     *       "diplotype": "*1/*2", "phenotype": "IM – Intermediate Metabolizer" },
     *     ...
     *   ],
     *   "parseErrors": []
     * }
     */
    @PostMapping("/analyse")
    public ResponseEntity<?> analyse(
            @RequestParam("file")  MultipartFile file,
            @RequestParam("drugs") String drugs) {
        try {
            List<PharmaGuardResponse> response = vcfService.analyse(file, drugs);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Analysis failed: " + e.getMessage());
        }
    }
}
