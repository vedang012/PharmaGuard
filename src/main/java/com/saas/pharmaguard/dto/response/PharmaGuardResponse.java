package com.saas.pharmaguard.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.saas.pharmaguard.dto.RiskAssessment;

public class PharmaGuardResponse {

    @JsonProperty("patient_id")
    private final String patientId;

    @JsonProperty("drug")
    private final String drug;

    @JsonProperty("timestamp")
    private final String timestamp;

    @JsonProperty("risk_assessment")
    private final RiskAssessment riskAssessment;

    @JsonProperty("pharmacogenomic_profile")
    private final PharmacogenomicProfile pharmacogenomicProfile;

    @JsonProperty("clinical_recommendation")
    private final Object clinicalRecommendation;

    @JsonProperty("llm_generated_explanation")
    private final Object llmGeneratedExplanation;

    @JsonProperty("quality_metrics")
    private final QualityMetrics qualityMetrics;

    public PharmaGuardResponse(String patientId,
                               String drug,
                               String timestamp,
                               RiskAssessment riskAssessment,
                               PharmacogenomicProfile pharmacogenomicProfile,
                               QualityMetrics qualityMetrics) {
        this.patientId               = patientId;
        this.drug                    = drug;
        this.timestamp               = timestamp;
        this.riskAssessment          = riskAssessment;
        this.pharmacogenomicProfile  = pharmacogenomicProfile;
        this.clinicalRecommendation  = new Object();  // placeholder — populated later
        this.llmGeneratedExplanation = new Object();  // placeholder — populated by LLM layer
        this.qualityMetrics          = qualityMetrics;
    }

    public String                  getPatientId()              { return patientId; }
    public String                  getDrug()                   { return drug; }
    public String                  getTimestamp()              { return timestamp; }
    public RiskAssessment          getRiskAssessment()         { return riskAssessment; }
    public PharmacogenomicProfile  getPharmacogenomicProfile() { return pharmacogenomicProfile; }
    public Object                  getClinicalRecommendation() { return clinicalRecommendation; }
    public Object                  getLlmGeneratedExplanation(){ return llmGeneratedExplanation; }
    public QualityMetrics          getQualityMetrics()         { return qualityMetrics; }
}

