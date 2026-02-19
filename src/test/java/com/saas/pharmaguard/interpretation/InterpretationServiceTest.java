package com.saas.pharmaguard.interpretation;

import com.saas.pharmaguard.model.GeneProfile;
import com.saas.pharmaguard.model.VcfVariant;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for the interpretation pipeline.
 * No Spring context needed — pure logic tests.
 */
class InterpretationServiceTest {

    private InterpretationService service;

    @BeforeEach
    void setUp() {
        service = new InterpretationService();
    }

    // ── helpers ─────────────────────────────────────────────────────────────

    /** Build a minimal VcfVariant with the fields the interpreter cares about. */
    private VcfVariant variant(String gene, String starAllele, String genotype) {
        return new VcfVariant(
                "chr10", 0, ".", "C", "T", "PASS",
                gene, starAllele, genotype, null
        );
    }

    // ── filter tests ────────────────────────────────────────────────────────

    @Test
    @DisplayName("Empty/null input → all 6 panel genes backfilled as *1/*1 NM")
    void emptyVariants_returnsFullPanelAsWildType() {
        List<GeneProfile> profiles = service.interpret(List.of());
        // Every required panel gene must be present even with zero input variants
        assertEquals(InterpretationService.REQUIRED_PANEL.size(), profiles.size());
        for (GeneProfile p : profiles) {
            assertEquals("*1/*1", p.getDiplotype(),
                    p.getGene() + " should default to *1/*1 but was " + p.getDiplotype());
            assertTrue(p.getPhenotype().contains("NM") || p.getPhenotype().contains("Normal"),
                    p.getGene() + " default phenotype should be NM, got: " + p.getPhenotype());
        }
    }

    @Test
    @DisplayName("0/0 genotypes are ignored — gene falls back to *1/*1 NM via panel backfill")
    void refHomozygousOnly_backfilledAsWildType() {
        VcfVariant refRef = variant("CYP2C19", "*1", "0/0");
        List<GeneProfile> profiles = service.interpret(List.of(refRef));

        // CYP2C19 must still appear — backfilled as *1/*1
        GeneProfile cyp2c19 = profiles.stream()
                .filter(p -> "CYP2C19".equals(p.getGene()))
                .findFirst()
                .orElseThrow(() -> new AssertionError("CYP2C19 missing from output"));

        assertEquals("*1/*1", cyp2c19.getDiplotype());
    }

    // ── panel backfill ──────────────────────────────────────────────────────

    @Test
    @DisplayName("Panel genes with no variants in VCF → backfilled as *1/*1 NM")
    void missingPanelGenes_backfilledWithWildType() {
        // Only supply one gene — the other 5 must be defaulted
        VcfVariant v = variant("CYP2C19", "*2", "0/1");
        List<GeneProfile> profiles = service.interpret(List.of(v));

        assertEquals(InterpretationService.REQUIRED_PANEL.size(), profiles.size(),
                "Output must always contain all 6 panel genes");

        // CYP2C19 resolved normally
        GeneProfile cyp2c19 = profiles.stream()
                .filter(p -> "CYP2C19".equals(p.getGene())).findFirst().orElseThrow();
        assertEquals("*1/*2", cyp2c19.getDiplotype());

        // Every other panel gene defaulted to *1/*1
        profiles.stream()
                .filter(p -> !"CYP2C19".equals(p.getGene()))
                .forEach(p -> assertEquals("*1/*1", p.getDiplotype(),
                        p.getGene() + " should be *1/*1 but was " + p.getDiplotype()));
    }

    // ── homozygousAlt precedence ─────────────────────────────────────────────

    @Test
    @DisplayName("HomozygousAlt takes precedence — het entries for same gene ignored")
    void homozygousAlt_precedence_overHet() {
        // VCF has both a 1/1 and a 0/1 entry for the same gene (annotation artefact)
        VcfVariant homAlt = variant("CYP2D6", "*4", "1/1");
        VcfVariant het    = variant("CYP2D6", "*6", "0/1");  // must be ignored

        GeneProfile p = service.interpret(List.of(homAlt, het)).stream()
                .filter(gp -> "CYP2D6".equals(gp.getGene())).findFirst().orElseThrow();

        assertEquals("*4/*4", p.getDiplotype(),
                "HomozygousAlt *4 should dominate; het *6 must be discarded");
        assertTrue(p.getPhenotype().startsWith("PM"),
                "Expected PM but got: " + p.getPhenotype());
    }

    // ── single heterozygous ─────────────────────────────────────────────────

    @Test
    @DisplayName("CYP2C19 *1/*2  →  IM (single het 0/1)")
    void cyp2c19_singleHet_star2_isIM() {
        VcfVariant v = variant("CYP2C19", "*2", "0/1");
        List<GeneProfile> profiles = service.interpret(List.of(v));

        assertEquals(1, profiles.size());
        GeneProfile p = profiles.get(0);
        assertEquals("CYP2C19",              p.getGene());
        assertEquals("*1/*2",                p.getDiplotype());
        assertTrue(p.getPhenotype().startsWith("IM"),
                "Expected IM but got: " + p.getPhenotype());
    }

    @Test
    @DisplayName("CYP2C19 *1/*17  →  RM (gain-of-function het)")
    void cyp2c19_singleHet_star17_isRM() {
        VcfVariant v = variant("CYP2C19", "*17", "0/1");
        GeneProfile p = service.interpret(List.of(v)).get(0);
        assertEquals("*1/*17", p.getDiplotype());
        assertTrue(p.getPhenotype().startsWith("RM"),
                "Expected RM but got: " + p.getPhenotype());
    }

    // ── homozygous alt ───────────────────────────────────────────────────────

    @Test
    @DisplayName("CYP2C19 *2/*2  →  PM (homozygous alt 1/1)")
    void cyp2c19_homozygousAlt_star2_isPM() {
        VcfVariant v = variant("CYP2C19", "*2", "1/1");
        GeneProfile p = service.interpret(List.of(v)).get(0);
        assertEquals("*2/*2", p.getDiplotype());
        assertTrue(p.getPhenotype().startsWith("PM"),
                "Expected PM but got: " + p.getPhenotype());
    }

    @Test
    @DisplayName("CYP2D6 *4/*4  →  PM (homozygous alt 1/1)")
    void cyp2d6_homozygousAlt_star4_isPM() {
        VcfVariant v = variant("CYP2D6", "*4", "1/1");
        GeneProfile p = service.interpret(List.of(v)).get(0);
        assertEquals("*4/*4", p.getDiplotype());
        assertTrue(p.getPhenotype().startsWith("PM"),
                "Expected PM but got: " + p.getPhenotype());
    }

    // ── compound heterozygous ────────────────────────────────────────────────

    @Test
    @DisplayName("CYP2C9 compound het *2/*3  →  PM (two different 0/1 variants)")
    void cyp2c9_compoundHet_star2_star3_isPM() {
        // Two different loss-of-function alleles, one on each chromosome
        VcfVariant v1 = variant("CYP2C9", "*2", "0/1");
        VcfVariant v2 = variant("CYP2C9", "*3", "0/1");
        GeneProfile p = service.interpret(List.of(v1, v2)).get(0);
        // DiplotypeResolver returns *2/*3 (order of insertion)
        assertTrue(p.getDiplotype().equals("*2/*3") || p.getDiplotype().equals("*3/*2"),
                "Unexpected diplotype: " + p.getDiplotype());
        assertTrue(p.getPhenotype().startsWith("PM"),
                "Expected PM but got: " + p.getPhenotype());
    }

    @Test
    @DisplayName("TPMT *1/*3A  →  IM (single het)")
    void tpmt_singleHet_star3A_isIM() {
        VcfVariant v = variant("TPMT", "*3A", "0/1");
        GeneProfile p = service.interpret(List.of(v)).get(0);
        assertEquals("*1/*3A", p.getDiplotype());
        assertTrue(p.getPhenotype().startsWith("IM"),
                "Expected IM but got: " + p.getPhenotype());
    }

    @Test
    @DisplayName("DPYD *2A/*2A  →  PM (homozygous alt)")
    void dpyd_homozygousAlt_star2A_isPM() {
        VcfVariant v = variant("DPYD", "*2A", "1/1");
        GeneProfile p = service.interpret(List.of(v)).get(0);
        assertEquals("*2A/*2A", p.getDiplotype());
        assertTrue(p.getPhenotype().startsWith("PM"),
                "Expected PM but got: " + p.getPhenotype());
    }

    // ── multi-gene ───────────────────────────────────────────────────────────

    @Test
    @DisplayName("Multiple genes in one VCF → one GeneProfile per gene")
    void multipleGenes_oneProfileEach() {
        List<VcfVariant> variants = List.of(
                variant("CYP2C19", "*2",  "0/1"),   // → *1/*2  IM
                variant("CYP2D6",  "*4",  "1/1"),   // → *4/*4  PM
                variant("SLCO1B1", "*5",  "0/1"),   // → *1/*5  Decreased Function
                variant("TPMT",    "*3C", "0/1")    // → *1/*3C IM
        );

        List<GeneProfile> profiles = service.interpret(variants);
        assertEquals(4, profiles.size(), "Expected one profile per gene");

        // Profiles are sorted alphabetically by gene
        assertEquals("CYP2C19", profiles.get(0).getGene());
        assertEquals("CYP2D6",  profiles.get(1).getGene());
        assertEquals("SLCO1B1", profiles.get(2).getGene());
        assertEquals("TPMT",    profiles.get(3).getGene());
    }

    // ── diploid hard limit ───────────────────────────────────────────────────

    @Test
    @DisplayName("More than 2 het variants for same gene → only first two alleles used")
    void tooManyAllelesForGene_hardLimitEnforced() {
        // Biologically impossible but guards against bad VCF annotation
        List<VcfVariant> variants = List.of(
                variant("CYP2C19", "*2",  "0/1"),
                variant("CYP2C19", "*3",  "0/1"),
                variant("CYP2C19", "*17", "0/1")  // third allele — must be ignored
        );

        List<GeneProfile> profiles = service.interpret(variants);
        assertEquals(1, profiles.size());

        GeneProfile p = profiles.get(0);
        // diplotype must contain exactly 2 alleles
        String[] parts = p.getDiplotype().split("/");
        assertEquals(2, parts.length, "Diplotype must have exactly 2 alleles: " + p.getDiplotype());
    }

    // ── unknown diplotype fallback ────────────────────────────────────────────

    @Test
    @DisplayName("Diplotype not in rule table → UNKNOWN fallback message returned")
    void unknownDiplotype_returnsFallbackString() {
        // *99 is not a real allele — simulates a novel / uncatalogued variant
        VcfVariant v = variant("CYP2C19", "*99", "0/1");
        GeneProfile p = service.interpret(List.of(v)).get(0);
        assertTrue(p.getPhenotype().startsWith("UNKNOWN"),
                "Expected UNKNOWN fallback but got: " + p.getPhenotype());
    }
}
