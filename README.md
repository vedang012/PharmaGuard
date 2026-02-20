# 🧬 PharmaGuard — AI-Assisted Pharmacogenomic Risk Assessment Platform

PharmaGuard is a full-stack clinical decision support prototype that analyzes genomic VCF files and predicts drug-specific pharmacogenomic risks using deterministic clinical rules enhanced with AI-generated explanations.

It transforms raw genetic variant data into structured, explainable medication risk assessments for six clinically relevant drugs.

---

## 🔗 Live Demo

**Frontend (Vercel):**
https://your-frontend-url.vercel.app

**Backend (Render):**
https://your-backend-url.onrender.com

---

## 🏗️ System Architecture

### Full Pipeline Flow

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                     │
│         React 18 + Vite SPA  —  Vercel CDN              │
└────────────────────────┬────────────────────────────────┘
                         │  POST /api/vcf/analyse
                         │  (multipart: VCF file + drug list)
                         ▼
┌─────────────────────────────────────────────────────────┐
│             BACKEND  —  Spring Boot (Java 21)           │
│                      Render (Docker)                    │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  1.  VCF Upload                                 │   │
│  │      Accepts .vcf file via multipart/form-data  │   │
│  └──────────────────────┬──────────────────────────┘   │
│                         ▼                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │  2.  VCF Parser                                 │   │
│  │      Extracts variants, genes & star alleles    │   │
│  └──────────────────────┬──────────────────────────┘   │
│                         ▼                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │  3.  Variant Filtering                          │   │
│  │      Retains only actionable genotypes          │   │
│  └──────────────────────┬──────────────────────────┘   │
│                         ▼                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │  4.  Diplotype Resolution                       │   │
│  │      Enforces diploid constraints per gene      │   │
│  └──────────────────────┬──────────────────────────┘   │
│                         ▼                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │  5.  Phenotype Mapping                          │   │
│  │      CPIC-aligned rules:                        │   │
│  │      Diplotype → PM / IM / NM / RM / URM        │   │
│  └──────────────────────┬──────────────────────────┘   │
│                         ▼                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │  6.  Drug Risk Engine                           │   │
│  │      Deterministic logic per drug–phenotype     │   │
│  │      pair  →  SAFE / ADJUST DOSE / TOXIC        │   │
│  └──────────────────────┬──────────────────────────┘   │
│                         ▼                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │  7.  Clinical Recommendation Engine             │   │
│  │      Structured medical guidance per drug       │   │
│  └──────────────────────┬──────────────────────────┘   │
│                         ▼                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │  8.  Confidence & Severity Scoring              │   │
│  │      Risk level + confidence percentage         │   │
│  └──────────────────────┬──────────────────────────┘   │
│                         ▼                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │  9.  LLM Explanation  (Google Gemini)           │   │
│  │      Plain-language clinical summary only       │   │
│  │      ⚠️  No risk decisions made by LLM          │   │
│  └──────────────────────┬──────────────────────────┘   │
│                         ▼                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │  10. Structured JSON Response                   │   │
│  │      Schema-compliant output per drug           │   │
│  └──────────────────────┬──────────────────────────┘   │
└─────────────────────────┼───────────────────────────────┘
                          │  JSON Array
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                     │
│   Confidence ring · Gene accordion · Variant table      │
│   LLM panel · JSON viewer · Download                    │
└─────────────────────────────────────────────────────────┘
```

### Layer Responsibilities

| Layer | Module | Responsibility |
|---|---|---|
| **Ingestion** | VCF Parser | Parse raw VCF → extract variants, genes, star alleles |
| **Filtering** | Variant Filter | Discard non-actionable genotypes |
| **Genetics** | Diplotype Resolver | Enforce diploid constraints per pharmacogene |
| **Phenotyping** | Phenotype Rules Engine | Map diplotypes to metaboliser status (CPIC) |
| **Risk** | Drug Risk Service | Classify drug risk deterministically |
| **Guidance** | Clinical Recommendation Service | Generate structured medical recommendations |
| **Scoring** | Risk Assessment Factory | Compute confidence score & severity level |
| **Explanation** | LLM Explanation Service | Generate Gemini-powered plain-language summary |
| **Output** | Response Assembler | Serialize schema-compliant JSON array |

### Design Principles

- 🔒 **Deterministic clinical logic** — AI never makes risk decisions
- 🔍 **Explainable variant traceability** — every risk traces back to a specific variant
- 📋 **Strict schema-compliant JSON output** — consistent, parseable response
- 🧱 **Separation of logic and explanation layers** — LLM is summary-only
- ⚙️ **Environment-driven configuration** — no hardcoded secrets
- 🐳 **Production-ready Docker deployment** — Render-hosted containerized backend

---

## 🖥️ Backend — Clinical Decision Engine

### Tech Stack

| Technology | Purpose |
|---|---|
| Java 21 | Core runtime |
| Spring Boot | REST API framework |
| Maven | Build & dependency management |
| Docker | Containerization |
| Google Gen AI SDK (`com.google.genai`) | Gemini LLM integration |
| Render | Cloud deployment |

### Core Modules

| Module | Description |
|---|---|
| `VcfParserService` | Extracts variants, genes, and star alleles from uploaded VCF files |
| `DiplotypeResolver` | Enforces diploid constraints and resolves star allele pairs |
| `PhenotypeRulesEngine` | Maps diplotypes → PM / IM / NM / RM / URM using CPIC-aligned rules |
| `DrugRiskService` | Deterministic drug risk classification per phenotype |
| `ClinicalRecommendationService` | Structured medical guidance per drug–phenotype combination |
| `RiskAssessmentFactory` | Computes confidence percentage and severity score |
| `LlmExplanationService` | Calls Google Gemini to produce plain-language clinical summaries |

---

## 🌐 Frontend — PharmaGuard SPA

### Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tooling & dev server |
| React Router v6 | Client-side routing |
| Axios | HTTP client |
| Lucide React | Icon library |
| OGL | Aurora WebGL hero effect |
| Vanilla CSS | Custom design system |
| Vercel | CDN deployment |

### Pages

| Page | Description |
|---|---|
| Landing | Aurora hero, feature highlights, supported drugs, CTA |
| Analysis | VCF upload + drug selection → risk assessment results |
| Documentation | API reference & usage guide |

### Key Features

- 🌗 Dark / Light theme toggle
- 📂 Drag-and-drop VCF upload
- 💊 6 drug selection chips
- 🔵 Animated confidence ring
- 🧬 Gene accordion & variant table
- 🤖 LLM explanation panel
- `{}` JSON viewer + download
- 🧪 Mock mode for local development

---

## ⚙️ Installation

### Backend Setup

**1. Clone repository**
```bash
git clone https://github.com/vedang012/PharmaGuard.git
cd PharmaGuard/pharmaguard-backend
```

**2. Configure environment variables**
```bash
git clone https://github.com/vedang012/PharmaGuard.git
cd PharmaGuard/pharmaguard-backend
```

**2. Configure environment variables**
```bash
git clone https://github.com/vedang012/PharmaGuard.git
cd PharmaGuard/pharmaguard-backend
```

**2. Configure environment variables**
```bash
git clone https://github.com/vedang012/PharmaGuard.git
cd PharmaGuard/pharmaguard-backend
```

**3. `application.properties`**
```properties
server.port=${PORT:8080}
google.ai.api-key=${GEMINI_API}
app.frontend-url=${FRONTEND_URL}
```

**4. Run**
```bash
mvn clean install
mvn spring-boot:run
```

---

### 🐳 Docker Deployment (Render)

```dockerfile
FROM maven:3.9.6-eclipse-temurin-21 AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

Deploy via **Render → Web Service → Docker** environment.

---

### Frontend Setup

```bash
cd pharmaguard-frontend
npm install
```

Create `.env`:
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_USE_MOCK=false
```

Run:
```bash
npm run dev
```

Deploy via **Vercel**.

---

## 📡 API Documentation

### Endpoint

```
POST /api/vcf/analyse
```

**Request** — `multipart/form-data`

| Field | Type | Description |
|---|---|---|
| `file` | File | VCF file (v4.x) |
| `drugs` | String | Comma-separated drug list |

**Example:**
```
drugs=WARFARIN,CLOPIDOGREL
```

**Response** — JSON array of per-drug pharmacogenomic records:

```json
[
  {
    "risk_assessment": { ... },
    "pharmacogenomic_profile": { ... },
    "clinical_recommendation": { ... },
    "llm_generated_explanation": "...",
    "quality_metrics": { ... }
  }
]
```

---

## 💊 Supported Drugs

| Drug | Gene(s) | Risk Category |
|---|---|---|
| Codeine | CYP2D6 | Opioid toxicity / inefficacy |
| Warfarin | CYP2C9, VKORC1, CYP4F2 | Bleeding / thrombosis |
| Clopidogrel | CYP2C19 | Antiplatelet resistance |
| Simvastatin | SLCO1B1 | Myopathy / rhabdomyolysis |
| Azathioprine | TPMT, NUDT15 | Myelosuppression |
| Fluorouracil | DPYD | Severe toxicity |

---

## 👥 Team Members

- **Your Name** — Backend Architecture & Clinical Engine
- **Teammate Name** — Frontend Development
- **Teammate Name** — AI Integration & Deployment

---

## 🏆 Hackathon Highlights

- ✅ Deterministic pharmacogenomic engine
- ✅ Explainable AI (LLM for clinical summary only)
- ✅ Full-stack deployment (Vercel + Render)
- ✅ Dockerized backend
- ✅ Strict JSON schema compliance
- ✅ Production-style architecture
- ✅ CPIC-aligned phenotype rules
- ✅ 6-drug coverage across major pharmacogenes