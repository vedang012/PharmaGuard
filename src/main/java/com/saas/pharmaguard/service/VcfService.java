package com.saas.pharmaguard.service;

import com.saas.pharmaguard.dto.DrugRiskResult;
import com.saas.pharmaguard.dto.response.PharmaGuardResponse;
import com.saas.pharmaguard.interpretation.InterpretationService;
import com.saas.pharmaguard.model.GeneProfile;
import com.saas.pharmaguard.model.VcfParseResult;
import com.saas.pharmaguard.parser.VcfParser;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class VcfService {

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

    private final VcfParser              vcfParser;
    private final InterpretationService  interpretationService;
    private final DrugRiskService        drugRiskService;
    private final ResponseMappingService responseMappingService;

    public VcfService(VcfParser vcfParser,
                      InterpretationService interpretationService,
                      DrugRiskService drugRiskService,
                      ResponseMappingService responseMappingService) {
        this.vcfParser              = vcfParser;
        this.interpretationService  = interpretationService;
        this.drugRiskService        = drugRiskService;
        this.responseMappingService = responseMappingService;
    }

    /**
     * Full production pipeline:
     *   validate → parse → interpret → drug risk → map → List<PharmaGuardResponse>
     *
     * @throws IllegalArgumentException for validation failures (400)
     * @throws Exception                for unexpected errors (500)
     */
    public List<PharmaGuardResponse> analyse(MultipartFile file, String drugs) throws Exception {
        validate(file);

        VcfParseResult       parseResult  = vcfParser.parse(file);
        List<GeneProfile>    geneProfiles = interpretationService.interpret(parseResult.getVariants());
        List<DrugRiskResult> drugRisks    = drugRiskService.evaluate(geneProfiles, drugs);

        boolean parseSuccess = parseResult.getErrors() == null || parseResult.getErrors().isEmpty();

        return responseMappingService.map(
                drugRisks,
                geneProfiles,
                parseResult.getVariants(),
                parseSuccess
        );
    }

    /**
     * Raw parse — dev /parse endpoint only. DO NOT MODIFY.
     *
     * @throws IllegalArgumentException for validation failures (400)
     * @throws Exception                for unexpected errors (500)
     */
    public VcfParseResult parseOnly(MultipartFile file) throws Exception {
        validate(file);
        return vcfParser.parse(file);
    }

    // ── shared validation ────────────────────────────────────────────────────

    private void validate(MultipartFile file) {
        if (file == null || file.isEmpty())
            throw new IllegalArgumentException("No file uploaded");

        String name = file.getOriginalFilename();
        if (name == null || !name.endsWith(".vcf"))
            throw new IllegalArgumentException("File must be a .vcf file");

        if (file.getSize() > MAX_FILE_SIZE)
            throw new IllegalArgumentException("File exceeds 5 MB limit");
    }
}
