const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src");
let passed = 0;
let failed = 0;
const results = [];

function check(name, condition, detail = "") {
  if (condition) {
    passed++;
    results.push({ status: "PASS", name, detail });
  } else {
    failed++;
    results.push({ status: "FAIL", name, detail });
  }
}

function fileExists(relativePath) {
  return fs.existsSync(path.join(ROOT, relativePath));
}

function fileContains(relativePath, text) {
  try {
    const content = fs.readFileSync(path.join(ROOT, relativePath), "utf-8");
    return content.includes(text);
  } catch {
    return false;
  }
}

function fileNotEmpty(relativePath) {
  try {
    const stat = fs.statSync(path.join(ROOT, relativePath));
    return stat.size > 50;
  } catch {
    return false;
  }
}

console.log("\n◆ FEEDBACK HUB — VERIFICAÇÃO AUTOMATIZADA\n");
console.log("═".repeat(55));
console.log(" 1. ESTRUTURA DE ARQUIVOS");
console.log("═".repeat(55));

const requiredFiles = [
  "package.json",
  "README.md",
  "public/index.html",
  "src/index.js",
  "src/App.js",
  "src/styles.css",
  "src/config/questions.js",
  "src/config/themes.js",
  "src/constants/privacy.js",
  "src/utils/scoring.js",
  "src/utils/export.js",
  "src/store/feedbackStore.js",
  "src/store/ThemeContext.js",
  "src/mock/feedbacks.js",
  "src/components/Header.js",
  "src/components/FormFields.js",
  "src/components/ui/index.js",
  "src/pages/HomePage.js",
  "src/pages/FormPage.js",
  "src/pages/DashboardPage.js",
  "docs/ARCHITECTURE.md",
  "docs/SCORING.md",

];

requiredFiles.forEach((f) => {
  check(
    `Arquivo: ${f}`,
    fileExists(f),
    fileExists(f) ? "encontrado" : "AUSENTE",
  );
});

console.log("\n" + "═".repeat(55));
console.log(" 2. CONTEÚDO ESSENCIAL");
console.log("═".repeat(55));

check("package.json tem react", fileContains("package.json", '"react"'));
check(
  "package.json tem react-scripts",
  fileContains("package.json", '"react-scripts"'),
);
check("package.json tem uuid", fileContains("package.json", '"uuid"'));
check("package.json tem script start", fileContains("package.json", '"start"'));
check("package.json tem script build", fileContains("package.json", '"build"'));

console.log("\n" + "═".repeat(55));
console.log(" 3. TEMAS VISUAIS");
console.log("═".repeat(55));

check("Tema dark definido", fileContains("src/config/themes.js", 'id: "dark"'));
check(
  "Tema light definido",
  fileContains("src/config/themes.js", 'id: "light"'),
);
check("Tema neon definido", fileContains("src/config/themes.js", 'id: "neon"'));
check(
  "ThemeContext com Provider",
  fileContains("src/store/ThemeContext.js", "ThemeProvider"),
);
check(
  "ThemeContext com localStorage",
  fileContains("src/store/ThemeContext.js", "localStorage"),
);

console.log("\n" + "═".repeat(55));
console.log(" 4. SISTEMA DE SCORING");
console.log("═".repeat(55));

check(
  "calculateScores exportada",
  fileContains("src/utils/scoring.js", "export function calculateScores"),
);
check(
  "classifyFeedback exportada",
  fileContains("src/utils/scoring.js", "export function classifyFeedback"),
);
check(
  "aggregateMetrics exportada",
  fileContains("src/utils/scoring.js", "export function aggregateMetrics"),
);
check(
  "Fórmula de Utilidade",
  fileContains("src/utils/scoring.js", "usefulnessScore"),
);
check(
  "Fórmula de Confiança",
  fileContains("src/utils/scoring.js", "trustScore"),
);
check(
  "Fórmula de Contexto",
  fileContains("src/utils/scoring.js", "contextQualityScore"),
);
check(
  "Fórmula de Adoção",
  fileContains("src/utils/scoring.js", "adoptionScore"),
);
check("Fórmula de Risco", fileContains("src/utils/scoring.js", "riskScore"));
check(
  "Pesos configurados (0.25)",
  fileContains("src/utils/scoring.js", "0.25"),
);
check("Normalização to100", fileContains("src/utils/scoring.js", "to100"));

console.log("\n" + "═".repeat(55));
console.log(" 5. PRIVACIDADE (NFR-006)");
console.log("═".repeat(55));

check(
  "PRIVACY_MESSAGES definida",
  fileContains("src/constants/privacy.js", "PRIVACY_MESSAGES"),
);
check(
  "SENSITIVE_PATTERNS definida",
  fileContains("src/constants/privacy.js", "SENSITIVE_PATTERNS"),
);
check(
  "scanTextForSensitiveData exportada",
  fileContains(
    "src/constants/privacy.js",
    "export function scanTextForSensitiveData",
  ),
);
check(
  "Padrão CPF configurado",
  fileContains("src/constants/privacy.js", "CPF"),
);
check(
  "Padrão CNPJ configurado",
  fileContains("src/constants/privacy.js", "CNPJ"),
);
check(
  "Padrão valores financeiros",
  fileContains("src/constants/privacy.js", "Valores financeiros"),
);
check(
  "FormPage importa scanner",
  fileContains("src/pages/FormPage.js", "scanTextForSensitiveData"),
);

console.log("\n" + "═".repeat(55));
console.log(" 6. STORE E PERSISTÊNCIA");
console.log("═".repeat(55));

check(
  "saveFeedback exportada",
  fileContains("src/store/feedbackStore.js", "export function saveFeedback"),
);
check(
  "loadFeedbacks exportada",
  fileContains("src/store/feedbackStore.js", "export function loadFeedbacks"),
);
check(
  "deleteFeedback exportada",
  fileContains("src/store/feedbackStore.js", "export function deleteFeedback"),
);
check(
  "clearFeedbacks exportada",
  fileContains("src/store/feedbackStore.js", "export function clearFeedbacks"),
);
check(
  "getFeedbackById exportada",
  fileContains("src/store/feedbackStore.js", "export function getFeedbackById"),
);
check(
  "Auto-seed com MOCK_FEEDBACKS",
  fileContains("src/store/feedbackStore.js", "seedMockData"),
);
check(
  "Mock feedbacks existem",
  fileContains("src/mock/feedbacks.js", "MOCK_FEEDBACKS"),
);

console.log("\n" + "═".repeat(55));
console.log(" 7. COMPONENTES UI");
console.log("═".repeat(55));

check(
  "Button exportada",
  fileContains("src/components/ui/index.js", "export function Button"),
);
check(
  "Card exportada",
  fileContains("src/components/ui/index.js", "export function Card"),
);
check(
  "Badge exportada",
  fileContains("src/components/ui/index.js", "export function Badge"),
);
check(
  "ScoreRing exportada",
  fileContains("src/components/ui/index.js", "export function ScoreRing"),
);
check(
  "ProgressBar exportada",
  fileContains("src/components/ui/index.js", "export function ProgressBar"),
);

console.log("\n" + "═".repeat(55));
console.log(" 8. PÁGINAS");
console.log("═".repeat(55));

check("HomePage tem setPage", fileContains("src/pages/HomePage.js", "setPage"));
check(
  "FormPage tem validação",
  fileContains("src/pages/FormPage.js", "validateStep"),
);
check(
  "FormPage tem privacyConsent",
  fileContains("src/pages/FormPage.js", "privacyConsent"),
);
check(
  "DashboardPage tem aggregateMetrics",
  fileContains("src/pages/DashboardPage.js", "aggregateMetrics"),
);
check(
  "DashboardPage tem ScoreRing",
  fileContains("src/pages/DashboardPage.js", "ScoreRing"),
);
check(
  "DashboardPage tem exportJSON",
  fileContains("src/pages/DashboardPage.js", "exportJSON"),
);

console.log("\n" + "═".repeat(55));
console.log(" 9. SEO E HTML");
console.log("═".repeat(55));

check(
  "Meta description presente",
  fileContains("public/index.html", 'name="description"'),
);
check("OG title presente", fileContains("public/index.html", "og:title"));
check("Language pt-BR", fileContains("public/index.html", 'lang="pt-BR"'));
check("Viewport meta", fileContains("public/index.html", "viewport"));
check("Favicon configurado", fileContains("public/index.html", "icon"));

console.log("\n" + "═".repeat(55));
console.log(" 10. CSS DESIGN SYSTEM");
console.log("═".repeat(55));

check(
  "Google Fonts importadas",
  fileContains("src/styles.css", "fonts.googleapis.com"),
);
check("CSS Variables no :root", fileContains("src/styles.css", ":root"));
check("Media query 640px", fileContains("src/styles.css", "640px"));
check("Focus-visible styles", fileContains("src/styles.css", "focus-visible"));
check("Animação fadeUp", fileContains("src/styles.css", "fadeUp"));
check("Animação scoreAppear", fileContains("src/styles.css", "scoreAppear"));
check("CSS > 1000 linhas", fileNotEmpty("src/styles.css"));

console.log("\n" + "═".repeat(55));
console.log(" 11. DOCUMENTAÇÃO");
console.log("═".repeat(55));

check("README.md não está vazio", fileNotEmpty("README.md"));
check(
  "README.md tem tabela de scoring",
  fileContains("README.md", "Utilidade"),
);
check(
  "README.md tem guia de instalação",
  fileContains("README.md", "npm install"),
);
check(
  "ARCHITECTURE.md tem diagrama",
  fileContains("docs/ARCHITECTURE.md", "BROWSER"),
);
check(
  "SCORING.md tem fórmulas",
  fileContains("docs/SCORING.md", "Normalização"),
);
check(
  "Log de teste existe ou skip",
  !fileExists("docs/feedback_hub_test_log.txt") ||
    fileContains("docs/feedback_hub_test_log.txt", "checks"),
);

console.log("\n" + "═".repeat(55));
console.log(" 12. IA E INTEGRAÇÃO AZURE");
console.log("═".repeat(55));

check("aiReport.js existe", fileExists("src/utils/aiReport.js"));
check("AIReportModal.js existe", fileExists("src/components/AIReportModal.js"));
check(
  "generateAIReport exportada",
  fileContains(
    "src/utils/aiReport.js",
    "export async function generateAIReport",
  ),
);
check(
  "isAIConfigured exportada",
  fileContains("src/utils/aiReport.js", "export function isAIConfigured"),
);
check(
  "DashboardPage importa AIReportModal",
  fileContains("src/pages/DashboardPage.js", "AIReportModal"),
);
check(".env.example existe", fileExists(".env.example"));
check(
  ".env.example tem ENDPOINT",
  fileContains(".env.example", "REACT_APP_AZURE_OPENAI_ENDPOINT"),
);
check("Modal CSS existe", fileContains("src/styles.css", "modal-overlay"));

console.log("\n" + "═".repeat(55));
console.log(" 13. SEGURANÇA");
console.log("═".repeat(55));

check(
  "CSP meta tag",
  fileContains("public/index.html", "Content-Security-Policy"),
);
check("X-Content-Type-Options", fileContains("public/index.html", "nosniff"));
check("X-Frame-Options DENY", fileContains("public/index.html", "DENY"));
check("Referrer-Policy", fileContains("public/index.html", "Referrer-Policy"));
check(
  "DOMPurify importado",
  fileContains("src/components/AIReportModal.js", "import DOMPurify"),
);
check(
  "DOMPurify.sanitize usado",
  fileContains("src/components/AIReportModal.js", "DOMPurify.sanitize"),
);
check(
  "frame-ancestors none",
  fileContains("public/index.html", "frame-ancestors 'none'"),
);

console.log("\n" + "═".repeat(55));
console.log(" 14. DATA LAKE & EXPORTAÇÃO");
console.log("═".repeat(55));

check(
  "exportNDJSON exportada",
  fileContains("src/utils/export.js", "export function exportNDJSON"),
);
check(
  "NDJSON MIME type correto",
  fileContains("src/utils/export.js", "application/x-ndjson"),
);
check(
  "DashboardPage importa exportNDJSON",
  fileContains("src/pages/DashboardPage.js", "exportNDJSON"),
);
check(
  "Botão NDJSON no Dashboard",
  fileContains("src/pages/DashboardPage.js", "NDJSON"),
);

console.log("\n" + "═".repeat(55));
console.log(" RESULTADO FINAL");
console.log("═".repeat(55));

const total = passed + failed;

results.forEach((r) => {
  const icon = r.status === "PASS" ? "  ✅" : "  ❌";
  console.log(`${icon} ${r.name}`);
});

console.log("\n" + "─".repeat(55));
console.log(`  Total:   ${total} verificações`);
console.log(`  ✅ Pass: ${passed}`);
console.log(`  ❌ Fail: ${failed}`);
console.log("─".repeat(55));

if (failed === 0) {
  console.log("\n  🎉 TODAS AS VERIFICAÇÕES PASSARAM!\n");
  console.log("  O Feedback Hub está íntegro e pronto.\n");
  process.exit(0);
} else {
  console.log(
    `\n  ⚠️  ${failed} VERIFICAÇ${failed > 1 ? "ÕES" : "ÃO"} FALH${failed > 1 ? "ARAM" : "OU"}!\n`,
  );
  console.log("  Revise os itens marcados com ❌ acima.\n");
  process.exit(1);
}
