import React, { useState, useEffect } from "react";
import { loadFeedbacks, clearFeedbacks } from "../store/feedbackStore";
import {
  aggregateMetrics,
  calculateScores,
  classifyFeedback,
} from "../utils/scoring";
import { exportJSON, exportCSV, exportNDJSON } from "../utils/export";
import { ScoreRing, Card, Button, Badge, ProgressBar, ScoreCard } from "../components/ui";
import AIReportModal from "../components/AIReportModal";
import FeedbackRow from "../components/FeedbackRow";
import { AREA_LABELS, EMOTION_LABELS, EMOTION_VALENCE, getNPSLabel } from "../constants/labels";

export default function DashboardPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [showClear, setShowClear] = useState(false);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    setFeedbacks(loadFeedbacks());
  }, []);

  const metrics = aggregateMetrics(feedbacks);
  const hasFeedbacks = feedbacks.length > 0;

  const handleClear = () => {
    clearFeedbacks();
    setFeedbacks([]);
    setShowClear(false);
  };

  const handleReload = () => {
    setFeedbacks(loadFeedbacks());
  };

  const topEmotions = metrics
    ? Object.entries(metrics.emotionCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 6)
    : [];

  const areaEntries = metrics
    ? Object.entries(metrics.areaCounts).sort(([, a], [, b]) => b - a)
    : [];

  const npsScores = feedbacks
    .map((f) => f.ratings?.recommendationScore)
    .filter((v) => v != null);
  const avgNPS = npsScores.length
    ? Math.round(
        (npsScores.reduce((a, b) => a + b, 0) / npsScores.length) * 10,
      ) / 10
    : null;

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div>
          <h2 className="dashboard__title">Dashboard</h2>
          <p className="dashboard__subtitle">
            {hasFeedbacks
              ? `${feedbacks.length} feedback${feedbacks.length > 1 ? "s" : ""} registrado${feedbacks.length > 1 ? "s" : ""}`
              : "Nenhum feedback ainda"}
          </p>
          {hasFeedbacks && (
            <p className="dashboard__timestamp">
              Última atualização: {new Date().toLocaleString("pt-BR")}
            </p>
          )}
        </div>
        <div className="dashboard__actions">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowReport(true)}
            disabled={!hasFeedbacks}
          >
            ✦ Relatório IA
          </Button>
          <Button variant="ghost" size="sm" onClick={handleReload}>
            ↻ Atualizar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => exportJSON(feedbacks)}
            disabled={!hasFeedbacks}
          >
            JSON
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => exportCSV(feedbacks)}
            disabled={!hasFeedbacks}
          >
            CSV
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => exportNDJSON(feedbacks)}
            disabled={!hasFeedbacks}
          >
            NDJSON
          </Button>
          {!showClear ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowClear(true)}
              disabled={!hasFeedbacks}
            >
              Limpar
            </Button>
          ) : (
            <div className="confirm-clear">
              <span>Tem certeza?</span>
              <Button variant="danger" size="sm" onClick={handleClear}>
                Confirmar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowClear(false)}
              >
                Cancelar
              </Button>
            </div>
          )}
        </div>
      </div>

      {!hasFeedbacks && (
        <Card className="empty-state">
          <div className="empty-state__icon">◇</div>
          <h3>Nenhum feedback registrado</h3>
          <p>Envie o primeiro feedback para começar a ver as métricas aqui.</p>
        </Card>
      )}

      {hasFeedbacks && metrics && (
        <>
          <section className="dash-section">
            <h3 className="dash-section__title">Scores gerais</h3>
            <div className="scores-row">
              <ScoreCard
                label="Geral"
                value={metrics.avgOverall}
                color="accent"
              />
              <ScoreCard
                label="Utilidade"
                value={metrics.avgUsefulness}
                color="info"
              />
              <ScoreCard
                label="Confiança"
                value={metrics.avgTrust}
                color="success"
              />
              <ScoreCard
                label="Contexto"
                value={metrics.avgContextQuality}
                color="info"
              />
              <ScoreCard
                label="Adoção"
                value={metrics.avgAdoption}
                color="success"
              />
              <ScoreCard
                label="Risco"
                value={metrics.avgRisk}
                color="error"
                size={72}
              />
            </div>
          </section>

          {}
          {avgNPS !== null && (
            <div
              className="alert"
              style={{
                background: "var(--accent-glow)",
                border: "1px solid var(--border)",
              }}
            >
              <span className="alert__icon">◈</span>
              <span style={{ color: "var(--text-secondary)" }}>
                NPS Médio de Recomendação:{" "}
                <strong style={{ color: "var(--accent)" }}>{avgNPS}</strong> /
                10
                {" — "}
                {(() => {
                  const nps = getNPSLabel(avgNPS);
                  return nps ? (
                    <span className={`nps-label ${nps.className}`}>
                      {nps.label}
                    </span>
                  ) : null;
                })()}
              </span>
            </div>
          )}

          {}
          {metrics.criticalCount > 0 && (
            <div className="alert alert--critical">
              <span className="alert__icon">⚠</span>
              <span>
                {metrics.criticalCount} feedback
                {metrics.criticalCount > 1 ? "s" : ""} crítico
                {metrics.criticalCount > 1 ? "s" : ""} — revisão prioritária
                necessária.
              </span>
            </div>
          )}

          <div className="dash-grid">
            <Card className="dash-card">
              <h4 className="dash-card__title">Distribuição por severidade</h4>
              {Object.entries(metrics.severityCounts).map(([key, count]) => {
                const label = {
                  baixa: "Baixa",
                  media: "Média",
                  alta: "Alta",
                  bloqueante: "Bloqueante",
                }[key];
                const color = {
                  baixa: "success",
                  media: "info",
                  alta: "warning",
                  bloqueante: "error",
                }[key];
                const pct = metrics.total
                  ? Math.round((count / metrics.total) * 100)
                  : 0;
                return (
                  <div key={key} className="sev-row">
                    <span className="sev-row__label">{label}</span>
                    <ProgressBar value={pct} color={color} />
                    <span className="sev-row__count">{count}</span>
                  </div>
                );
              })}
            </Card>

            <Card className="dash-card">
              <h4 className="dash-card__title">Validado vs crítico</h4>
              <div className="status-counts">
                <div className="status-count status-count--success">
                  <span className="status-count__value">
                    {metrics.validatedCount}
                  </span>
                  <span className="status-count__label">Validados</span>
                </div>
                <div className="status-count status-count--error">
                  <span className="status-count__value">
                    {metrics.criticalCount}
                  </span>
                  <span className="status-count__label">Críticos</span>
                </div>
                <div className="status-count">
                  <span className="status-count__value">
                    {metrics.total -
                      metrics.validatedCount -
                      metrics.criticalCount}
                  </span>
                  <span className="status-count__label">Em análise</span>
                </div>
              </div>
            </Card>
          </div>

          {}
          <section className="dash-section">
            <h3 className="dash-section__title">Mapa de emoções</h3>
            <div className="emotion-map">
              {topEmotions.map(([emotion, count]) => {
                const valence = EMOTION_VALENCE[emotion] || "neutral";
                return (
                  <div
                    key={emotion}
                    className={`emotion-bubble emotion-bubble--${valence}`}
                  >
                    <span className="emotion-bubble__label">
                      {EMOTION_LABELS[emotion] || emotion}
                    </span>
                    <span className="emotion-bubble__count">{count}</span>
                  </div>
                );
              })}
              {topEmotions.length === 0 && (
                <p className="dash-empty">Nenhuma emoção registrada ainda.</p>
              )}
            </div>
          </section>

          <section className="dash-section">
            <h3 className="dash-section__title">Feedbacks por frente</h3>
            <div className="area-bars">
              {areaEntries.map(([area, count]) => {
                const pct = Math.round((count / metrics.total) * 100);
                return (
                  <div key={area} className="area-bar">
                    <span className="area-bar__label">
                      {AREA_LABELS[area] || area}
                    </span>
                    <div className="area-bar__track">
                      <div
                        className="area-bar__fill"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="area-bar__count">{count}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {metrics.improvements.length > 0 && (
            <section className="dash-section">
              <h3 className="dash-section__title">
                Principais melhorias sugeridas
              </h3>
              <Card>
                {metrics.improvements.map((imp, i) => (
                  <p
                    key={i}
                    style={{
                      fontSize: 13,
                      color: "var(--text-secondary)",
                      padding: "8px 0",
                      borderBottom:
                        i < metrics.improvements.length - 1
                          ? "1px solid var(--border)"
                          : "none",
                      lineHeight: 1.5,
                    }}
                  >
                    <span style={{ color: "var(--accent)", marginRight: 8 }}>
                      →
                    </span>
                    {imp}
                  </p>
                ))}
              </Card>
            </section>
          )}

          {}
          <section className="dash-section">
            <h3 className="dash-section__title">Todos os feedbacks</h3>
            <div className="feedback-list">
              {[...feedbacks].reverse().map((f) => (
                <FeedbackRow key={f.feedbackId} feedback={f} />
              ))}
            </div>
          </section>
        </>
      )}

      {showReport && (
        <AIReportModal
          feedbacks={feedbacks}
          metrics={metrics}
          onClose={() => setShowReport(false)}
        />
      )}
    </div>
  );
}
