import axios from 'axios';
import sampleResponse from '../mocks/sample_response.json';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
});

const RISK_LEVEL_ORDER = {
    none: 0,
    low: 1,
    moderate: 2,
    high: 3,
    severe: 4,
    critical: 5,
};

function toOverallRisk(riskLabel, severity) {
    const normalizedLabel = String(riskLabel || '').toLowerCase();
    const normalizedSeverity = String(severity || '').toLowerCase();

    if (normalizedLabel.includes('safe') || normalizedSeverity === 'none') return 'SAFE';
    if (normalizedLabel.includes('adjust') || normalizedLabel.includes('caution')) return 'ADJUST_DOSE';
    if (normalizedLabel.includes('ineffective')) return 'INEFFECTIVE';
    return 'TOXIC';
}

function expandPhenotype(phenotype) {
    const normalized = String(phenotype || '').toUpperCase();
    const map = {
        NM: 'Normal Metabolizer',
        IM: 'Intermediate Metabolizer',
        PM: 'Poor Metabolizer',
        RM: 'Rapid Metabolizer',
        UM: 'Ultrarapid Metabolizer',
    };

    return map[normalized] || phenotype || 'Unknown';
}

function normalizeAnalysisResponse(payload) {
    if (payload && !Array.isArray(payload) && payload.analysisId) {
        return payload;
    }

    if (!Array.isArray(payload) || payload.length === 0) {
        return payload;
    }

    const records = payload;
    const scoredRecords = records.map((record) => {
        const severity = String(record?.risk_assessment?.severity || 'none').toLowerCase();
        return {
            record,
            severityScore: RISK_LEVEL_ORDER[severity] ?? 0,
        };
    });

    const primaryRecord = scoredRecords.sort((a, b) => b.severityScore - a.severityScore)[0]?.record || records[0];
    const confidenceScore = records.reduce((sum, r) => sum + Number(r?.risk_assessment?.confidenceScore || 0), 0) / records.length;
    const uniqueDrugs = [...new Set(records.map((r) => r?.drug).filter(Boolean))];

    const genes = records.map((entry, index) => {
        const profile = entry?.pharmacogenomic_profile || {};
        const recommendation = entry?.clinical_recommendation || {};

        return {
            gene: profile.primary_gene || `Gene ${index + 1}`,
            diplotype: profile.diplotype || 'N/A',
            phenotype: expandPhenotype(profile.phenotype),
            activityScore: null,
            drugRecommendation:
                recommendation.recommendation || recommendation.action || 'No recommendation provided.',
            guidelineSource: 'Backend Analysis',
            variants: (profile.detected_variants || []).map((variant) => ({
                rsid: variant.rsid || 'N/A',
                chromosome: '-',
                position: '-',
                genotype: variant.genotype || 'N/A',
                clinicalSignificance: 'Drug Response',
                qualityScore: '-',
                readDepth: '-',
                starAllele: variant.star_allele,
            })),
        };
    });

    const explanations = records
        .map((entry) => ({
            title: `${entry?.drug || 'Drug'} Summary`,
            content: entry?.llm_generated_explanation?.summary,
        }))
        .filter((item) => item.content);

    const vcfParsingFlags = records
        .map((entry) => entry?.quality_metrics?.vcf_parsing_success)
        .filter((value) => typeof value === 'boolean');

    const qualityMetrics =
        vcfParsingFlags.length > 0
            ? {
                vcfPassRate: vcfParsingFlags.every(Boolean) ? 1 : 0,
            }
            : null;

    const recommendation = primaryRecord?.clinical_recommendation || {};
    const riskAssessment = primaryRecord?.risk_assessment || {};
    const riskLabel = riskAssessment.riskLabel || 'Unknown';
    const severity = riskAssessment.severity;
    const overallRiskLabel = severity && severity !== 'none' ? `${riskLabel} (${severity})` : riskLabel;

    return {
        analysisId: primaryRecord?.patient_id || `${Date.now()}`,
        patientId: primaryRecord?.patient_id,
        drug: uniqueDrugs.join(', '),
        timestamp: primaryRecord?.timestamp || new Date().toISOString(),
        overallRisk: toOverallRisk(riskLabel, severity),
        overallRiskLabel,
        confidenceScore,
        riskDescription:
            recommendation.recommendation || recommendation.action || 'No risk description provided.',
        genes,
        confidenceBreakdown: [],
        explanations,
        qualityMetrics,
        metadata: null,
        rawRecords: records,
    };
}

/**
 * Submit a VCF file and drug list for pharmacogenomic analysis.
 * Falls back to mock data when no backend URL is configured.
 */
export async function analyzeVcf(file, drug) {
    // Mock mode — return sample data when no backend is configured
    if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 1200)); // simulate latency
        return { data: normalizeAnalysisResponse(sampleResponse) };
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('drugs', drug);

    const response = await api.post('/api/vcf/analyse', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

    return {
        ...response,
        data: normalizeAnalysisResponse(response.data),
    };
}

export default api;
