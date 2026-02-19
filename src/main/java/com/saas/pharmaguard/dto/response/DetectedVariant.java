package com.saas.pharmaguard.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public class DetectedVariant {

    @JsonProperty("rsid")
    private final String rsid;

    @JsonProperty("star_allele")
    private final String starAllele;

    @JsonProperty("genotype")
    private final String genotype;

    public DetectedVariant(String rsid, String starAllele, String genotype) {
        this.rsid       = rsid;
        this.starAllele = starAllele;
        this.genotype   = genotype;
    }

    public String getRsid()       { return rsid; }
    public String getStarAllele() { return starAllele; }
    public String getGenotype()   { return genotype; }
}

