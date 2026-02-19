package com.saas.pharmaguard.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public class QualityMetrics {

    @JsonProperty("vcf_parsing_success")
    private final boolean vcfParsingSuccess;

    public QualityMetrics(boolean vcfParsingSuccess) {
        this.vcfParsingSuccess = vcfParsingSuccess;
    }

    public boolean isVcfParsingSuccess() { return vcfParsingSuccess; }
}

