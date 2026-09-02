const { GoogleGenerativeAI } = require("@google/generative-ai");
const { getAllOutfits, getValidFabricTypes } = require("./pricing");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-2.0-flash";

function stripCodeFences(text) {
  return text.replace(/```json\s*/gi, "").replace(/```/g, "").trim();
}

function parseJsonResponse(rawText) {
  const cleaned = stripCodeFences(rawText);
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    throw new Error(`Gemini did not return valid JSON. Raw response: ${rawText}`);
  }
}

/**
 * Single-step detection: outfit type + primary fabric + up to 2 secondary
 * fabrics, all from ONE Gemini call against the full outfit list.
 *
 * NOTE: the earlier two-stage version (category first, then a narrowed
 * outfit list) gave better accuracy against outfit-confusion risk - this
 * was a deliberate trade-off (simpler UX, one AI call, one less screen),
 * confirmed with the tech lead, not an oversight.
 */
async function detectOutfitAndFabric(imageBuffer, mimeType) {
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const allOutfits = getAllOutfits();
  const validFabrics = getValidFabricTypes();

  const outfitList = allOutfits.map((o) => `- ${o.name}: ${o.description}`).join("\n");

  const prompt = `You are a fashion analysis assistant. Look at the attached reference image and identify the outfit style and fabric(s).

OUTFIT STYLE: pick the single closest match from this list (copy the name exactly as written, ignore the description after the colon - it's just to help you tell similar styles apart):
${outfitList}

FABRIC(S): identify the primary fabric (the one covering most of the garment) from this list: ${JSON.stringify(validFabrics)}
Only include a secondary fabric if it visibly covers a significant portion of the garment - ignore small trims, buttons, or thin accent details. List at most 2 secondary fabrics. If you only see one fabric, do not invent a second one.

COMMENT: write a warm, friendly, outfit-specific compliment in simple conversational English (max 4-6 words). You can mention the specific outfit (e.g. "top", "dress", "lehenga", "saree", "co-ord set") or its color and style. You can use words like "lovely", "fabulous", "pretty", "chic", "stylish", or "gorgeous", but DO NOT over-exaggerate with complex, deep, pretentious words (avoid words like "hue", "exquisite", "divine", "breathtaking", "radiant", "shimmering", or "craftsmanship"). Keep it simple, friendly, and relatable!
Good examples:
- "What a lovely top!"
- "Such a pretty dress!"
- "What a fabulous look!"
- "Love the color on this top!"
- "Such a chic, stylish co-ord set!"
- "What a lovely, elegant style!"
- "Such a pretty outfit!"
- "Love the design and fit!"
Keep it natural and friendly!

Respond with ONLY a JSON object, no markdown formatting, no explanation, in exactly this shape:
{
  "outfitType": "<exact name from the outfit list>",
  "outfitConfidence": <integer 0-100>,
  "primaryFabric": "<exact fabric name from the fabric list>",
  "primaryFabricConfidence": <integer 0-100>,
  "secondaryFabrics": [{"name": "<exact fabric name>", "confidence": <integer 0-100>}],
  "aiComment": "<short specific stylist compliment about this outfit>"
}
If there are no secondary fabrics, use an empty array for "secondaryFabrics".`;

  const imagePart = { inlineData: { data: imageBuffer.toString("base64"), mimeType } };
  const result = await model.generateContent([prompt, imagePart]);
  const parsed = parseJsonResponse(result.response.text());

  const validOutfitNames = allOutfits.map((o) => o.name);
  if (!validOutfitNames.includes(parsed.outfitType)) {
    throw new Error(`Gemini returned an outfitType not in our valid list: "${parsed.outfitType}"`);
  }
  if (!validFabrics.includes(parsed.primaryFabric)) {
    throw new Error(`Gemini returned a primaryFabric not in our valid list: "${parsed.primaryFabric}"`);
  }
  const secondaryFabrics = Array.isArray(parsed.secondaryFabrics) ? parsed.secondaryFabrics.slice(0, 2) : [];
  for (const sf of secondaryFabrics) {
    if (!validFabrics.includes(sf.name)) {
      throw new Error(`Gemini returned a secondary fabric not in our valid list: "${sf.name}"`);
    }
  }

  const fallbackComment = `What a stunning ${parsed.outfitType.toLowerCase()}!`;
  const aiComment =
    typeof parsed.aiComment === "string" && parsed.aiComment.trim().length > 3
      ? parsed.aiComment.trim()
      : fallbackComment;

  return {
    outfitType: parsed.outfitType,
    outfitConfidence: parsed.outfitConfidence,
    primaryFabric: parsed.primaryFabric,
    primaryFabricConfidence: parsed.primaryFabricConfidence,
    secondaryFabrics,
    aiComment,
  };
}

module.exports = { detectOutfitAndFabric };
