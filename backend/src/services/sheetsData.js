const { GoogleSpreadsheet } = require("google-spreadsheet");
const { JWT } = require("google-auth-library");

// In-memory cache only - plain variables in this process's RAM, wiped on
// restart, repopulated by refresh() at startup before the server accepts
// requests. See index.js for the startup sequence.
let cache = {
  fabricWeights: null,
  outfits: null,       // { [name]: { weight, metreage, metreageWeight, lining, liningWeight, description } }
  priceBrackets: null,
  lastUpdated: null,
};

let refreshTimer = null;

function getAuth() {
  return new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
}

function parseFabricSheet(rows) {
  const fabricWeights = {};
  for (const row of rows) {
    const name = row.get("Fabric");
    const weight = Number(row.get("Weight"));
    if (!name) continue;
    if (Number.isNaN(weight)) {
      throw new Error(`Fabric tab: "${name}" has a non-numeric or missing Weight value.`);
    }
    fabricWeights[name.trim()] = weight;
  }
  return fabricWeights;
}

function parseOutfitSheet(rows) {
  const outfits = {};
  for (const row of rows) {
    const name = row.get("Outfit");
    if (!name) continue;

    const weight = Number(row.get("Weight"));
    const metreage = Number(row.get("Metreage"));
    const metreageWeight = Number(row.get("Metreage Weight"));
    const lining = Number(row.get("Lining"));
    const liningWeight = Number(row.get("Lining Weight"));

    const numericFields = { weight, metreage, metreageWeight, lining, liningWeight };
    for (const [field, value] of Object.entries(numericFields)) {
      if (Number.isNaN(value)) {
        throw new Error(`Outfit tab: "${name}" has a non-numeric or missing "${field}" value.`);
      }
    }

    const description = (row.get("Description") || "").trim();
    if (!description) {
      console.warn(`[sheetsData] Warning: "${name}" has no Description defined yet.`);
    }

    outfits[name.trim()] = { ...numericFields, description };
  }
  return outfits;
}

function parsePriceBracketsSheet(rows) {
  const priceBrackets = [];
  for (const row of rows) {
    const label = row.get("Price Brackets");
    const scoreMin = Number(row.get("Score Min"));
    const scoreMax = Number(row.get("Score Max"));
    if (!label) continue;

    const match = label.match(/(\d+)\D+(\d+)/);
    if (!match) {
      throw new Error(`Price Brackets tab: could not parse a price range from "${label}".`);
    }
    const priceMin = Number(match[1]);
    const priceMax = Number(match[2]);

    if (Number.isNaN(scoreMin) || Number.isNaN(scoreMax)) {
      throw new Error(`Price Brackets tab: row "${label}" has a non-numeric Score Min/Max.`);
    }

    priceBrackets.push({ priceMin, priceMax, scoreMin, scoreMax });
  }
  return priceBrackets;
}

function validate({ fabricWeights, outfits, priceBrackets }) {
  if (Object.keys(fabricWeights).length === 0) throw new Error("Validation failed: fabricWeights is empty.");
  if (Object.keys(outfits).length === 0) throw new Error("Validation failed: outfits is empty.");
  if (priceBrackets.length === 0) throw new Error("Validation failed: priceBrackets is empty.");
}

async function fetchAndParse() {
  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, getAuth());
  await doc.loadInfo();

  const fabricSheet = doc.sheetsByTitle["Fabric"];
  const outfitSheet = doc.sheetsByTitle["Outfit"];
  const bracketsSheet = doc.sheetsByTitle["Price Brackets"];

  if (!fabricSheet || !outfitSheet || !bracketsSheet) {
    throw new Error(`One or more expected tabs not found. Found: ${Object.keys(doc.sheetsByTitle).join(", ")}`);
  }

  const [fabricRows, outfitRows, bracketRows] = await Promise.all([
    fabricSheet.getRows(),
    outfitSheet.getRows(),
    bracketsSheet.getRows(),
  ]);

  const parsed = {
    fabricWeights: parseFabricSheet(fabricRows),
    outfits: parseOutfitSheet(outfitRows),
    priceBrackets: parsePriceBracketsSheet(bracketRows),
  };

  validate(parsed);
  return parsed;
}

async function refresh() {
  try {
    const fresh = await fetchAndParse();
    cache = { ...fresh, lastUpdated: new Date() };
    console.log(`[sheetsData] Refreshed successfully at ${cache.lastUpdated.toISOString()}`);
  } catch (err) {
    console.error(`[sheetsData] Refresh failed: ${err.message}`);
    if (!cache.lastUpdated) throw err;
    console.error(`[sheetsData] Continuing to serve data cached from ${cache.lastUpdated.toISOString()}`);
  }
}

function startAutoRefresh() {
  const minutes = Number(process.env.PRICING_REFRESH_INTERVAL_MINUTES) || 15;
  if (refreshTimer) clearInterval(refreshTimer);
  refreshTimer = setInterval(() => refresh(), minutes * 60 * 1000);
  console.log(`[sheetsData] Auto-refresh scheduled every ${minutes} minute(s).`);
}

function getFabricWeights() {
  if (!cache.fabricWeights) throw new Error("Pricing data not loaded yet - refresh() must complete before use.");
  return cache.fabricWeights;
}

function getOutfits() {
  if (!cache.outfits) throw new Error("Pricing data not loaded yet - refresh() must complete before use.");
  return cache.outfits;
}

function getPriceBrackets() {
  if (!cache.priceBrackets) throw new Error("Pricing data not loaded yet - refresh() must complete before use.");
  return cache.priceBrackets;
}

function getLastUpdated() {
  return cache.lastUpdated;
}

module.exports = {
  refresh,
  startAutoRefresh,
  getFabricWeights,
  getOutfits,
  getPriceBrackets,
  getLastUpdated,
};