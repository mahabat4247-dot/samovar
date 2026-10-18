# Samovar - Russian Restaurant Website

Samovar is a modern, responsive, and elegant website for a luxury Russian restaurant. It features a sophisticated cream, burgundy, and gold design aesthetic, presenting authentic culinary dishes including Royal Borscht, Siberian Pelmeni, Potato & Mushroom Vareniki, Imperial Caviar Blini, Artisanal Pirozhki, and Golden Syrniki.

---

## Features

- **Elegant Design**: Refined cream (`#FAF6F0`), burgundy (`#722F37`), and gold (`#D4AF37`) palette.
- **Interactive Menu & Shopping Cart**: Supports adding/removing dishes, adjusting item quantities, calculating subtotals, tax, and final order total in real time.
- **Responsive & Accessible**: Optimized for mobile, tablet, and desktop viewports with accessible HTML structure and semantic markup.
- **Production Static Build**: Zero external runtime overhead using static HTML, CSS, and modern vanilla JavaScript.

---

## Quick Start & Local Development

### Prerequisites

- [Node.js](https://nodejs.org/) v20 or later
- [npm](https://www.npmjs.com/) v10 or later
- [Docker](https://www.docker.com/) (optional, for containerized execution)

### 1. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-org/samovar.git
cd samovar
npm ci
```

### 2. Linting

Run static code analysis on HTML and JavaScript files:

```bash
npm run lint
```

Or lint individual components:

```bash
npm run lint:html  # HTMLHint
npm run lint:js    # ESLint
```

### 3. Build

Generate the production static website assets in the `dist/` directory:

```bash
npm run build
```

The output in `dist/` will contain:
- `dist/index.html`
- `dist/styles.css`
- `dist/script.js`

---

## Running with Docker

### Build and Run Locally

Build the Docker container using Nginx:

```bash
docker build -t samovar:latest .
```

Run the container on port 80:

```bash
docker run -d -p 8080:80 --name samovar-web samovar:latest
```

Access the website in your browser at `http://localhost:8080`.

---

## CI/CD Pipeline & Deployment Workflow

### Deployment Progression Overview

```
GitHub Branch ➔ Pull Request ➔ CI Checks ➔ Merge to main ➔ Docker Image Pushed to ECR ➔ EC2 Deployment
```

1. **GitHub Branch & Pull Request**: Developers push feature branches and create Pull Requests targeting the `main` branch.
2. **CI Checks**: Pull Requests trigger automated GitHub Actions jobs for Lint, Build, SonarQube, Trivy, and Docker Build.
3. **Merge to Main**: Upon PR approval and successful CI checks, changes are merged into `main`.
4. **ECR Push**: Merges to `main` trigger the pipeline to build and publish the production Docker image to Amazon Elastic Container Registry (ECR).
5. **EC2 Deployment**: The updated Docker image from ECR is deployed to Amazon EC2 web servers.

---

## GitHub Repository Secrets Configuration

The following repository secrets must be configured in GitHub Settings (`Settings > Secrets and variables > Actions`):

| Secret Name | Description |
| :--- | :--- |
| `SONAR_TOKEN` | SonarQube authentication token for code quality analysis. |
| `SONAR_HOST_URL` | URL of the SonarQube server instance. |
| `AWS_ACCESS_KEY_ID` | AWS IAM access key ID with ECR publish permissions. |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM secret access key corresponding to `AWS_ACCESS_KEY_ID`. |
| `AWS_REGION` | AWS region where the ECR repository is hosted (e.g. `us-east-1`). |
| `ECR_REPOSITORY` | Name of the Amazon ECR repository (e.g., `samovar`). |

---

## Workflow Jobs Explained

| Job Name | Trigger Event | Description |
| :--- | :--- | :--- |
| **Lint** | PR & Push (`main`) | Runs `npm run lint` (`htmlhint` & `eslint`) to validate code quality and syntax. |
| **Build** | PR & Push (`main`) | Runs `npm run build` to verify static file bundle generation in `dist/`. |
| **SonarQube Scan** | PR & Push (`main`) | Analyzes code quality, maintainability, and security hotspots via SonarQube. |
| **Trivy** | PR & Push (`main`) | Scans the repository filesystem for known vulnerabilities and security issues. |
| **Docker Build** | PR & Push (`main`) | Validates containerization by building the Docker image (`docker build`). |
| **ECR Push** | Push (`main`) only | Authenticates with AWS, builds the release image, and pushes tags (`:sha` and `:latest`) to ECR. |

---

## Verification & Status Report

- **`npm ci`**: Passed.
- **`npm run lint`**: Passed (`htmlhint` & `eslint`).
- **`npm run build`**: Passed (generated `dist/` bundle).
- **External Services**: SonarQube scanning and AWS ECR publishing require secret credentials configured in GitHub Actions settings and run in CI upon branch pushes.
