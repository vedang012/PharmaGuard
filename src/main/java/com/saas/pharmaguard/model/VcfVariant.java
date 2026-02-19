// VcfVariant.java
package com.saas.pharmaguard.model;

import lombok.*;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
public class VcfVariant {
    private String chrom;
    private int position;
    private String rsid;
    private String ref;
    private String alt;
    private String filter;
    private String gene;        // from INFO GENE=
    private String starAllele;  // from INFO STAR=
    private String genotype;    // e.g. 0/1
    private Map<String, String> infoFields;

    public boolean isHomozygousAlt() {
        return "1/1".equals(genotype) || "1|1".equals(genotype);
    }

    public boolean isHeterozygous() {
        return "0/1".equals(genotype) || "1|0".equals(genotype)
                || "0|1".equals(genotype) || "1|0".equals(genotype);
    }

    public VcfVariant(String chrom, int position, String rsid, String ref, String alt, String filter, String gene, String starAllele, String genotype, Map<String, String> infoFields) {
        this.chrom = chrom;
        this.position = position;
        this.rsid = rsid;
        this.ref = ref;
        this.alt = alt;
        this.filter = filter;
        this.gene = gene;
        this.starAllele = starAllele;
        this.genotype = genotype;
        this.infoFields = infoFields;
    }

    public String getChrom() {
        return chrom;
    }

    public void setChrom(String chrom) {
        this.chrom = chrom;
    }

    public int getPosition() {
        return position;
    }

    public void setPosition(int position) {
        this.position = position;
    }

    public String getRsid() {
        return rsid;
    }

    public void setRsid(String rsid) {
        this.rsid = rsid;
    }

    public String getRef() {
        return ref;
    }

    public void setRef(String ref) {
        this.ref = ref;
    }

    public String getAlt() {
        return alt;
    }

    public void setAlt(String alt) {
        this.alt = alt;
    }

    public String getFilter() {
        return filter;
    }

    public void setFilter(String filter) {
        this.filter = filter;
    }

    public String getGene() {
        return gene;
    }

    public void setGene(String gene) {
        this.gene = gene;
    }

    public String getStarAllele() {
        return starAllele;
    }

    public void setStarAllele(String starAllele) {
        this.starAllele = starAllele;
    }

    public String getGenotype() {
        return genotype;
    }

    public void setGenotype(String genotype) {
        this.genotype = genotype;
    }

    public Map<String, String> getInfoFields() {
        return infoFields;
    }

    public void setInfoFields(Map<String, String> infoFields) {
        this.infoFields = infoFields;
    }
}