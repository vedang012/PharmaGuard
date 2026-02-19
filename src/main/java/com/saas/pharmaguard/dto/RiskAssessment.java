package com.saas.pharmaguard.dto;

/**
 * Deterministic risk assessment for one drug evaluation.
 *
 * severity      : none | low | moderate | high | critical
 * confidenceScore: 0.0 – 1.0, rules documented in RiskAssessmentBuilder
 */
public class RiskAssessment {

    private final String riskLabel;
    private final double confidenceScore;
    private final String severity;

    public RiskAssessment(String riskLabel, double confidenceScore, String severity) {
        this.riskLabel       = riskLabel;
        this.confidenceScore = confidenceScore;
        this.severity        = severity;
    }

    public String getRiskLabel()       { return riskLabel; }
    public double getConfidenceScore() { return confidenceScore; }
    public String getSeverity()        { return severity; }
}

