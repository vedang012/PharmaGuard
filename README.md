# 🧬 PharmaGuard --- AI-Assisted Pharmacogenomic Risk Assessment Platform

PharmaGuard is a full-stack clinical decision support prototype that
analyzes genomic VCF files and predicts drug-specific pharmacogenomic
risks using deterministic clinical rules enhanced with AI-generated
explanations.

It transforms raw genetic variant data into structured, explainable
medication risk assessments for six clinically relevant drugs.

------------------------------------------------------------------------

## Live Demo

Frontend (Vercel):\
https://your-frontend-url.vercel.app

Backend (Render):\
https://your-backend-url.onrender.com

------------------------------------------------------------------------

#  Architecture Overview


Design Principles: - Deterministic clinical logic (no AI-based risk
decisions) - Explainable variant traceability - Strict schema-compliant
JSON output - Separation of logic and explanation layers -
Environment-driven configuration - Production-ready Docker deployment

------------------------------------------------------------------------

#  Backend --- Clinical Decision Engine

## Tech Stack

-   Java 21\
-   Spring Boot\
-   Maven\
-   Docker\
-   Google Gen AI SDK (`com.google.genai`)\
-   Render (Deployment)

## Core Modules

-   VCF Parser --- Extracts variants, genes, star alleles\
-   Diplotype Resolver --- Enforces diploid constraints\
-   Phenotype Rules Engine --- Maps diplotypes → PM/IM/NM/RM/URM\
-   DrugRiskService --- Deterministic drug risk classification\
-   ClinicalRecommendationService --- Structured medical guidance\
-   RiskAssessmentFactory --- Confidence & severity scoring\
-   LlmExplanationService --- Gemini-generated clinical summary

------------------------------------------------------------------------

#  Frontend --- PharmaGuard SPA

Tech Stack: - React 18\
- Vite\
- React Router v6\
- Axios\
- Lucide React icons\
- OGL (Aurora WebGL effect)\
- Vanilla CSS (custom design system)\
- Vercel deployment

Pages: - Landing Page (Aurora hero, features, supported drugs, CTA)\
- Analysis Page (VCF upload + drug selection → risk assessment results)\
- Documentation Page

Key Features: - Dark/light theme toggle\
- Drag-and-drop VCF upload\
- 6 drug selection chips\
- Animated confidence ring\
- Gene accordion & variant table\
- LLM explanation panel\
- JSON viewer + download\
- Mock mode for local development

------------------------------------------------------------------------

#  Installation Instructions

## Backend Setup

1.  Clone repository

git clone https://github.com/your-org/pharmaguard.git\
cd pharmaguard-backend

2.  Configure Environment Variables

export GEMINI_API=your_google_gemini_api_key\
export FRONTEND_URL=http://localhost:5173

3.  application.properties

server.port=${PORT:8080} google.ai.api-key=${GEMINI_API}\
app.frontend-url=\${FRONTEND_URL}

4.  Run

mvn clean install\
mvn spring-boot:run

------------------------------------------------------------------------

##  Docker Deployment (Render)

Dockerfile:

FROM maven:3.9.6-eclipse-temurin-21 AS builder\
WORKDIR /app\
COPY pom.xml .\
COPY src ./src\
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre\
WORKDIR /app\
COPY --from=builder /app/target/\*.jar app.jar\
EXPOSE 8080\
ENTRYPOINT \["java","-jar","app.jar"\]

Deploy via Render → Web Service → Docker environment.

------------------------------------------------------------------------

## Frontend Setup

cd pharmaguard-frontend\
npm install

Create .env:

VITE_API_BASE_URL=http://localhost:8080\
VITE_USE_MOCK=false

Run:

npm run dev

Deploy via Vercel.

------------------------------------------------------------------------

#  API Documentation

Endpoint:

POST /api/vcf/analyse

Request: Multipart form data: - file --- VCF file\
- drugs --- comma-separated list

Example:

drugs=WARFARIN,CLOPIDOGREL

Response: Returns JSON array of per-drug pharmacogenomic records
containing: - risk_assessment\
- pharmacogenomic_profile\
- clinical_recommendation\
- llm_generated_explanation\
- quality_metrics

------------------------------------------------------------------------

#  Supported Drugs

-   Codeine\
-   Warfarin\
-   Clopidogrel\
-   Simvastatin\
-   Azathioprine\
-   Fluorouracil

------------------------------------------------------------------------

#  Team Members

-   Your Name --- Backend Architecture & Clinical Engine\
-   Teammate Name --- Frontend Development\
-   Teammate Name --- AI Integration & Deployment

------------------------------------------------------------------------

#  Hackathon Highlights

-   Deterministic pharmacogenomic engine\
-   Explainable AI (LLM for summary only)\
-   Full-stack deployment\
-   Dockerized backend\
-   Strict JSON schema compliance\
-   Production-style architecture
