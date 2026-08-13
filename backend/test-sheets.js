/**
 * STANDALONE TEST SCRIPT - run manually: node test-sheets.js
 * Proves auth + sheet access + data parsing work in isolation, before
 * starting the real backend. Now also checks the Category and Description
 * columns added to the Outfit tab for the two-stage detection flow.
 */
require("dotenv").config();
const { GoogleSpreadsheet } = require("google-spreadsheet");
const { JWT } = require("google-auth-library");

async function main() {
  console.log("Step 1: Authenticating...");
  const auth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, auth);

  console.log("Step 2: Loading spreadsheet info...");
  await doc.loadInfo();
  console.log(`  Connected to: "${doc.title}"`);
  console.log(`  Tabs found: ${Object.keys(doc.sheetsByTitle).join(", ")}`);

  console.log("\nStep 3: Reading Fabric tab...");
  const fabricSheet = doc.sheetsByTitle["Fabric"];
  if (!fabricSheet) throw new Error('No tab named "Fabric" found.');
  const fabricRows = await fabricSheet.getRows();
  console.log(`  Row count: ${fabricRows.length}`);

  console.log("\nStep 4: Reading Outfit tab (including new Category/Description columns)...");
  const outfitSheet = doc.sheetsByTitle["Outfit"];
  if (!outfitSheet) throw new Error('No tab named "Outfit" found.');
  const outfitRows = await outfitSheet.getRows();
  console.log(`  Row count: ${outfitRows.length}`);

  const missingCategory = outfitRows.filter((r) => !r.get("Category")).length;
  const missingDescription = outfitRows.filter((r) => !r.get("Description")).length;
  console.log(`  Rows missing Category: ${missingCategory} / ${outfitRows.length}`);
  console.log(`  Rows missing Description: ${missingDescription} / ${outfitRows.length}`);

  const categoryCounts = {};
  outfitRows.forEach((r) => {
    const cat = r.get("Category") || "(blank)";
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });
  console.log("  Category breakdown:", categoryCounts);

  console.log("\nStep 5: Reading Price Brackets tab...");
  const bracketsSheet = doc.sheetsByTitle["Price Brackets"];
  if (!bracketsSheet) throw new Error('No tab named "Price Brackets" found.');
  const bracketRows = await bracketsSheet.getRows();
  console.log(`  Row count: ${bracketRows.length}`);

  console.log("\n✅ All tabs read successfully, including Category/Description columns.");
}

main().catch((err) => {
  console.error("\n❌ Test failed:", err.message);
  console.error(
    "\nCommon causes:\n" +
    "- Sheet not shared with the service account email\n" +
    "- GOOGLE_SHEET_ID wrong\n" +
    "- Private key not pasted correctly in .env\n" +
    "- Category/Description columns not yet added to the Outfit tab"
  );
  process.exit(1);
});
