import { MOCK_FEEDBACKS } from "../mock/feedbacks";

const STORAGE_KEY = "feedback_hub_v1";

export function loadFeedbacks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      seedMockData();
      return MOCK_FEEDBACKS;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveFeedback(payload) {
  const all = loadFeedbacks();
  all.push(payload);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return true;
  } catch {
    return false;
  }
}

export function deleteFeedback(id) {
  const all = loadFeedbacks();
  const filtered = all.filter((f) => f.feedbackId !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function exportFeedbacks() {
  return loadFeedbacks();
}

export function clearFeedbacks() {
  localStorage.removeItem(STORAGE_KEY);
}

export function getFeedbackById(id) {
  return loadFeedbacks().find((f) => f.feedbackId === id) || null;
}

function seedMockData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_FEEDBACKS));
}
