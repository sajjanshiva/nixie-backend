const sheetsData = require("./sheetsData");

/**
 * How much a secondary fabric contributes to the price score, relative to a
 * primary fabric at full weight. PROVISIONAL VALUE - confirm the real number
 * with the tech lead; this is intentionally a single named constant so it's
 * a one-line change later, not a formula rewrite.
 */
const SECONDARY_FABRIC_DAMPING = 0.35;

/**
 * Returns { name, description } for every outfit, sorted alphabetically.
 * Used to build the Gemini prompt and to populate the outfit override
 * dropdown. No category filtering - every outfit in the sheet is
 * AI-detectable, including entries like "Anything requiring hand beading"
 * (per explicit instruction - the sheet's own outfit list is the sole
 * source of truth for what's detectable, managed entirely by the business).
 */
function getAllOutfits() {
  const outfits = sheetsData.getOutfits();
  return Object.entries(outfits)
    .map(([name, spec]) => ({ name, description: spec.description }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function getValidFabricTypes() {
  return Object.keys(sheetsData.getFabricWeights()).sort();
}

/**
 * Core deterministic price calculation - now takes a list of fabrics, each
 * tagged with a role ("primary" or "secondary"), instead of a single fabric.
 *
 * combinedFabricWeight = primaryWeight + SECONDARY_FABRIC_DAMPING * sum(secondaryWeights)
 * score = combinedFabricWeight + outfit.weight + outfit.metreageWeight + outfit.liningWeight
 *
 * Exactly one fabric in `fabrics` must have role "primary". 0-2 may have
 * role "secondary". This matches both the AI detection shape (primary +
 * up to 2 secondary) and the manual-override UI (fixed dropdown count,
 * position = role - see frontend ResultStep.jsx).
 *
 * bracket = the Price Bracket row whose scoreMin <= score <= scoreMax
 * finalPrice = a FIXED point 80% through that bracket's price range
 * (deterministic - same inputs always give the same price, no randomness).
 *
 * Call this once per session and pass the result through unchanged to lead
 * submission - never recalculate at submit time.
 */
function calculatePrice(outfitType, fabrics) {
  const fabricWeights = sheetsData.getFabricWeights();
  const outfits = sheetsData.getOutfits();
  const priceBrackets = sheetsData.getPriceBrackets();

  const outfit = outfits[outfitType];
  if (!outfit) {
    throw new Error(`Unknown outfit type: "${outfitType}"`);
  }

  if (!Array.isArray(fabrics) || fabrics.length === 0) {
    throw new Error("At least one fabric (the primary) is required.");
  }
  const primaries = fabrics.filter((f) => f.role === "primary");
  if (primaries.length !== 1) {
    throw new Error(`Expected exactly 1 primary fabric, got ${primaries.length}.`);
  }
  const secondaries = fabrics.filter((f) => f.role === "secondary");
  if (secondaries.length > 2) {
    throw new Error(`Expected at most 2 secondary fabrics, got ${secondaries.length}.`);
  }

  function weightOf(fabricName) {
    const w = fabricWeights[fabricName];
    if (w === undefined) throw new Error(`Unknown fabric type: "${fabricName}"`);
    return w;
  }

  const primaryWeight = weightOf(primaries[0].name);
  const secondaryWeightSum = secondaries.reduce((sum, f) => sum + weightOf(f.name), 0);
  const combinedFabricWeight = primaryWeight + SECONDARY_FABRIC_DAMPING * secondaryWeightSum;

  const rawScore = combinedFabricWeight + outfit.weight + outfit.metreageWeight + outfit.liningWeight;
  // Round to 2 decimals - without this, floating-point arithmetic (e.g. the
  // 0.35 damping factor) can produce a score like 11.200000000000001 instead
  // of exactly 11.2, missing a bracket boundary by a hair and throwing a
  // false "no bracket found" error. Caught via testing, not theoretical.
  const score = Math.round(rawScore * 100) / 100;

  const bracket = priceBrackets.find((b) => score >= b.scoreMin && score <= b.scoreMax);
  if (!bracket) {
    throw new Error(
      `No price bracket found for score ${score} (outfit: ${outfitType}). ` +
      `Valid score range is ${priceBrackets[0].scoreMin}-${priceBrackets[priceBrackets.length - 1].scoreMax}.`
    );
  }

  const FIXED_FRACTION = 0.8;
  const finalPrice = Math.round(bracket.priceMin + FIXED_FRACTION * (bracket.priceMax - bracket.priceMin));

  return {
    score,
    combinedFabricWeight,
    bracket: { priceMin: bracket.priceMin, priceMax: bracket.priceMax },
    finalPrice,
  };
}

module.exports = {
  getAllOutfits,
  getValidFabricTypes,
  calculatePrice,
  SECONDARY_FABRIC_DAMPING,
};