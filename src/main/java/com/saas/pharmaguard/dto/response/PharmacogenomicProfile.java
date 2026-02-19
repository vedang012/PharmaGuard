package com.saas.pharmaguard.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class PharmacogenomicProfile {

    @JsonProperty("primary_gene")
    private final String primaryGene;

    @JsonProperty("diplotype")
    private final String diplotype;

    @JsonProperty("phenotype")
    private final String phenotype;

    @JsonProperty("detected_variants")
    private final List<DetectedVariant> detectedVariants;

    public PharmacogenomicProfile(String primaryGene, String diplotype,
                                  String phenotype, List<DetectedVariant> detectedVariants) {
        this.primaryGene      = primaryGene;
        this.diplotype        = diplotype;
        this.phenotype        = phenotype;
        this.detectedVariants = detectedVariants;
    }

    public String getPrimaryGene()                    { return primaryGene; }
    public String getDiplotype()                      { return diplotype; }
    public String getPhenotype()                      { return phenotype; }
    public List<DetectedVariant> getDetectedVariants(){ return detectedVariants; }
}

