package com.saas.pharmaguard.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public class LlmExplanation {

    @JsonProperty("summary")
    private final String summary;

    public LlmExplanation(String summary) {
        this.summary = summary;
    }

    public String getSummary() { return summary; }
}

