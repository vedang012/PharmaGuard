package com.saas.pharmaguard.service;

import com.saas.pharmaguard.dto.DrugRiskResult;
import com.saas.pharmaguard.dto.RiskAssessment;
import com.saas.pharmaguard.dto.RiskAssessmentBuilder;
import com.saas.pharmaguard.model.GeneProfile;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

/**
 * Evaluates drug risk for each supported drug against the interpreted gene profiles.
 *
 * Architecture:
 * - Each drug maps to exactly one gene (its primary metabolising enzyme/transporter).
 * - Risk is derived purely from the phenotype string of that gene's GeneProfile.
 * - DRUG_GENE_MAP defines the drug → gene wiring.
 * - evaluate() performs a startsWith check against the phenotype label so that
 *   "PM – Poor Metabolizer" matches the "PM" rule key — no brittle full-string comparisons.
 *
 * Risk label vocabulary (exhaustive, no other values ever returned):
 *   Safe           — standard dose, no action needed
 *   Adjust Dosage  — use drug but at a modified dose
 *   Toxic          — drug likely to cause serious adverse effect at standard dose
 *   Ineffective    — drug unlikely to produce therapeutic benefit
 *   Unknown        — phenotype not in rule table; clinical judgement required
 */
@Service
public class DrugRiskService {

    // ── Supported drugs (source of truth) ───────────────────────────────────
    private static final Set<String> SUPPORTED_DRUGS = Set.of(
            "CODEINE", "WARFARIN", "CLOPIDOGREL",
            "SIMVASTATIN", "AZATHIOPRINE", "FLUOROURACIL"
    );

    // ── Drug → gene wiring ───────────────────────────────────────────────────
    private static final Map<String, String> DRUG_GENE_MAP = Map.of(
            "CODEINE",       "CYP2D6",
            "WARFARIN",      "CYP2C9",
            "CLOPIDOGREL",   "CYP2C19",
            "SIMVASTATIN",   "SLCO1B1",
            "AZATHIOPRINE",  "TPMT",
            "FLUOROURACIL",  "DPYD"
    );

    // ── Per-drug phenotype prefix → risk label ───────────────────────────────
    private static final Map<String, Map<String, String>> DRUG_RULES = Map.of(
            "CODEINE", Map.of(
                    "PM", "Ineffective",
                    "IM", "Adjust Dosage",
                    "NM", "Safe",
                    "RM", "Toxic",
                    "UM", "Toxic"
            ),
            "WARFARIN", Map.of(
                    "PM", "Toxic",
                    "IM", "Adjust Dosage",
                    "NM", "Safe"
            ),
            "CLOPIDOGREL", Map.of(
                    "PM", "Ineffective",
                    "IM", "Adjust Dosage",
                    "NM", "Safe",
                    "RM", "Safe"
            ),
            "SIMVASTATIN", Map.of(
                    "Poor Function",      "Toxic",
                    "Decreased Function", "Adjust Dosage",
                    "Normal Function",    "Safe"
            ),
            "AZATHIOPRINE", Map.of(
                    "PM", "Toxic",
                    "IM", "Adjust Dosage",
                    "NM", "Safe"
            ),
            "FLUOROURACIL", Map.of(
                    "PM", "Toxic",
                    "IM", "Adjust Dosage",
                    "NM", "Safe"
            )
    );

    /**
     * Evaluate only the drugs present in the comma-separated {@code drugsParam}.
     *
     * Rules:
     *  - null / blank input           → empty list (no evaluation)
     *  - unsupported drug name        → Unknown, basedOnGene=null, phenotype=null
     *  - supported, gene missing      → Safe (*1/*1 assumed)
     *  - supported, phenotype UNKNOWN → Unknown
     *  - otherwise                    → deterministic rule lookup
     *
     * @param geneProfiles Interpreted profiles from InterpretationService.
     * @param drugsParam   Raw comma-separated request parameter, e.g. "CODEINE, warfarin".
     * @return One DrugRiskResult per requested drug, in request order.
     */
    public List<DrugRiskResult> evaluate(List<GeneProfile> geneProfiles, String drugsParam) {
        List<String> requestedDrugs = parseDrugs(drugsParam);
        if (requestedDrugs.isEmpty()) {
            return Collections.emptyList();
        }

        return requestedDrugs.stream()
                .map(drug -> evaluateDrug(drug, geneProfiles))
                .toList();
    }

    // ── private ──────────────────────────────────────────────────────────────

    /**
     * Split on commas, trim whitespace, uppercase — return only non-blank tokens.
     * "CODEINE, warfarin , " → ["CODEINE", "WARFARIN"]
     */
    private List<String> parseDrugs(String drugsParam) {
        if (drugsParam == null || drugsParam.isBlank()) {
            return Collections.emptyList();
        }
        return Arrays.stream(drugsParam.split(","))
                .map(String::trim)
                .map(String::toUpperCase)
                .filter(s -> !s.isEmpty())
                .toList();
    }

    private DrugRiskResult evaluateDrug(String drug, List<GeneProfile> profiles) {

        // ── Unsupported drug ─────────────────────────────────────────────────
        if (!SUPPORTED_DRUGS.contains(drug)) {
            RiskAssessment assessment = RiskAssessmentBuilder.build(
                    drug, null, "Unknown", null, false, true);
            return new DrugRiskResult(drug, null, null, assessment);
        }

        String gene = DRUG_GENE_MAP.get(drug);

        Optional<GeneProfile> match = profiles.stream()
                .filter(p -> gene.equals(p.getGene()))
                .findFirst();

        // ── Gene absent — *1/*1 fallback ────────────────────────────────────
        if (match.isEmpty()) {
            RiskAssessment assessment = RiskAssessmentBuilder.build(
                    drug, gene, "Safe", "*1/*1 assumed", true, false);
            return new DrugRiskResult(drug, gene, "*1/*1 assumed", assessment);
        }

        String phenotype = match.get().getPhenotype();

        // ── Phenotype unresolved ─────────────────────────────────────────────
        if (phenotype == null || phenotype.startsWith("UNKNOWN")) {
            RiskAssessment assessment = RiskAssessmentBuilder.build(
                    drug, gene, "Unknown", phenotype, false, false);
            return new DrugRiskResult(drug, gene, phenotype, assessment);
        }

        // ── Explicit rule match ──────────────────────────────────────────────
        String riskLabel = resolveRisk(drug, phenotype);
        RiskAssessment assessment = RiskAssessmentBuilder.build(
                drug, gene, riskLabel, phenotype, false, false);
        return new DrugRiskResult(drug, gene, phenotype, assessment);
    }

    private String resolveRisk(String drug, String phenotype) {
        Map<String, String> rules = DRUG_RULES.get(drug);
        if (rules == null) return "Unknown";
        return rules.entrySet().stream()
                .filter(e -> phenotype.startsWith(e.getKey()))
                .map(Map.Entry::getValue)
                .findFirst()
                .orElse("Unknown");
    }
}
