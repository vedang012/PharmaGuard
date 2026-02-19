package com.saas.pharmaguard.service;

import com.saas.pharmaguard.dto.DrugRiskResult;
import com.saas.pharmaguard.dto.response.ClinicalRecommendation;
import com.saas.pharmaguard.dto.response.DetectedVariant;
import com.saas.pharmaguard.dto.response.LlmExplanation;
import com.saas.pharmaguard.dto.response.PharmacogenomicProfile;
import com.saas.pharmaguard.dto.response.PharmaGuardResponse;
import com.saas.pharmaguard.dto.response.QualityMetrics;
import com.saas.pharmaguard.model.GeneProfile;
import com.saas.pharmaguard.model.VcfVariant;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Pure transformation layer.
 *
 * Takes the raw pipeline outputs (DrugRiskResults, GeneProfiles, VcfVariants)
 * and assembles one PharmaGuardResponse per requested drug.
 *
 * Responsibilities:
 *  - Map verbose phenotype labels → short CPIC codes (NM, IM, PM, RM, UM, Unknown)
 *  - Extract actionable detected_variants for each gene from the raw VCF variant list
 *  - Generate patient_id (UUID) and ISO-8601 timestamp
 *  - Wire RiskAssessment, PharmacogenomicProfile, QualityMetrics into the envelope
 *
 * This service has NO side effects and holds NO state.
 */
@Service
public class ResponseMappingService {

    private final ClinicalRecommendationService clinicalRecommendationService;
    private final LlmExplanationService         llmExplanationService;

    public ResponseMappingService(ClinicalRecommendationService clinicalRecommendationService,
                                  LlmExplanationService llmExplanationService) {
        this.clinicalRecommendationService = clinicalRecommendationService;
        this.llmExplanationService         = llmExplanationService;
    }

    /**
     * Maps verbose PhenotypeRules labels → CPIC short codes.
     * startsWith matching keeps this decoupled from the exact label wording.
     * Order matters: more specific prefixes must come first if they overlap.
     */
    private static final List<Map.Entry<String, String>> PHENOTYPE_SHORT_CODES = List.of(
            Map.entry("NM",               "NM"),
            Map.entry("IM",               "IM"),
            Map.entry("PM",               "PM"),
            Map.entry("RM",               "RM"),
            Map.entry("UM",               "UM"),
            Map.entry("Normal Function",  "NM"),   // SLCO1B1 normal
            Map.entry("Decreased Function", "IM"), // SLCO1B1 decreased
            Map.entry("Poor Function",    "PM")    // SLCO1B1 poor
    );

    /**
     * Build one PharmaGuardResponse per DrugRiskResult.
     *
     * @param drugRisks    Results from DrugRiskService — one entry per requested drug.
     * @param geneProfiles Interpreted profiles from InterpretationService.
     * @param allVariants  Full raw variant list from VcfParser (used to extract detected_variants).
     * @param parseSuccess True when the VCF had no fatal parse errors.
     * @return One PharmaGuardResponse per drug, in the same order as drugRisks.
     */
    public List<PharmaGuardResponse> map(List<DrugRiskResult>  drugRisks,
                                         List<GeneProfile>      geneProfiles,
                                         List<VcfVariant>       allVariants,
                                         boolean                parseSuccess) {

        // Index gene profiles by gene name for O(1) lookup
        Map<String, GeneProfile> profileByGene = geneProfiles.stream()
                .collect(Collectors.toMap(GeneProfile::getGene, Function.identity()));

        // Shared across all drugs in the same request
        String patientId  = UUID.randomUUID().toString();
        String timestamp  = Instant.now().toString();          // ISO-8601 UTC
        QualityMetrics qm = new QualityMetrics(parseSuccess);

        return drugRisks.stream()
                .map(risk -> buildResponse(risk, profileByGene, allVariants, patientId, timestamp, qm))
                .toList();
    }

    // ── private ──────────────────────────────────────────────────────────────

    private PharmaGuardResponse buildResponse(DrugRiskResult           risk,
                                               Map<String, GeneProfile> profileByGene,
                                               List<VcfVariant>         allVariants,
                                               String                   patientId,
                                               String                   timestamp,
                                               QualityMetrics           qm) {
        String gene    = risk.getBasedOnGene();
        GeneProfile profile = gene != null ? profileByGene.get(gene) : null;

        PharmacogenomicProfile pgxProfile = buildPgxProfile(gene, profile, allVariants);

        String riskLabel = risk.getRiskAssessment() != null
                ? risk.getRiskAssessment().getRiskLabel()
                : "Unknown";

        ClinicalRecommendation recommendation =
                clinicalRecommendationService.recommend(risk.getDrug(), riskLabel);

        LlmExplanation explanation = llmExplanationService.generateSummary(risk, pgxProfile, recommendation);

        return new PharmaGuardResponse(
                patientId,
                risk.getDrug(),
                timestamp,
                risk.getRiskAssessment(),
                pgxProfile,
                recommendation,
                explanation,
                qm
        );
    }

    private PharmacogenomicProfile buildPgxProfile(String          gene,
                                                    GeneProfile     profile,
                                                    List<VcfVariant> allVariants) {
        // Unsupported drug — no gene, no profile data
        if (gene == null) {
            return new PharmacogenomicProfile(null, null, "Unknown", List.of());
        }

        String diplotype    = profile != null ? profile.getDiplotype() : null;
        String phenotypeRaw = profile != null ? profile.getPhenotype() : null;
        String phenotype    = toShortPhenotype(phenotypeRaw);

        List<DetectedVariant> detectedVariants = allVariants.stream()
                .filter(v -> gene.equals(v.getGene()))
                .filter(v -> v.isHeterozygous() || v.isHomozygousAlt())  // actionable only
                .map(v -> new DetectedVariant(v.getRsid(), v.getStarAllele(), v.getGenotype()))
                .toList();

        return new PharmacogenomicProfile(gene, diplotype, phenotype, detectedVariants);
    }

    /**
     * Convert a verbose phenotype label to its CPIC short code.
     * "IM – Intermediate Metabolizer"       → "IM"
     * "Poor Function – High Myopathy Risk"  → "PM"
     * null or starts with "UNKNOWN"         → "Unknown"
     */
    private String toShortPhenotype(String verbose) {
        if (verbose == null || verbose.startsWith("UNKNOWN")) return "Unknown";

        return PHENOTYPE_SHORT_CODES.stream()
                .filter(e -> verbose.startsWith(e.getKey()))
                .map(Map.Entry::getValue)
                .findFirst()
                .orElse("Unknown");
    }
}
