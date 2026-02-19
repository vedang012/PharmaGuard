package com.saas.pharmaguard.interpretation;

import com.saas.pharmaguard.model.GeneProfile;
import com.saas.pharmaguard.model.VcfVariant;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Orchestrates the full interpretation pipeline:
 *
 *   VcfVariant list
 *       │
 *       ▼
 *   [1] Filter — drop 0/0 (ref/ref) genotypes, keep only het or hom-alt
 *       │
 *       ▼
 *   [2] Group — bucket remaining variants by gene name
 *       │
 *       ▼
 *   [3] Resolve — DiplotypeResolver converts each gene's variants into
 *                 exactly two alleles (enforcing the diploid hard limit)
 *       │
 *       ▼
 *   [4] Lookup  — PhenotypeRules maps the diplotype to a clinical phenotype
 *       │
 *       ▼
 *   List<GeneProfile>
 */
@Service
public class InterpretationService {

    /**
     * The required pharmacogenomic panel.
     * Every gene in this set MUST appear in the output — genes with no
     * actionable VCF variants default to *1/*1 (Normal Metabolizer).
     *
     * BIOLOGICAL REASONING: a missing result is clinically ambiguous and
     * dangerous. Defaulting to *1/*1 makes it explicit that the patient
     * was assumed wild-type for that gene, not that the gene was skipped.
     */
    public static final Set<String> REQUIRED_PANEL = Set.of(
            "CYP2D6", "CYP2C19", "CYP2C9", "SLCO1B1", "TPMT", "DPYD"
    );

    /**
     * Full interpretation pipeline:
     *
     *  [1] Filter   — keep only heterozygous (0/1) or homozygousAlt (1/1) variants
     *  [2] Group    — bucket by gene
     *  [3] Resolve  — DiplotypeResolver → exactly 2 alleles per gene
     *  [4] Lookup   — PhenotypeRules → phenotype string
     *  [5] Backfill — genes in REQUIRED_PANEL with no variants → *1/*1 / NM
     *
     * @param variants Raw variant list from VcfParseResult (may include 0/0).
     * @return One GeneProfile per panel gene, sorted alphabetically.
     */
    public List<GeneProfile> interpret(List<VcfVariant> variants) {

        // ── Step 1: filter ───────────────────────────────────────────────────
        List<VcfVariant> actionable = (variants == null ? List.<VcfVariant>of() : variants)
                .stream()
                .filter(v -> v.isHeterozygous() || v.isHomozygousAlt())
                .filter(v -> v.getGene() != null && !v.getGene().isBlank())
                .toList();

        // ── Step 2: group by gene ────────────────────────────────────────────
        Map<String, List<VcfVariant>> byGene = actionable.stream()
                .collect(Collectors.groupingBy(VcfVariant::getGene));

        // ── Steps 3 + 4: resolve + lookup for genes that have variants ───────
        Map<String, GeneProfile> resolved = new LinkedHashMap<>();
        for (Map.Entry<String, List<VcfVariant>> entry : byGene.entrySet()) {
            GeneProfile profile = buildProfile(entry.getKey(), entry.getValue());
            if (profile != null) {
                resolved.put(entry.getKey(), profile);
            }
        }

        // ── Step 5: backfill required panel genes with no variants ───────────
        // A gene absent from the VCF is assumed fully wild-type: *1/*1.
        // This is the CPIC default assumption and keeps the response schema stable.
        for (String gene : REQUIRED_PANEL) {
            if (!resolved.containsKey(gene)) {
                String phenotype = PhenotypeRules.lookup(gene,
                        DiplotypeResolver.REFERENCE_ALLELE,
                        DiplotypeResolver.REFERENCE_ALLELE);
                resolved.put(gene, new GeneProfile(
                        gene,
                        DiplotypeResolver.REFERENCE_ALLELE,
                        DiplotypeResolver.REFERENCE_ALLELE,
                        phenotype));
            }
        }

        // ── Sort alphabetically for deterministic output ─────────────────────
        return resolved.values().stream()
                .sorted(Comparator.comparing(GeneProfile::getGene))
                .collect(Collectors.toList());
    }

    private GeneProfile buildProfile(String gene, List<VcfVariant> variants) {
        DiplotypeResolver.Resolution r = DiplotypeResolver.resolve(variants);
        if (r == null) return null;

        if (r.hardLimitExceeded) {
            System.err.printf(
                "[InterpretationService] WARNING: >2 het variants for %s — " +
                "only first two alleles used. Check VCF annotation quality.%n", gene);
        }

        String phenotype = PhenotypeRules.lookup(gene, r.allele1, r.allele2);
        return new GeneProfile(gene, r.allele1, r.allele2, phenotype);
    }
}
