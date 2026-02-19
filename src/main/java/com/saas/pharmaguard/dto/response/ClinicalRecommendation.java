package com.saas.pharmaguard.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ClinicalRecommendation {

    @JsonProperty("action")
    private final String action;

    @JsonProperty("recommendation")
    private final String recommendation;

    @JsonProperty("monitoring")
    private final String monitoring;

    public ClinicalRecommendation(String action, String recommendation, String monitoring) {
        this.action         = action;
        this.recommendation = recommendation;
        this.monitoring     = monitoring;
    }

    public String getAction()         { return action; }
    public String getRecommendation() { return recommendation; }
    public String getMonitoring()     { return monitoring; }
}

