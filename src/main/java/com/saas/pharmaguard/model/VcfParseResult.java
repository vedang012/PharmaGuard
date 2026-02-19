package com.saas.pharmaguard.model;

import lombok.*;
import java.util.*;

@Data
public class VcfParseResult {
    private List<VcfVariant> variants;
    private Map<String, String> metadata;
    private List<String> errors;

    public boolean isSuccess() {
        return errors.isEmpty();
    }

    public VcfParseResult(List<VcfVariant> variants, Map<String, String> metadata, List<String> errors) {
        this.variants = variants;
        this.metadata = metadata;
        this.errors = errors;
    }

    public List<VcfVariant> getVariantsByGene(String gene) {
        return variants.stream()
                .filter(v -> gene.equalsIgnoreCase(v.getGene()))
                .toList();
    }

    public List<VcfVariant> getVariants() {
        return variants;
    }

    public void setVariants(List<VcfVariant> variants) {
        this.variants = variants;
    }

    public Map<String, String> getMetadata() {
        return metadata;
    }

    public void setMetadata(Map<String, String> metadata) {
        this.metadata = metadata;
    }

    public List<String> getErrors() {
        return errors;
    }

    public void setErrors(List<String> errors) {
        this.errors = errors;
    }
}