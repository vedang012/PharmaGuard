package com.saas.pharmaguard.dto;

import java.util.Set;

/**
 * Builds a deterministic RiskAssessment from drug evaluation context.
 *
 * All logic is pure and explainable — no randomness, no ML, no AI.
 *
 * SEVERITY RULES
 * ──────────────────────────────────────────────────────────────────
 * Safe           → none
 * Adjust Dosage  → moderate
 * Ineffective    → moderate
 * Toxic          → high
 * Unknown        → low
 *
 * Special critical overrides (drug + gene phenotype combination):
 *   DPYD PM  + FLUOROURACIL  → critical
 *   TPMT PM  + AZATHIOPRINE  → critical
 * These are life-threatening toxicity scenarios documented in CPIC.
 *
 * CONFIDENCE RULES
 * ──────────────────────────────────────────────────────────────────
 * 0.95 → explicit rule match  (PM→Toxic, IM→Adjust Dosage, etc.)
 * 0.85 → fallback safe        (gene missing, *1/*1 assumed)
 * 0.50 → phenotype UNKNOWN    (diplotype not in rule table)
 * 0.40 → drug unsupported     (not in supported drug set)
 */
public final class RiskAssessmentBuilder {

    // Confidence constants — named so the intent is self-documenting
    public static final double CONFIDENCE_EXPLICIT_RULE  = 0.95;
    public static final double CONFIDENCE_FALLBACK_SAFE  = 0.85;
    public static final double CONFIDENCE_UNKNOWN_PHENO  = 0.50;
    public static final double CONFIDENCE_UNSUPPORTED    = 0.40;

    // Critical override pairs: drug + gene that produce life-threatening toxicity
    private static final Set<String> CRITICAL_KEYS = Set.of(
            "FLUOROURACIL:DPYD",
            "AZATHIOPRINE:TPMT"
    );

    private RiskAssessmentBuilder() {}

    /**
     * Build a RiskAssessment deterministically.
     *
     * @param drug         Uppercased drug name, e.g. "FLUOROURACIL"
     * @param gene         Gene that governs this drug, e.g. "DPYD" (null if unsupported)
     * @param riskLabel    Label already resolved by DrugRiskService
     * @param phenotype    Phenotype string from GeneProfile (null if gene missing / unsupported)
     * @param isFallback   True when gene was absent and *1/*1 was assumed (not a VCF call)
     * @param isUnsupported True when drug is not in the supported set
     */
    public static RiskAssessment build(String drug,
                                       String gene,
                                       String riskLabel,
                                       String phenotype,
                                       boolean isFallback,
                                       boolean isUnsupported) {
        double confidence = resolveConfidence(phenotype, isFallback, isUnsupported);
        String severity   = resolveSeverity(drug, gene, riskLabel, phenotype);

        return new RiskAssessment(riskLabel, confidence, severity);
    }

    // ── confidence ───────────────────────────────────────────────────────────

    private static double resolveConfidence(String phenotype,
                                            boolean isFallback,
                                            boolean isUnsupported) {
        if (isUnsupported)                                         return CONFIDENCE_UNSUPPORTED;
        if (phenotype == null || phenotype.startsWith("UNKNOWN")) return CONFIDENCE_UNKNOWN_PHENO;
        if (isFallback)                                            return CONFIDENCE_FALLBACK_SAFE;
        return CONFIDENCE_EXPLICIT_RULE;
    }

    // ── severity ─────────────────────────────────────────────────────────────

    private static String resolveSeverity(String drug,
                                          String gene,
                                          String riskLabel,
                                          String phenotype) {
        // Critical override: specific drug+gene PM combinations are life-threatening.
        // Check before the generic label map so they always win.
        if ("Toxic".equals(riskLabel)
                && gene != null
                && phenotype != null && phenotype.startsWith("PM")
                && CRITICAL_KEYS.contains(drug + ":" + gene)) {
            return "critical";
        }

        return switch (riskLabel) {
            case "Safe"          -> "none";
            case "Adjust Dosage" -> "moderate";
            case "Ineffective"   -> "moderate";
            case "Toxic"         -> "high";
            default              -> "low";   // covers "Unknown" and any future labels
        };
    }
}
