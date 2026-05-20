import React from "react";

export function Button({
  children,
  variant = "primary",
  size = "md",
  onClick,
  disabled,
  type = "button",
  className = "",
}) {
  const base = "btn";
  const v = `btn--${variant}`;
  const s = `btn--${size}`;
  return (
    <button
      type={type}
      className={`${base} ${v} ${s} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

// ─── Card ──────────────────────────────────────────────────
export function Card({ children, className = "", onClick }) {
  return (
    <div className={`card ${className}`} onClick={onClick}>
      {children}
    </div>
  );
}

export function Badge({ children, color = "accent" }) {
  return <span className={`badge badge--${color}`}>{children}</span>;
}

// ─── ProgressBar ───────────────────────────────────────────
export function ProgressBar({ value, max = 100, color = "accent" }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="progress-bar">
      <div
        className={`progress-bar__fill progress-bar__fill--${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function ScoreRing({
  value,
  max = 100,
  size = 80,
  label,
  color = "accent",
}) {
  const r = size / 2 - 6;
  const circumference = 2 * Math.PI * r;
  const pct = value != null ? Math.min(1, value / max) : 0;
  const offset = circumference * (1 - pct);

  return (
    <div className="score-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          className="score-ring__track"
          strokeWidth="5"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          className={`score-ring__fill score-ring__fill--${color}`}
          strokeWidth="5"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="score-ring__center">
        <span className="score-ring__value">{value != null ? value : "—"}</span>
      </div>
      {label && <div className="score-ring__label">{label}</div>}
    </div>
  );
}

export function Tooltip({ content, children }) {
  return (
    <span className="tooltip-wrap">
      {children}
      <span className="tooltip-box">{content}</span>
    </span>
  );
}

export function Divider({ label }) {
  return (
    <div className="divider">
      {label && <span className="divider__label">{label}</span>}
    </div>
  );
}

export function ScoreCard({ label, value, color = "accent", size = 72 }) {
  return (
    <div className="score-card">
      <ScoreRing value={value} size={size} color={color} />
      <span className="score-card__label">{label}</span>
    </div>
  );
}
