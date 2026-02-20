package com.saas.pharmaguard.service;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import com.saas.pharmaguard.dto.DrugRiskResult;
import com.saas.pharmaguard.dto.response.ClinicalRecommendation;
import com.saas.pharmaguard.dto.response.LlmExplanation;
import com.saas.pharmaguard.dto.response.PharmacogenomicProfile;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Generates a concise plain-language clinical summary using Google Gemini
 * via the official google-genai SDK (API-key auth — no GCP project needed).
 *
 * The LLM is a NARRATOR only:
 *   - Risk label, severity, diplotype, and clinical action are all pre-computed
 *     by the deterministic pipeline (DrugRiskService, ClinicalRecommendationService).
 *   - The model receives those facts and turns them into 3-4 readable sentences.
 *   - It cannot modify, override, or invent any clinical value.
 *   - On any failure the service returns a static fallback — the /analyse
 *     endpoint never fails because of an LLM error.
 */
@Service
public class LlmExplanationService {

    private static final String MODEL = "gemini-2.5-flash";

    private static final String FALLBACK_SUMMARY =
            "Explanation unavailable — pharmacogenomic profile and risk assessment " +
            "are provided in the structured fields above.";

    private static final String SYSTEM_PROMPT =
            "You are a clinical pharmacogenomics assistant. " +
            "Write a single concise paragraph of 3-4 sentences that explains " +
            "in plain English why this patient's genetic profile affects the named drug " +
            "and what the clinical consequence of the stated risk label is. " +
            "Use only the facts given to you — do NOT suggest a different risk level, " +
            "severity, or treatment action. Do NOT use bullet points or disclaimers.";

    private final String apiKey;

    public LlmExplanationService(@Value("${google.ai.api-key}") String apiKey) {
        this.apiKey = apiKey;
    }

    /**
     * Generates a summary for one drug result. Never throws.
     *
     * @param risk           Evaluated DrugRiskResult (drug, gene, riskLabel, severity).
     * @param profile        PharmacogenomicProfile (diplotype, phenotype).
     * @param recommendation ClinicalRecommendation (action) — included so the model
     *                       can reference what was already advised without inventing it.
     * @return LlmExplanation with a summary string, or a static fallback.
     */
    public LlmExplanation generateSummary(DrugRiskResult         risk,
                                           PharmacogenomicProfile profile,
                                           ClinicalRecommendation recommendation) {
        try {
            String prompt  = buildPrompt(risk, profile, recommendation);
            String summary = callGemini(prompt);
            return new LlmExplanation(summary);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new LlmExplanation(FALLBACK_SUMMARY);
        }
    }

    // ── private ──────────────────────────────────────────────────────────────

    /**
     * Structured fact block passed as the user message.
     * Every value is already computed — the model cannot change them.
     */
    private String buildPrompt(DrugRiskResult         risk,
                                PharmacogenomicProfile profile,
                                ClinicalRecommendation recommendation) {

        String riskLabel  = safeGet(risk.getRiskAssessment() != null
                ? risk.getRiskAssessment().getRiskLabel() : null);
        String severity   = safeGet(risk.getRiskAssessment() != null
                ? risk.getRiskAssessment().getSeverity()  : null);
        String gene       = safeGet(risk.getBasedOnGene());
        String diplotype  = safeGet(profile != null ? profile.getDiplotype() : null);
        String phenotype  = safeGet(profile != null ? profile.getPhenotype() : null);
        String action     = safeGet(recommendation != null ? recommendation.getAction() : null);

        return String.format(
                "Drug: %s%n"                      +
                "Governing gene: %s%n"             +
                "Patient diplotype: %s%n"          +
                "Phenotype: %s%n"                  +
                "Risk label: %s%n"                 +
                "Severity: %s%n"                   +
                "Advised clinical action: %s%n%n"  +
                "Summarise why this genetic profile affects this drug and what " +
                "the clinical consequence of the risk label is.",
                risk.getDrug(), gene, diplotype, phenotype, riskLabel, severity, action);
    }

    /** Calls Gemini. A new Client per call — the SDK is stateless. */
    private String callGemini(String userPrompt) {
        try (Client client = Client.builder().apiKey(apiKey).build()) {
            GenerateContentResponse response = client.models.generateContent(
                    MODEL,
                    SYSTEM_PROMPT + "\n\n" + userPrompt,
                    null);
            String text = response.text();
            return (text != null && !text.isBlank()) ? text.trim() : FALLBACK_SUMMARY;
        }
    }

    private static String safeGet(String value) {
        return (value != null && !value.isBlank()) ? value : "Unknown";
    }
}
