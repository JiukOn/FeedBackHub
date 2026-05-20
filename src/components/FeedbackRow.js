import React, { useState } from "react";
import { calculateScores, classifyFeedback } from "../utils/scoring";
import { Badge } from "./ui";
import { AREA_LABELS, getNPSLabel } from "../constants/labels";

export default function FeedbackRow({ feedback }) {
  const [expanded, setExpanded] = useState(false);
  const scores = calculateScores(feedback);
  const classification = classifyFeedback(scores, feedback);
  const colorMap = {
    success: "success",
    warning: "warning",
    error: "error",
    critical: "error",
    info: "info",
  };
  const nps = getNPSLabel(feedback.ratings?.recommendationScore);

  return (
    <>
      <div
        className="feedback-row feedback-row--expandable"
        onClick={() => setExpanded(!expanded)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setExpanded(!expanded)}
      >
        <div className="feedback-row__left">
          <Badge color={colorMap[classification.color] || "accent"}>
            {classification.icon} {classification.label}
          </Badge>
          <span className="feedback-row__area">
            {AREA_LABELS[feedback.feedbackContext?.evaluatedArea] || "—"}
          </span>
        </div>
        <div className="feedback-row__scores">
          <span className="feedback-row__score" title="Nota geral">
            ◆ {feedback.ratings?.overallScore ?? "—"}
          </span>
          <span className="feedback-row__score" title="Utilidade">
            ◈ {scores.usefulness ?? "—"}
          </span>
          <span className="feedback-row__score" title="Confiança">
            ◉ {scores.trust ?? "—"}
          </span>
        </div>
        <div className="feedback-row__meta">
          <span className="feedback-row__role">
            {feedback.userProfile?.role || "—"}
          </span>
          <span className="feedback-row__date">
            {new Date(feedback.createdAt).toLocaleDateString("pt-BR")}
          </span>
          {nps && (
            <span className={`nps-label ${nps.className}`}>{nps.label}</span>
          )}
        </div>
      </div>

      {expanded && (
        <div className="feedback-detail">
          <div className="feedback-detail__grid">
            <div className="feedback-detail__item">
              <span className="feedback-detail__label">Utilidade</span>
              <span className="feedback-detail__value">
                {scores.usefulness ?? "—"}/100
              </span>
            </div>
            <div className="feedback-detail__item">
              <span className="feedback-detail__label">Confiança</span>
              <span className="feedback-detail__value">
                {scores.trust ?? "—"}/100
              </span>
            </div>
            <div className="feedback-detail__item">
              <span className="feedback-detail__label">Contexto</span>
              <span className="feedback-detail__value">
                {scores.contextQuality ?? "—"}/100
              </span>
            </div>
            <div className="feedback-detail__item">
              <span className="feedback-detail__label">Adoção</span>
              <span className="feedback-detail__value">
                {scores.adoption ?? "—"}/100
              </span>
            </div>
            <div className="feedback-detail__item">
              <span className="feedback-detail__label">Risco</span>
              <span className="feedback-detail__value">{scores.risk}/100</span>
            </div>
            <div className="feedback-detail__item">
              <span className="feedback-detail__label">Geral (composto)</span>
              <span className="feedback-detail__value">
                {scores.overall}/100
              </span>
            </div>
          </div>

          {(feedback.qualitative?.whatWorked ||
            feedback.qualitative?.whatToImprove ||
            feedback.qualitative?.mostImportantImprovement) && (
            <div className="feedback-detail__qualitative">
              {feedback.qualitative.whatWorked && (
                <p>
                  <strong>O que funcionou: </strong>
                  {feedback.qualitative.whatWorked}
                </p>
              )}
              {feedback.qualitative.whatToImprove && (
                <p>
                  <strong>Melhorar: </strong>
                  {feedback.qualitative.whatToImprove}
                </p>
              )}
              {feedback.qualitative.mostImportantImprovement && (
                <p>
                  <strong>Prioridade: </strong>
                  {feedback.qualitative.mostImportantImprovement}
                </p>
              )}
              {feedback.qualitative.incorrectOrRiskyInfo && (
                <p>
                  <strong>Risco/Incorreto: </strong>
                  {feedback.qualitative.incorrectOrRiskyInfo}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
