package com.saas.pharmaguard.interpretation;

import com.saas.pharmaguard.model.VcfVariant;

import java.util.LinkedHashSet;
import java.util.List;

/**
 * Resolves variants for ONE gene into exactly two alleles.
 *
 * BIOLOGICAL REASONING
 * ──────────────────────────────────────────────────────────────────────
 * Humans are diploid: every autosomal gene has exactly 2 copies — one
 * inherited from each parent. The VCF only records positions that differ
 * from the reference genome, so:
 *
 *   0/0 → both chromosomes are reference (*1/*1)  — no variant, skip
 *   0/1 → one chromosome has the ALT allele       — heterozygous carrier
 *   1/1 → both chromosomes have the ALT allele    — homozygous variant
 *
 * Priority order (enforced strictly):
 *
 *   1. HOMOZYGOUS ALT (1/1)
 *      Both slots are filled by the same allele → starAllele/starAllele.
 *      Any other heterozygous entries for the same gene are IGNORED because
 *      the two chromosomal slots are already accounted for.
 *
 *   2. SINGLE HETEROZYGOUS (exactly one distinct 0/1 allele)
 *      One chromosome = starAllele, other = *1 (reference assumed).
 *      → *1/starAllele
 *
 *   3. COMPOUND HETEROZYGOUS (two distinct 0/1 alleles)
 *      Each chromosome carries a different defective allele.
 *      Neither copy is fully functional — clinically equivalent to PM in
 *      many genes (e.g. CYP2C9 *2/*3 → Poor Metabolizer).
 *      → starA/starB
 *
 *   4. HARD LIMIT (>2 distinct heterozygous alleles)
 *      Biologically impossible in a diploid organism. Caused by VCF
 *      annotation errors or un-merged multi-allelic sites.
 *      → take the first two, set hardLimitExceeded = true, log warning.
 * ──────────────────────────────────────────────────────────────────────
 */
public final class DiplotypeResolver {

    public static final String REFERENCE_ALLELE = "*1";

    private DiplotypeResolver() {}

    public static final class Resolution {
        public final String allele1;
        public final String allele2;
        public final boolean hardLimitExceeded;

        Resolution(String allele1, String allele2, boolean hardLimitExceeded) {
            this.allele1 = allele1;
            this.allele2 = allele2;
            this.hardLimitExceeded = hardLimitExceeded;
        }
    }

    /**
     * @param variants Pre-grouped variants for a SINGLE gene.
     *                 May still contain 0/0 entries — filtered defensively.
     * @return Resolution, or null if no actionable variants exist.
     */
    public static Resolution resolve(List<VcfVariant> variants) {
        if (variants == null || variants.isEmpty()) return null;

        // ── Priority 1: homozygousAlt takes the whole diplotype ──────────────
        // Short-circuit: 1/1 means both chromosomes are the same allele.
        // Any other het entries for this gene are biologically irrelevant.
        for (VcfVariant v : variants) {
            if (v.isHomozygousAlt()) {
                String star = normalise(v.getStarAllele());
                return new Resolution(star, star, false);
            }
        }

        // ── Priority 2 & 3: collect distinct het alleles (insertion-ordered) ─
        // LinkedHashSet deduplicates while preserving the order they appeared
        // in the VCF — deterministic and annotation-error-tolerant.
        LinkedHashSet<String> seen = new LinkedHashSet<>();
        for (VcfVariant v : variants) {
            if (v.isHeterozygous()) {
                seen.add(normalise(v.getStarAllele()));
            }
        }

        if (seen.isEmpty()) return null;

        List<String> alleles = List.copyOf(seen);  // immutable, ordered snapshot

        // Single het → one allele is the variant, the other chromosome is *1
        if (alleles.size() == 1) {
            return new Resolution(REFERENCE_ALLELE, alleles.get(0), false);
        }

        // Two or more → compound heterozygous; enforce diploid max of 2
        boolean exceeded = alleles.size() > 2;
        return new Resolution(alleles.get(0), alleles.get(1), exceeded);
    }

    /** Guarantee the '*' prefix — tolerates bare numbers like "2" or "3A". */
    private static String normalise(String allele) {
        if (allele == null || allele.isBlank()) return REFERENCE_ALLELE;
        return allele.startsWith("*") ? allele.trim() : "*" + allele.trim();
    }
}
