const fs = require('fs');
const path = require('path');

// Read the mock file
const mockContent = fs.readFileSync(path.join(__dirname, '../src/mock/feedbacks.js'), 'utf8');

// It's an ES module so we can't require it directly without some Babel or transforming.
// Let's just run it via import() since node 16+ supports it if we use .mjs or set package.json type.
// Wait, package.json does not have "type": "module".
// But we can extract it using regex or just read it.
// Let's instead write a quick extraction of the JSON part from mock/feedbacks.js.

const match = mockContent.match(/export const MOCK_FEEDBACKS = (\[[\s\S]*\]);/);
if (match) {
  // It's a JS object, not pure JSON, so we can use eval.
  const uuid = () => "mock-uuid";
  const MOCK_DATE = new Date().toISOString();
  const feedbacks = eval(match[1]);
  console.log("=== DADOS ADQUIRIDOS ===");
  console.log("Total Feedbacks:", feedbacks.length);
  const areas = {};
  feedbacks.forEach(f => {
    const a = f.feedbackContext?.evaluatedArea;
    areas[a] = (areas[a] || 0) + 1;
  });
  console.log("Frentes avaliadas:", areas);
  const roles = {};
  feedbacks.forEach(f => {
    const r = f.userProfile?.role;
    roles[r] = (roles[r] || 0) + 1;
  });
  console.log("Cargos:", roles);
}
