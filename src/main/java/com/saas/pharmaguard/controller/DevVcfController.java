package com.saas.pharmaguard.controller;

import com.saas.pharmaguard.model.VcfParseResult;
import com.saas.pharmaguard.service.VcfService;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * Dev-only controller. Exposes raw parser output for debugging.
 *
 * @Profile("dev") means Spring will NOT register this bean in production.
 * It physically does not exist at runtime unless you start with --spring.profiles.active=dev.
 */
@Profile("dev")
@RestController
@RequestMapping("/api/vcf")
public class DevVcfController {

    private final VcfService vcfService;

    public DevVcfController(VcfService vcfService) {
        this.vcfService = vcfService;
    }

    /**
     * POST /api/vcf/parse  (dev profile only)
     *
     * Returns the full raw VcfParseResult including every parsed variant,
     * metadata headers, and parse errors — useful for verifying VCF annotation
     * quality (GENE=, STAR= fields) before trusting interpretation output.
     *
     * NOT available in production. Returns 404 when profile != "dev".
     */
    @PostMapping("/parse")
    public ResponseEntity<?> parse(@RequestParam("file") MultipartFile file) {
        try {
            VcfParseResult result = vcfService.parseOnly(file);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Parse failed: " + e.getMessage());
        }
    }
}

