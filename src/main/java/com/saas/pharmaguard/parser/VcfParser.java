// VcfParser.java
package com.saas.pharmaguard.parser;

import com.saas.pharmaguard.model.*;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.*;

@Component
public class VcfParser {

    // Target pharmacogenomic genes
    private static final Set<String> TARGET_GENES = Set.of(
            "CYP2D6", "CYP2C19", "CYP2C9", "SLCO1B1", "TPMT", "DPYD"
    );



    public VcfParseResult parse(MultipartFile file) throws Exception {
        List<VcfVariant> variants = new ArrayList<>();
        Map<String, String> metadata = new LinkedHashMap<>();
        List<String> errors = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream()))) {

            String line;
            String[] headers = null;

            while ((line = reader.readLine()) != null) {
                if (line.startsWith("##")) {
                    // Parse metadata headers
                    parseMetaLine(line, metadata);
                } else if (line.startsWith("#CHROM")) {
                    // Column headers
                    headers = line.substring(1).split("\t");
                } else if (!line.isBlank()) {
                    // Data line
                    VcfVariant variant = parseDataLine(line, headers, errors);
                    if (variant != null && TARGET_GENES.contains(variant.getGene())) {
                        variants.add(variant);
                    }
                }
            }
        }

        return new VcfParseResult(variants, metadata, errors);
    }

    private void parseMetaLine(String line, Map<String, String> metadata) {
        // e.g. ##fileformat=VCFv4.2 or ##INFO=<...>
        if (line.startsWith("##fileformat")) {
            metadata.put("fileformat", line.split("=", 2)[1]);
        } else if (line.startsWith("##reference")) {
            metadata.put("reference", line.split("=", 2)[1]);
        }
    }

    private VcfVariant parseDataLine(String line, String[] headers, List<String> errors) {
        String[] cols = line.split("\t");
        if (cols.length < 8) {
            errors.add("Malformed line (too few columns): " + line.substring(0, Math.min(50, line.length())));
            return null;
        }

        try {
            String chrom  = cols[0];
            int    pos    = Integer.parseInt(cols[1]);
            String id     = cols[2]; // rsID e.g. rs4244285
            String ref    = cols[3];
            String alt    = cols[4];
            String filter = cols[6];
            String info   = cols[7];

            // Parse INFO field key=value pairs
            Map<String, String> infoMap = parseInfo(info);

            String gene  = infoMap.getOrDefault("GENE", "");
            String star  = infoMap.getOrDefault("STAR", "");   // e.g. *2
            String rsid  = id.startsWith("rs") ? id : infoMap.getOrDefault("RS", id);

            // Genotype from sample column (index 9) if present
            String genotype = null;
            String format   = cols.length > 8 ? cols[8] : null;
            String sample   = cols.length > 9 ? cols[9] : null;
            if (format != null && sample != null) {
                genotype = extractGenotype(format, sample);
            }

            return VcfVariant.builder()
                    .chrom(chrom)
                    .position(pos)
                    .rsid(rsid)
                    .ref(ref)
                    .alt(alt)
                    .filter(filter)
                    .gene(gene)
                    .starAllele(star)
                    .genotype(genotype)
                    .infoFields(infoMap)
                    .build();

        } catch (NumberFormatException e) {
            errors.add("Could not parse position in line: " + line.substring(0, Math.min(50, line.length())));
            return null;
        }
    }

    private Map<String, String> parseInfo(String info) {
        Map<String, String> map = new LinkedHashMap<>();
        if (info == null || info.equals(".")) return map;
        for (String token : info.split(";")) {
            String[] kv = token.split("=", 2);
            map.put(kv[0], kv.length > 1 ? kv[1] : "true");
        }
        return map;
    }

    private String extractGenotype(String format, String sample) {
        String[] fmtKeys = format.split(":");
        String[] smpVals = sample.split(":");
        for (int i = 0; i < fmtKeys.length; i++) {
            if ("GT".equals(fmtKeys[i]) && i < smpVals.length) {
                return smpVals[i]; // e.g. "0/1" or "1|1"
            }
        }
        return null;
    }
}