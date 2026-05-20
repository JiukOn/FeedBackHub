import React from "react";

export function SelectField({ question, value, onChange }) {
  return (
    <div className="field">
      <label className="field__label">
        {question.label}
        {question.required && <span className="field__required">*</span>}
      </label>
      <div className="radio-group">
        {question.options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`radio-chip ${value === opt.value ? "radio-chip--active" : ""}`}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Multiselect ──────────────────────────────────────────
export function MultiSelectField({ question, value = [], onChange }) {
  const toggle = (v) => {
    if (value.includes(v)) {
      onChange(value.filter((x) => x !== v));
    } else {
      onChange([...value, v]);
    }
  };
  return (
    <div className="field">
      <label className="field__label">
        {question.label}
        {question.required && <span className="field__required">*</span>}
      </label>
      <div className="radio-group">
        {question.options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`radio-chip ${value.includes(opt.value) ? "radio-chip--active" : ""}`}
            onClick={() => toggle(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function EmotionField({ question, value = [], onChange }) {
  const max = question.maxSelections || 2;

  const toggle = (v) => {
    if (value.includes(v)) {
      onChange(value.filter((x) => x !== v));
    } else if (value.length < max) {
      onChange([...value, v]);
    }
  };

  const colorMap = {
    success: "emotion--success",
    info: "emotion--info",
    warning: "emotion--warning",
    error: "emotion--error",
    muted: "emotion--muted",
  };

  return (
    <div className="field">
      <label className="field__label">
        {question.label}
        {question.required && <span className="field__required">*</span>}
      </label>
      <div className="emotion-grid">
        {question.options.map((opt) => {
          const selected = value.includes(opt.value);
          const disabled = !selected && value.length >= max;
          return (
            <button
              key={opt.value}
              type="button"
              className={`emotion-chip ${colorMap[opt.color] || ""} ${selected ? "emotion-chip--active" : ""} ${disabled ? "emotion-chip--disabled" : ""}`}
              onClick={() => !disabled && toggle(opt.value)}
            >
              <span className="emotion-chip__label">{opt.label}</span>
              <span className="emotion-chip__desc">{opt.description}</span>
            </button>
          );
        })}
      </div>
      <p className="field__hint">Selecione até {max}</p>
    </div>
  );
}

export function Rating5Field({ question, value, onChange }) {
  return (
    <div className="field">
      <label className="field__label">
        {question.label}
        {question.required && <span className="field__required">*</span>}
      </label>
      <div className="rating5">
        {question.lowLabel && (
          <span className="rating5__label rating5__label--low">
            {question.lowLabel}
          </span>
        )}
        <div className="rating5__dots">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              className={`rating5__dot ${value === n ? "rating5__dot--active" : ""} ${value > n ? "rating5__dot--filled" : ""}`}
              onClick={() => onChange(n)}
            >
              <span className="rating5__dot-inner" />
              <span className="rating5__dot-num">{n}</span>
            </button>
          ))}
        </div>
        {question.highLabel && (
          <span className="rating5__label rating5__label--high">
            {question.highLabel}
          </span>
        )}
      </div>
    </div>
  );
}

export function Rating10Field({ question, value, onChange }) {
  return (
    <div className="field">
      <label className="field__label">
        {question.label}
        {question.required && <span className="field__required">*</span>}
      </label>
      <div className="rating10">
        <div className="rating10__scale">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <button
              key={n}
              type="button"
              className={`rating10__btn ${value === n ? "rating10__btn--active" : ""}`}
              onClick={() => onChange(n)}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="rating10__labels">
          <span>{question.lowLabel || "Muito ruim"}</span>
          <span>{question.highLabel || "Excelente"}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Textarea ─────────────────────────────────────────────
export function TextareaField({ question, value, onChange }) {
  return (
    <div className="field">
      <label className="field__label">
        {question.label}
        {question.required && <span className="field__required">*</span>}
      </label>
      <textarea
        className="field__textarea"
        rows={question.rows || 3}
        placeholder={question.placeholder || ""}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

// ─── Checkbox ─────────────────────────────────────────────
export function CheckboxField({ question, value, onChange }) {
  return (
    <div className="field field--checkbox">
      <label className="checkbox-label">
        <input
          type="checkbox"
          className="checkbox-input"
          checked={!!value}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="checkbox-box" />
        <span className="checkbox-text">
          {question.label}
          {question.required && <span className="field__required">*</span>}
        </span>
      </label>
    </div>
  );
}

// ─── Field Router ─────────────────────────────────────────
export function FormField({ question, value, onChange, formData }) {
  // Verifica condição de exibição
  if (question.showIf && !question.showIf(formData)) return null;

  const props = { question, value, onChange };

  switch (question.type) {
    case "select":
      return <SelectField {...props} />;
    case "multiselect":
      return <MultiSelectField {...props} />;
    case "emotion":
      return <EmotionField {...props} />;
    case "rating5":
      return <Rating5Field {...props} />;
    case "rating10":
      return <Rating10Field {...props} />;
    case "textarea":
      return <TextareaField {...props} />;
    case "checkbox":
      return <CheckboxField {...props} />;
    default:
      return null;
  }
}
