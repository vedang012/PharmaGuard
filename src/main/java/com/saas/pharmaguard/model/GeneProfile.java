package com.saas.pharmaguard.model;

/**
 * Represents the pharmacogenomic interpretation result for a single gene.
 *
 * BIOLOGICAL REASONING:
 * Humans are diploid — they carry exactly 2 copies (alleles) of every autosomal gene,
 * one inherited from each parent. In pharmacogenomics, these two alleles are expressed
 * together as a "diplotype" (e.g., *1/*2). The combined activity of both alleles
 * determines the patient's metabolizer phenotype, which directly predicts how fast
 * they process a given drug.
 *
 * Phenotype categories (standard CPIC definitions):
 *   PM  = Poor Metabolizer       — little/no enzyme activity
 *   IM  = Intermediate Metabolizer — reduced activity
 *   NM  = Normal Metabolizer     — standard activity
 *   RM  = Rapid Metabolizer      — increased activity
 *   UM  = Ultrarapid Metabolizer — very high activity
 */
public class GeneProfile {

    private final String gene;
    private final String allele1;
    private final String allele2;
    private final String diplotype;   // e.g. "*1/*2"
    private final String phenotype;   // e.g. "IM - Intermediate Metabolizer"

    public GeneProfile(String gene, String allele1, String allele2, String phenotype) {
        this.gene = gene;
        this.allele1 = allele1;
        this.allele2 = allele2;
        // Canonical form: lower star number first for readability
        this.diplotype = allele1 + "/" + allele2;
        this.phenotype = phenotype;
    }

    public String getGene()      { return gene; }
    public String getAllele1()   { return allele1; }
    public String getAllele2()   { return allele2; }
    public String getDiplotype() { return diplotype; }
    public String getPhenotype() { return phenotype; }

    @Override
    public String toString() {
        return String.format("GeneProfile{gene='%s', diplotype='%s', phenotype='%s'}",
                gene, diplotype, phenotype);
    }
}

