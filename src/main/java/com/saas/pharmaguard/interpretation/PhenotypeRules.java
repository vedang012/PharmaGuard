package com.saas.pharmaguard.interpretation;

import java.util.HashMap;
import java.util.Map;

/**
 * In-memory phenotype rule tables for all supported pharmacogenes.
 *
 * BIOLOGICAL REASONING:
 * Each gene encodes a drug-metabolising enzyme. Star alleles (*1, *2, *17…)
 * are named haplotypes — specific combinations of SNPs on one chromosome copy.
 * The DIPLOTYPE (both alleles together) determines total enzyme activity:
 *
 *   *1 = fully functional (reference / wild-type)
 *   Loss-of-function alleles (*2, *3, *4…) reduce or abolish enzyme activity.
 *   Gain-of-function alleles (*17 in CYP2C19, *XN duplications in CYP2D6)
 *     increase activity.
 *
 * These rules follow CPIC (Clinical Pharmacogenomics Implementation Consortium)
 * published guidelines (cpicpgx.org).
 *
 * Lookup key: "ALLELE_A/ALLELE_B"  — always sorted so *1/*2 == *2/*1.
 * Fallback:   "UNKNOWN – no rule defined for this diplotype"
 */
public final class PhenotypeRules {

    // gene → (diplotype-key → phenotype label)
    private static final Map<String, Map<String, String>> RULES = new HashMap<>();

    static {
        // ------------------------------------------------------------------ //
        //  CYP2C19  — metabolises clopidogrel, PPIs, SSRIs, voriconazole
        //  Key loss-of-function: *2, *3  |  gain-of-function: *17
        // ------------------------------------------------------------------ //
        Map<String, String> cyp2c19 = new HashMap<>();
        cyp2c19.put("*1/*1",   "NM – Normal Metabolizer");
        cyp2c19.put("*1/*2",   "IM – Intermediate Metabolizer");
        cyp2c19.put("*1/*3",   "IM – Intermediate Metabolizer");
        cyp2c19.put("*2/*2",   "PM – Poor Metabolizer");
        cyp2c19.put("*2/*3",   "PM – Poor Metabolizer");
        cyp2c19.put("*3/*3",   "PM – Poor Metabolizer");
        cyp2c19.put("*1/*17",  "RM – Rapid Metabolizer");
        cyp2c19.put("*2/*17",  "IM – Intermediate Metabolizer");  // one LOF offsets one GOF
        cyp2c19.put("*17/*17", "UM – Ultrarapid Metabolizer");
        RULES.put("CYP2C19", cyp2c19);

        // ------------------------------------------------------------------ //
        //  CYP2D6  — metabolises codeine, tamoxifen, many antidepressants
        //  Key loss-of-function: *3, *4, *5, *6  |  gain-of-function: *XN (duplication)
        // ------------------------------------------------------------------ //
        Map<String, String> cyp2d6 = new HashMap<>();
        cyp2d6.put("*1/*1",  "NM – Normal Metabolizer");
        cyp2d6.put("*1/*2",  "NM – Normal Metabolizer");
        cyp2d6.put("*2/*2",  "NM – Normal Metabolizer");
        cyp2d6.put("*1/*4",  "IM – Intermediate Metabolizer");
        cyp2d6.put("*1/*5",  "IM – Intermediate Metabolizer");
        cyp2d6.put("*1/*6",  "IM – Intermediate Metabolizer");
        cyp2d6.put("*4/*4",  "PM – Poor Metabolizer");
        cyp2d6.put("*4/*5",  "PM – Poor Metabolizer");
        cyp2d6.put("*5/*5",  "PM – Poor Metabolizer");
        cyp2d6.put("*3/*4",  "PM – Poor Metabolizer");
        cyp2d6.put("*4/*6",  "PM – Poor Metabolizer");
        cyp2d6.put("*1/*1xN","UM – Ultrarapid Metabolizer");  // gene duplication
        cyp2d6.put("*1/*2xN","UM – Ultrarapid Metabolizer");
        RULES.put("CYP2D6", cyp2d6);

        // ------------------------------------------------------------------ //
        //  CYP2C9  — metabolises warfarin, NSAIDs, phenytoin
        //  Key loss-of-function: *2, *3
        // ------------------------------------------------------------------ //
        Map<String, String> cyp2c9 = new HashMap<>();
        cyp2c9.put("*1/*1", "NM – Normal Metabolizer");
        cyp2c9.put("*1/*2", "IM – Intermediate Metabolizer");
        cyp2c9.put("*1/*3", "IM – Intermediate Metabolizer");
        cyp2c9.put("*2/*2", "IM – Intermediate Metabolizer");
        cyp2c9.put("*2/*3", "PM – Poor Metabolizer");
        cyp2c9.put("*3/*3", "PM – Poor Metabolizer");
        RULES.put("CYP2C9", cyp2c9);

        // ------------------------------------------------------------------ //
        //  SLCO1B1  — hepatic uptake transporter; affects statin myopathy risk
        //  Key variant: *5 (c.521T>C, rs4149056) — reduced transport function
        // ------------------------------------------------------------------ //
        Map<String, String> slco1b1 = new HashMap<>();
        slco1b1.put("*1/*1", "Normal Function");
        slco1b1.put("*1/*5", "Decreased Function – Increased Statin Myopathy Risk");
        slco1b1.put("*1/*15","Decreased Function – Increased Statin Myopathy Risk");
        slco1b1.put("*5/*5", "Poor Function – High Statin Myopathy Risk");
        slco1b1.put("*5/*15","Poor Function – High Statin Myopathy Risk");
        slco1b1.put("*15/*15","Poor Function – High Statin Myopathy Risk");
        RULES.put("SLCO1B1", slco1b1);

        // ------------------------------------------------------------------ //
        //  TPMT  — thiopurine methyltransferase; affects azathioprine/6-MP toxicity
        //  Key loss-of-function: *2, *3A, *3B, *3C
        // ------------------------------------------------------------------ //
        Map<String, String> tpmt = new HashMap<>();
        tpmt.put("*1/*1",   "NM – Normal Metabolizer");
        tpmt.put("*1/*2",   "IM – Intermediate Metabolizer");
        tpmt.put("*1/*3A",  "IM – Intermediate Metabolizer");
        tpmt.put("*1/*3B",  "IM – Intermediate Metabolizer");
        tpmt.put("*1/*3C",  "IM – Intermediate Metabolizer");
        tpmt.put("*2/*3A",  "PM – Poor Metabolizer");
        tpmt.put("*3A/*3A", "PM – Poor Metabolizer");
        tpmt.put("*3A/*3C", "PM – Poor Metabolizer");
        tpmt.put("*3C/*3C", "PM – Poor Metabolizer");
        RULES.put("TPMT", tpmt);

        // ------------------------------------------------------------------ //
        //  DPYD  — dihydropyrimidine dehydrogenase; affects 5-fluorouracil toxicity
        //  Key loss-of-function: *2A (splice variant), c.2846A>T (*13), HapB3
        // ------------------------------------------------------------------ //
        Map<String, String> dpyd = new HashMap<>();
        dpyd.put("*1/*1",   "NM – Normal Metabolizer");
        dpyd.put("*1/*2A",  "IM – Intermediate Metabolizer");
        dpyd.put("*1/*13",  "IM – Intermediate Metabolizer");
        dpyd.put("*2A/*2A", "PM – Poor Metabolizer");
        dpyd.put("*2A/*13", "PM – Poor Metabolizer");
        dpyd.put("*13/*13", "PM – Poor Metabolizer");
        RULES.put("DPYD", dpyd);
    }

    private PhenotypeRules() {} // utility class — no instantiation

    /**
     * Look up a phenotype for a given gene + two alleles.
     * The lookup is order-independent: *1/*2 and *2/*1 return the same result.
     *
     * @param gene    e.g. "CYP2C19"
     * @param allele1 e.g. "*1"
     * @param allele2 e.g. "*2"
     * @return phenotype string, or a descriptive unknown fallback
     */
    public static String lookup(String gene, String allele1, String allele2) {
        Map<String, String> geneRules = RULES.get(gene);
        if (geneRules == null) {
            return "UNKNOWN – gene '" + gene + "' not in rule set";
        }

        // Try both orderings since the map keys are written in one canonical order
        String keyAB = allele1 + "/" + allele2;
        String keyBA = allele2 + "/" + allele1;

        if (geneRules.containsKey(keyAB)) return geneRules.get(keyAB);
        if (geneRules.containsKey(keyBA)) return geneRules.get(keyBA);

//        return "UNKNOWN – no rule defined for diplotype " + keyAB + " in " + gene;
        return "UNKNOWN";
    }
}

