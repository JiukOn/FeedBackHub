import React, { useState } from "react";
import DOMPurify from "dompurify";
import { Button } from "./ui";
import { generateAIReport, isAIConfigured } from "../utils/aiReport";

function renderMarkdown(text) {
  if (!text) return "";

  return text
    .split("\n")
    .map((line, i) => {
      if (line.startsWith("### ")) {
        return `<h4 class="report__h4">${line.slice(4)}</h4>`;
      }
      if (line.startsWith("## ")) {
        return `<h3 class="report__h3">${line.slice(3)}</h3>`;
      }
      if (line.startsWith("# ")) {
        return `<h2 class="report__h2">${line.slice(2)}</h2>`;
      }

      let formatted = line
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.+?)\*/g, "<em>$1</em>");

      if (formatted.match(/^[-•]\s/)) {
        return `<li class="report__li">${formatted.slice(2)}</li>`;
      }
      if (formatted.match(/^\d+\.\s/)) {
        return `<li class="report__li report__li--num">${formatted.replace(/^\d+\.\s/, "")}</li>`;
      }

      if (formatted.match(/^---+$/)) {
        return `<hr class="report__hr" />`;
      }

      if (!formatted.trim()) {
        return `<div class="report__spacer"></div>`;
      }

      return `<p class="report__p">${formatted}</p>`;
    })
    .join("\n");
}

export default function AIReportModal({ feedbacks, metrics, onClose }) {
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const configured = isAIConfigured();

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setReport("");

    try {
      const result = await generateAIReport(feedbacks, metrics);
      setReport(result);
    } catch (err) {
      console.error("[AIReportModal] Erro:", err);
      setError(err.message || "Erro ao gerar relatório. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReport = () => {
    if (report) {
      navigator.clipboard.writeText(report);
    }
  };

  const handleDownloadReport = () => {
    if (!report) return;
    const blob = new Blob([report], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio-ia-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <div className="modal__header-left">
            <span className="modal__icon">✦</span>
            <div>
              <h3 className="modal__title">Relatório com IA</h3>
              <p className="modal__subtitle">
                Análise executiva gerada via Azure OpenAI
              </p>
            </div>
          </div>
          <button
            className="modal__close"
            onClick={onClose}
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        <div className="modal__body">
          {!configured && (
            <div className="modal__warning">
              <span className="modal__warning-icon">⚠</span>
              <div>
                <strong>Azure OpenAI não configurado</strong>
                <p>
                  Para usar esta funcionalidade, configure as variáveis de
                  ambiente no arquivo <code>.env</code>:
                </p>
                <pre className="modal__code">
                  {`REACT_APP_AZURE_OPENAI_ENDPOINT=https://seu-recurso.openai.azure.com
REACT_APP_AZURE_OPENAI_KEY=sua-chave-aqui
REACT_APP_AZURE_OPENAI_DEPLOYMENT=gpt-4o-mini`}
                </pre>
                <p>Reinicie o servidor após configurar.</p>
              </div>
            </div>
          )}

          {configured && !report && !loading && !error && (
            <div className="modal__intro">
              <p>
                A IA vai analisar{" "}
                <strong>{feedbacks.length} feedback(s)</strong> e gerar um
                relatório executivo completo com:
              </p>
              <ul className="modal__feature-list">
                <li>📊 Resumo executivo e indicadores-chave</li>
                <li>✅ Pontos fortes identificados</li>
                <li>⚠️ Pontos críticos e riscos</li>
                <li>📈 Análise por frente avaliada</li>
                <li>🎭 Mapa emocional dos usuários</li>
                <li>🎯 Top 5 recomendações de melhoria</li>
              </ul>
              <Button onClick={handleGenerate} size="lg">
                ✦ Gerar relatório com IA
              </Button>
            </div>
          )}

          {loading && (
            <div className="modal__loading">
              <div className="modal__spinner" />
              <p className="modal__loading-text">
                Analisando feedbacks e gerando relatório...
              </p>
              <p className="modal__loading-sub">
                Isso pode levar alguns segundos.
              </p>
            </div>
          )}

          {error && (
            <div className="modal__error">
              <span className="modal__error-icon">✕</span>
              <p>{error}</p>
              <Button variant="ghost" size="sm" onClick={handleGenerate}>
                Tentar novamente
              </Button>
            </div>
          )}

          {report && (
            <div className="modal__report">
              <div className="modal__report-actions">
                <Button variant="ghost" size="sm" onClick={handleCopyReport}>
                  📋 Copiar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDownloadReport}
                >
                  ⬇ Baixar .md
                </Button>
                <Button variant="ghost" size="sm" onClick={handleGenerate}>
                  ↻ Regenerar
                </Button>
              </div>
              <div
                className="modal__report-content"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(renderMarkdown(report)),
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
