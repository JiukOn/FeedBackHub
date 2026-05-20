import React, { useState } from "react";
import { FORM_STEPS, AREA_SPECIFIC_QUESTIONS } from "../config/questions";
import { FormField } from "../components/FormFields";
import { Button, Card } from "../components/ui";
import { saveFeedback } from "../store/feedbackStore";
import { v4 as uuid } from "uuid";
import {
  scanTextForSensitiveData,
  PRIVACY_MESSAGES,
} from "../constants/privacy";

function buildPayload(formData, meta) {
  return {
    feedbackId: uuid(),
    createdAt: new Date().toISOString(),
    appVersion: "1.0.0",
    environment: "prototype",
    source: "github-pages",

    userProfile: {
      role: formData.role,
      segment: formData.segment,
      usageFrequency: formData.usageFrequency,
    },

    feedbackContext: {
      evaluatedArea: formData.evaluatedArea,
      scenario: formData.scenario,
      objective: formData.objective,
    },

    ratings: {
      overallScore: formData.overallScore,
      recommendationScore: formData.recommendationScore,
      usefulness: formData.usefulness,
      trust: formData.trust,
      clarity: formData.clarity,
      contextAdherence: formData.contextAdherence,
      decisionSupport: formData.decisionSupport,
      easeOfUse: formData.easeOfUse,
      safety: formData.safety,
      speed: formData.speed,
      intentionToUse: formData.intentionToUse,
    },

    perception: {
      emotions: formData.emotions || [],
      emotionIntensity: formData.emotionIntensity,
    },

    actionability: {
      intendedAction: formData.intendedAction,
      rejectionReason: formData.rejectionReason,
    },

    qualitative: {
      whatWorked: formData.whatWorked,
      whatToImprove: formData.whatToImprove,
      missingContext: formData.missingContext,
      incorrectOrRiskyInfo: formData.incorrectOrRiskyInfo,
      mostImportantImprovement: formData.mostImportantImprovement,
      realUseCaseExample: formData.realUseCaseExample,
    },

    areaSpecific: meta.areaSpecificData || {},

    classification: {
      feedbackType: formData.feedbackType,
      severity: formData.severity,
      impact: formData.impact,
    },

    followUp: {
      allowContact: formData.allowContact || false,
      contactEmail: formData.allowContact ? formData.contactEmail : undefined,
    },
  };
}

function validateStep(step, formData) {
  const errors = {};
  const allQuestions = step.questions;

  allQuestions.forEach((q) => {
    if (q.showIf && !q.showIf(formData)) return;

    const val = formData[q.id];

    if (q.type === "textarea" && val) {
      const sensitiveFound = scanTextForSensitiveData(val);
      if (sensitiveFound.length > 0) {
        errors[q.id] =
          `⚠️ Remova dados sensíveis: ${sensitiveFound.join(", ")}.`;
      }
    }

    if (!q.required) return;

    if (val == null || val === "" || (Array.isArray(val) && val.length === 0)) {
      if (!errors[q.id]) errors[q.id] = "Campo obrigatório";
    }
  });

  return errors;
}

export default function FormPage({ onSubmit, setPage }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [areaSpecificData, setAreaSpecificData] = useState({});
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [lastPayload, setLastPayload] = useState(null);

  const totalSteps = FORM_STEPS.length;
  const step = FORM_STEPS[currentStep];

  const areaQuestions = AREA_SPECIFIC_QUESTIONS[formData.evaluatedArea] || [];

  const update = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: undefined }));
  };

  const updateAreaSpecific = (id, value) => {
    setAreaSpecificData((prev) => ({ ...prev, [id]: value }));
  };

  const goNext = () => {
    const stepErrors = validateStep(step, formData);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    setCurrentStep((s) => Math.min(s + 1, totalSteps - 1));
    window.scrollTo(0, 0);
  };

  const goBack = () => {
    setCurrentStep((s) => Math.max(s - 1, 0));
    window.scrollTo(0, 0);
  };

  const handleSubmit = () => {
    const stepErrors = validateStep(step, formData);
    if (!formData.privacyConsent) {
      stepErrors.privacyConsent = "Você precisa confirmar antes de enviar.";
    }
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    const payload = buildPayload(formData, { areaSpecificData });
    saveFeedback(payload);
    setLastPayload(payload);
    setSubmitted(true);
    if (onSubmit) onSubmit(payload);
  };

  if (submitted && lastPayload) {
    return (
      <ConfirmationScreen
        payload={lastPayload}
        setPage={setPage}
        onNew={() => {
          setFormData({});
          setAreaSpecificData({});
          setErrors({});
          setCurrentStep(0);
          setSubmitted(false);
          setLastPayload(null);
        }}
      />
    );
  }

  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="form-page">
      {}
      <div className="form-progress">
        <div className="form-progress__bar" style={{ width: `${progress}%` }} />
      </div>

      {}
      <div className="steps-nav">
        {FORM_STEPS.map((s, i) => (
          <button
            key={s.id}
            className={`step-indicator ${i === currentStep ? "step-indicator--active" : ""} ${i < currentStep ? "step-indicator--done" : ""}`}
            onClick={() => i < currentStep && setCurrentStep(i)}
          >
            <span className="step-indicator__icon">
              {i < currentStep ? "✓" : s.icon}
            </span>
            <span className="step-indicator__label">{s.label}</span>
          </button>
        ))}
      </div>

      {}
      <div className="form-body">
        <div className="form-header">
          <span className="form-header__step">
            Etapa {currentStep + 1} de {totalSteps}
          </span>
          <h2 className="form-header__title">{step.title}</h2>
          <p className="form-header__desc">{step.description}</p>
          {step.privacyWarning && (
            <div className="privacy-warning">
              <span>⚐</span>
              <span>{PRIVACY_MESSAGES.warning}</span>
            </div>
          )}
        </div>

        <Card className="form-card">
          {step.questions.map((q) => (
            <div key={q.id}>
              <FormField
                question={q}
                value={formData[q.id]}
                onChange={(v) => update(q.id, v)}
                formData={formData}
              />
              {errors[q.id] && <p className="field__error">{errors[q.id]}</p>}
            </div>
          ))}

          {}
          {currentStep === 1 && areaQuestions.length > 0 && (
            <div className="area-specific">
              <div className="area-specific__header">
                <span className="area-specific__tag">
                  Perguntas específicas
                </span>
                <p className="area-specific__hint">
                  Para a frente: <strong>{formData.evaluatedArea}</strong>
                </p>
              </div>
              {areaQuestions.map((q) => (
                <FormField
                  key={q.id}
                  question={q}
                  value={areaSpecificData[q.id]}
                  onChange={(v) => updateAreaSpecific(q.id, v)}
                  formData={{ ...formData, ...areaSpecificData }}
                />
              ))}
            </div>
          )}
        </Card>

        {/* Navigation */}
        <div className="form-nav">
          {currentStep > 0 && (
            <Button variant="ghost" onClick={goBack}>
              ← Voltar
            </Button>
          )}
          <div className="form-nav__spacer" />
          {currentStep < totalSteps - 1 ? (
            <Button onClick={goNext}>Continuar →</Button>
          ) : (
            <Button onClick={handleSubmit} variant="success">
              Enviar feedback ✓
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function ConfirmationScreen({ payload, onNew, setPage }) {
  return (
    <div className="confirmation">
      <div className="confirmation__icon">◆</div>
      <h2 className="confirmation__title">Feedback registrado!</h2>
      <p className="confirmation__desc">
        Obrigado pela contribuição. Esse feedback vira insumo direto para
        melhoria do programa.
      </p>

      <Card className="confirmation__summary">
        <div className="confirm-row">
          <span className="confirm-row__label">Protocolo</span>
          <span className="confirm-row__value confirm-row__value--mono">
            {payload.feedbackId.slice(0, 8).toUpperCase()}
          </span>
        </div>
        <div className="confirm-row">
          <span className="confirm-row__label">Frente avaliada</span>
          <span className="confirm-row__value">
            {payload.feedbackContext.evaluatedArea || "—"}
          </span>
        </div>
        <div className="confirm-row">
          <span className="confirm-row__label">Nota geral</span>
          <span className="confirm-row__value">
            {payload.ratings.overallScore ?? "—"} / 10
          </span>
        </div>
        <div className="confirm-row">
          <span className="confirm-row__label">Tipo</span>
          <span className="confirm-row__value">
            {payload.classification.feedbackType || "—"}
          </span>
        </div>
        <div className="confirm-row">
          <span className="confirm-row__label">Severidade</span>
          <span className="confirm-row__value">
            {payload.classification.severity || "—"}
          </span>
        </div>
        <div className="confirm-row">
          <span className="confirm-row__label">Registrado em</span>
          <span className="confirm-row__value">
            {new Date(payload.createdAt).toLocaleString("pt-BR")}
          </span>
        </div>
      </Card>

      <div className="confirmation__actions">
        <Button onClick={onNew}>Enviar outro feedback</Button>
        {setPage && (
          <Button variant="ghost" onClick={() => setPage("dashboard")}>
            Ver no dashboard →
          </Button>
        )}
      </div>
    </div>
  );
}
