const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }
  return data;
}

const REQUIRED_ANALYZE_FIELDS = [
  "outfitType",
  "primaryFabric",
  "secondaryFabrics",
  "price",
  "allOutfits",
  "validFabricTypes",
];

function assertAnalyzeShape(data) {
  const missing = REQUIRED_ANALYZE_FIELDS.filter((key) => data?.[key] == null);
  if (missing.length > 0) {
    throw new Error(
      `The server returned an unexpected response (missing: ${missing.join(", ")}). ` +
        "The API is likely running an older version than this widget."
    );
  }
  return data;
}

export async function analyzeOutfit(file) {
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: "POST",
    body: formData,
  });
  return assertAnalyzeShape(await handleResponse(res));
}

export async function recalculatePrice(outfitType, fabrics) {
  const res = await fetch(`${API_BASE_URL}/api/recalculate-price`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ outfitType, fabrics }),
  });
  return handleResponse(res);
}

export async function submitLead(payload) {
  const res = await fetch(`${API_BASE_URL}/api/submit-lead`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}
