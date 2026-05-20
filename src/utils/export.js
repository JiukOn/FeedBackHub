export function exportJSON(feedbacks) {
  const blob = new Blob([JSON.stringify(feedbacks, null, 2)], {
    type: "application/json",
  });
  downloadBlob(blob, `feedback-hub-${dateStamp()}.json`);
}

export function exportNDJSON(feedbacks) {
  if (!feedbacks.length) return;
  const lines = feedbacks.map((f) => JSON.stringify(f)).join("\n");
  const blob = new Blob([lines + "\n"], { type: "application/x-ndjson" });
  downloadBlob(blob, `feedback-hub-${dateStamp()}.ndjson`);
}

export function exportCSV(feedbacks) {
  if (!feedbacks.length) return;

  const rows = feedbacks.map((f) => ({
    feedbackId: f.feedbackId,
    createdAt: f.createdAt,
    role: f.userProfile?.role || "",
    segment: f.userProfile?.segment || "",
    usageFrequency: f.userProfile?.usageFrequency || "",
    evaluatedArea: f.feedbackContext?.evaluatedArea || "",
    scenario: f.feedbackContext?.scenario || "",
    overallScore: f.ratings?.overallScore ?? "",
    recommendationScore: f.ratings?.recommendationScore ?? "",
    usefulness: f.ratings?.usefulness ?? "",
    trust: f.ratings?.trust ?? "",
    clarity: f.ratings?.clarity ?? "",
    contextAdherence: f.ratings?.contextAdherence ?? "",
    decisionSupport: f.ratings?.decisionSupport ?? "",
    easeOfUse: f.ratings?.easeOfUse ?? "",
    safety: f.ratings?.safety ?? "",
    speed: f.ratings?.speed ?? "",
    intentionToUse: f.ratings?.intentionToUse ?? "",
    emotions: (f.perception?.emotions || []).join("; "),
    emotionIntensity: f.perception?.emotionIntensity ?? "",
    intendedAction: f.actionability?.intendedAction || "",
    rejectionReason: f.actionability?.rejectionReason || "",
    whatWorked: f.qualitative?.whatWorked || "",
    whatToImprove: f.qualitative?.whatToImprove || "",
    missingContext: f.qualitative?.missingContext || "",
    incorrectOrRiskyInfo: f.qualitative?.incorrectOrRiskyInfo || "",
    mostImportantImprovement: f.qualitative?.mostImportantImprovement || "",
    feedbackType: f.classification?.feedbackType || "",
    severity: f.classification?.severity || "",
    impact: f.classification?.impact || "",
  }));

  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      headers.map((h) => `"${String(row[h]).replace(/"/g, '""')}"`).join(","),
    ),
  ].join("\n");

  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, `feedback-hub-${dateStamp()}.csv`);
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function dateStamp() {
  return new Date().toISOString().slice(0, 10);
}
