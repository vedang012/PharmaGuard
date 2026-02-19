package com.saas.pharmaguard.dto;

/**
 * One drug risk evaluation result.
 *
 * riskLabel is always one of: Safe | Adjust Dosage | Toxic | Ineffective | Unknown
 */
public class DrugRiskResult {

    private final String        drug;
    private final String        basedOnGene;
    private final String        phenotype;
    private final RiskAssessment riskAssessment;

    public DrugRiskResult(String drug, String basedOnGene, String phenotype,
                          RiskAssessment riskAssessment) {
        this.drug           = drug;
        this.basedOnGene    = basedOnGene;
        this.phenotype      = phenotype;
        this.riskAssessment = riskAssessment;
    }

    public String        getDrug()           { return drug; }
    public String        getBasedOnGene()    { return basedOnGene; }
    public String        getPhenotype()      { return phenotype; }
    public RiskAssessment getRiskAssessment() { return riskAssessment; }
}
