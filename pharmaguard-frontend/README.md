# PharmaGuard Frontend

PharmaGuard is a clinical pharmacogenomic analysis platform that predicts drug-gene interaction risks from VCF (Variant Call Format) files. It provides confidence-scored risk assessments with explainable AI output for clinical decision support.

## Features

- **VCF Upload & Parsing**: Securely process standard VCF files (v4.x) in-memory.
- **Drug-Gene Interaction Analysis**: Predict risks based on CPIC guidelines and PharmGKB data.
- **Dark Mode Support**: Fully themed interface with light/dark modes.
- **Responsive Design**: Mobile-friendly UI built with Tailwind CSS.
- **Comprehensive Reporting**: Detailed clinical reports with risk levels (SAFE, ADJUST DOSE, TOXIC).

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **State Management**: Context API
- **Routing**: React Router DOM (v6)
- **Icons**: Lucide React

## Getting Started

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/pharmaguard-frontend.git
    cd pharmaguard-frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```

4.  Build for production:
    ```bash
    npm run build
    ```

## Project Structure

- `src/components`: Reusable UI components (Card, Navbar, etc.)
- `src/pages`: Application pages (Landing, Analysis, Report, Docs, Developer)
- `src/services`: API verification and interaction logic
- `src/mocks`: Mock data for local testing

## License

MIT
