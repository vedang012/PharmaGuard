package com.saas.pharmaguard.dto;

import com.saas.pharmaguard.model.GeneProfile;

import java.util.List;
import java.util.Map;

/**
 * Strongly typed response DTO for POST /analyse.
 *
 * Deliberately contains NO raw VCF variants — those belong only in the
 * dev /parse endpoint. This keeps the production contract minimal and stable.
 */
public class AnalysisResponse {

    private final Map<String, String> metadata;
    private final List<GeneProfile>   geneProfiles;
    private final List<DrugRiskResult> drugRisks;
    private final List<String>        parseErrors;

    public AnalysisResponse(Map<String, String>  metadata,
                            List<GeneProfile>    geneProfiles,
                            List<DrugRiskResult> drugRisks,
                            List<String>         parseErrors) {
        this.metadata     = metadata;
        this.geneProfiles = geneProfiles;
        this.drugRisks    = drugRisks;
        this.parseErrors  = parseErrors;
    }

    public Map<String, String>  getMetadata()     { return metadata; }
    public List<GeneProfile>    getGeneProfiles() { return geneProfiles; }
    public List<DrugRiskResult> getDrugRisks()    { return drugRisks; }
    public List<String>         getParseErrors()  { return parseErrors; }
}
