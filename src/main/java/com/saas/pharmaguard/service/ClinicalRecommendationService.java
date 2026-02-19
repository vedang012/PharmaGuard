package com.saas.pharmaguard.service;

import com.saas.pharmaguard.dto.response.ClinicalRecommendation;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Deterministic rule-based clinical recommendation engine.
 *
 * Lookup key: "DRUG:RISK_LABEL"
 * e.g. "CODEINE:Toxic" → use alternative analgesic
 *
 * Every supported drug has entries for all five risk labels:
 *   Safe | Adjust Dosage | Toxic | Ineffective | Unknown
 *
 * A FALLBACK entry covers any combination not explicitly listed.
 * All guidance follows published CPIC guidelines (cpicpgx.org).
 */
@Service
public class ClinicalRecommendationService {

    private static final String UNKNOWN_ACTION         = "Seek specialist review";
    private static final String UNKNOWN_RECOMMENDATION = "Pharmacogenomic result is inconclusive. Consult clinical pharmacologist.";
    private static final String UNKNOWN_MONITORING     = "Monitor clinically and consider repeat genotyping.";

    // Key format: "DRUG:RISK_LABEL"
    private static final Map<String, ClinicalRecommendation> RULES = Map.ofEntries(

            // ── CODEINE (CYP2D6) ────────────────────────────────────────────
            // CYP2D6 converts codeine → morphine. PM = no conversion = ineffective.
            // UM = ultra-fast conversion = toxic morphine accumulation.
            entry("CODEINE:Safe",
                    "Proceed with standard dosing",
                    "Codeine can be used at standard doses. No dose adjustment required.",
                    "Standard pain reassessment at follow-up."),
            entry("CODEINE:Adjust Dosage",
                    "Consider dose reduction or alternative",
                    "Reduced CYP2D6 activity may lower morphine conversion. Start at 50% of standard dose or switch to a non-codeine analgesic.",
                    "Monitor analgesic efficacy and sedation. Reassess within 48 hours."),
            entry("CODEINE:Ineffective",
                    "Avoid codeine — use alternative analgesic",
                    "CYP2D6 Poor Metabolizer: codeine cannot be converted to active morphine. Drug will be ineffective.",
                    "Switch to a non-opioid analgesic (e.g., ibuprofen, paracetamol) or a non-CYP2D6-dependent opioid (e.g., oxycodone)."),
            entry("CODEINE:Toxic",
                    "Contraindicated — use alternative analgesic immediately",
                    "CYP2D6 Ultrarapid Metabolizer: rapid conversion to morphine creates risk of respiratory depression and death at standard doses.",
                    "Do not use codeine. Use a non-CYP2D6-dependent analgesic. Monitor for opioid toxicity signs if already administered."),
            entry("CODEINE:Unknown",
                    UNKNOWN_ACTION, UNKNOWN_RECOMMENDATION, UNKNOWN_MONITORING),

            // ── WARFARIN (CYP2C9) ───────────────────────────────────────────
            // CYP2C9 metabolises S-warfarin. Reduced function = slower clearance = elevated INR.
            entry("WARFARIN:Safe",
                    "Proceed with standard initiation protocol",
                    "CYP2C9 Normal Metabolizer. Use standard warfarin initiation dose per local protocol.",
                    "Monitor INR at day 3, day 7, then weekly until stable."),
            entry("WARFARIN:Adjust Dosage",
                    "Reduce initial warfarin dose by 25–50%",
                    "Reduced CYP2C9 activity will slow warfarin clearance. Initiate at 25–50% of standard dose to avoid supratherapeutic INR.",
                    "Increase INR monitoring frequency: days 3, 5, 7, 10. Target INR 2.0–3.0."),
            entry("WARFARIN:Toxic",
                    "Significantly reduce dose or consider alternative anticoagulant",
                    "CYP2C9 Poor Metabolizer: severely impaired warfarin clearance. Risk of major bleeding at standard doses. Reduce initial dose by ≥50% or switch to a DOAC.",
                    "Daily INR monitoring until stable. Watch for bleeding signs. Consider haematology review."),
            entry("WARFARIN:Ineffective",
                    "Proceed with standard dosing",
                    "No evidence of reduced warfarin efficacy from CYP2C9 status alone.",
                    "Standard INR monitoring."),
            entry("WARFARIN:Unknown",
                    UNKNOWN_ACTION, UNKNOWN_RECOMMENDATION, UNKNOWN_MONITORING),

            // ── CLOPIDOGREL (CYP2C19) ───────────────────────────────────────
            // CYP2C19 activates clopidogrel (prodrug). PM = no active metabolite = no platelet inhibition.
            entry("CLOPIDOGREL:Safe",
                    "Proceed with standard clopidogrel therapy",
                    "CYP2C19 Normal/Rapid Metabolizer. Standard clopidogrel dose provides adequate platelet inhibition.",
                    "Routine cardiovascular monitoring per indication."),
            entry("CLOPIDOGREL:Adjust Dosage",
                    "Consider prasugrel or ticagrelor as alternative",
                    "Reduced CYP2C19 activity may lead to suboptimal platelet inhibition. Consider switching to prasugrel or ticagrelor if clinically indicated.",
                    "Platelet function testing recommended if clopidogrel is continued."),
            entry("CLOPIDOGREL:Ineffective",
                    "Avoid clopidogrel — use prasugrel or ticagrelor",
                    "CYP2C19 Poor Metabolizer: clopidogrel cannot be adequately activated. Risk of stent thrombosis or adverse cardiovascular events.",
                    "Switch to prasugrel 10 mg/day or ticagrelor 90 mg twice daily per cardiology guidance."),
            entry("CLOPIDOGREL:Toxic",
                    "Proceed with standard dosing",
                    "No toxicity risk identified from CYP2C19 status for clopidogrel.",
                    "Standard monitoring."),
            entry("CLOPIDOGREL:Unknown",
                    UNKNOWN_ACTION, UNKNOWN_RECOMMENDATION, UNKNOWN_MONITORING),

            // ── SIMVASTATIN (SLCO1B1) ───────────────────────────────────────
            // SLCO1B1 transports simvastatin into hepatocytes. Reduced function = elevated plasma levels = myopathy.
            entry("SIMVASTATIN:Safe",
                    "Proceed with standard simvastatin dosing",
                    "SLCO1B1 Normal Function. Standard simvastatin dose is appropriate.",
                    "Annual CK monitoring. Report unexplained muscle pain immediately."),
            entry("SIMVASTATIN:Adjust Dosage",
                    "Reduce simvastatin dose or switch statin",
                    "Decreased SLCO1B1 function increases simvastatin plasma exposure. Use ≤20 mg/day or switch to a lower-risk statin (pravastatin, rosuvastatin).",
                    "CK levels at baseline and 3 months. Counsel patient on myopathy symptoms."),
            entry("SIMVASTATIN:Toxic",
                    "Avoid simvastatin — switch to pravastatin or rosuvastatin",
                    "SLCO1B1 Poor Function: high risk of simvastatin-induced myopathy and rhabdomyolysis at standard doses.",
                    "Switch to pravastatin 40 mg or rosuvastatin 20 mg. Baseline CK. Urgent review if muscle symptoms develop."),
            entry("SIMVASTATIN:Ineffective",
                    "Proceed with standard dosing",
                    "No efficacy concern identified from SLCO1B1 status.",
                    "Standard monitoring."),
            entry("SIMVASTATIN:Unknown",
                    UNKNOWN_ACTION, UNKNOWN_RECOMMENDATION, UNKNOWN_MONITORING),

            // ── AZATHIOPRINE (TPMT) ─────────────────────────────────────────
            // TPMT inactivates thiopurines. PM = toxic accumulation of 6-TGN = myelosuppression.
            entry("AZATHIOPRINE:Safe",
                    "Proceed with standard azathioprine dosing",
                    "TPMT Normal Metabolizer. Standard dose is appropriate.",
                    "CBC monthly for 3 months, then every 3 months. LFTs at baseline."),
            entry("AZATHIOPRINE:Adjust Dosage",
                    "Reduce azathioprine dose by 30–70%",
                    "Reduced TPMT activity increases thiopurine metabolite accumulation. Reduce dose by 30–70% and titrate to clinical response.",
                    "CBC weekly for first 4 weeks, then monthly. Monitor for leukopenia."),
            entry("AZATHIOPRINE:Toxic",
                    "Contraindicated — use alternative immunosuppressant",
                    "TPMT Poor Metabolizer: azathioprine at any standard dose will cause life-threatening myelosuppression.",
                    "Do not use azathioprine. Consider mycophenolate mofetil or another non-thiopurine agent. Haematology review required."),
            entry("AZATHIOPRINE:Ineffective",
                    "Proceed with standard dosing",
                    "No efficacy concern from TPMT status alone.",
                    "Standard CBC monitoring."),
            entry("AZATHIOPRINE:Unknown",
                    UNKNOWN_ACTION, UNKNOWN_RECOMMENDATION, UNKNOWN_MONITORING),

            // ── FLUOROURACIL (DPYD) ─────────────────────────────────────────
            // DPYD catabolises 5-FU. PM = severe 5-FU accumulation = life-threatening toxicity.
            entry("FLUOROURACIL:Safe",
                    "Proceed with standard 5-FU dosing",
                    "DPYD Normal Metabolizer. Standard 5-FU dose and schedule are appropriate.",
                    "Standard oncology monitoring: CBC, mucositis assessment, hand-foot syndrome review."),
            entry("FLUOROURACIL:Adjust Dosage",
                    "Reduce 5-FU starting dose by 25–50%",
                    "Reduced DPYD activity will impair 5-FU clearance. Reduce starting dose by 25–50% and escalate only if tolerated.",
                    "Close toxicity monitoring: CBC weekly, mucositis, diarrhoea, and neurotoxicity assessment each cycle."),
            entry("FLUOROURACIL:Toxic",
                    "Contraindicated at standard dose — oncology review required",
                    "DPYD Poor Metabolizer: 5-FU cannot be adequately cleared. Standard doses will cause severe or fatal toxicity (mucositis, neutropenia, neurotoxicity).",
                    "Do not administer standard 5-FU. Consider capecitabine dose reduction per DPYD guidelines or switch to an alternative regimen. Urgent oncology and clinical pharmacology review."),
            entry("FLUOROURACIL:Ineffective",
                    "Proceed with standard dosing",
                    "No efficacy concern from DPYD status alone.",
                    "Standard oncology monitoring."),
            entry("FLUOROURACIL:Unknown",
                    UNKNOWN_ACTION, UNKNOWN_RECOMMENDATION, UNKNOWN_MONITORING)
    );

    // ── fallback ─────────────────────────────────────────────────────────────
    private static final ClinicalRecommendation FALLBACK = new ClinicalRecommendation(
            UNKNOWN_ACTION, UNKNOWN_RECOMMENDATION, UNKNOWN_MONITORING
    );

    /**
     * Returns a deterministic ClinicalRecommendation for the given drug and risk label.
     * Never returns null — falls back to a safe "seek specialist review" entry.
     *
     * @param drug      Uppercased drug name, e.g. "FLUOROURACIL"
     * @param riskLabel One of: Safe | Adjust Dosage | Toxic | Ineffective | Unknown
     */
    public ClinicalRecommendation recommend(String drug, String riskLabel) {
        if (drug == null || riskLabel == null) return FALLBACK;
        return RULES.getOrDefault(drug.toUpperCase() + ":" + riskLabel, FALLBACK);
    }

    // ── helper to build map entries concisely ────────────────────────────────

    private static Map.Entry<String, ClinicalRecommendation> entry(
            String key, String action, String recommendation, String monitoring) {
        return Map.entry(key, new ClinicalRecommendation(action, recommendation, monitoring));
    }
}

