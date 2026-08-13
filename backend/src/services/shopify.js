// Shopify Admin GraphQL API integration.
//
// AUTH: Client Credentials Grant (current Dev Dashboard auth method) - the
// backend exchanges Client ID + Client Secret for a short-lived (24hr)
// access token at runtime, cached in memory, auto-refreshed before expiry.
// See https://shopify.dev/docs/apps/build/dev-dashboard/get-api-access-tokens
const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || "2025-01";

let cachedToken = null;
let cachedTokenExpiresAt = 0;

async function getAccessToken() {
  if (cachedToken && Date.now() < cachedTokenExpiresAt - 60_000) {
    return cachedToken;
  }

  const response = await fetch(
    `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/oauth/access_token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.SHOPIFY_CLIENT_ID,
        client_secret: process.env.SHOPIFY_CLIENT_SECRET,
      }),
    }
  );

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Shopify token request failed (${response.status}): ${errBody}`);
  }

  const { access_token, expires_in } = await response.json();
  cachedToken = access_token;
  cachedTokenExpiresAt = Date.now() + expires_in * 1000;
  return cachedToken;
}

function shopifyGraphqlUrl() {
  return `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`;
}

async function shopifyGraphqlRequest(query, variables) {
  const token = await getAccessToken();
  const response = await fetch(shopifyGraphqlUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": token },
    body: JSON.stringify({ query, variables }),
  });
  const json = await response.json();
  if (json.errors) {
    throw new Error(`Shopify GraphQL error: ${JSON.stringify(json.errors)}`);
  }
  return json;
}

/**
 * Builds the ordered list of custom line item properties. Everything - both
 * the outfit-analysis data AND the customer's contact info - is stored this
 * way (Option B, as decided), not as native Shopify customer/address fields.
 * No category anywhere - not requested, not stored. Order here is preserved
 * by Shopify in Admin, invoice, and any emails.
 */
function buildCustomAttributes({
  outfitType,
  primaryFabric,
  secondaryFabrics = [], // [{ name }]
  mainImageUrl,
  name,
  phone,
  email,
  address,
  city,
  state,
  pincode,
}) {
  const attributes = [
    { key: "Outfit Type", value: outfitType },
    { key: "Primary Fabric", value: primaryFabric },
  ];

  secondaryFabrics.forEach((f, i) => {
    attributes.push({ key: `Secondary Fabric ${i + 1}`, value: f.name });
  });

  attributes.push({ key: "Main Outfit Image", value: mainImageUrl });

  attributes.push(
    { key: "Name", value: name },
    { key: "Phone", value: phone },
    { key: "Email", value: email },
    { key: "Address", value: address },
    { key: "City", value: city },
    { key: "State", value: state },
    { key: "Pincode", value: pincode }
  );

  return attributes;
}

/**
 * Creates a Shopify Draft Order as a LEAD record - not a real purchase.
 * No Shopify customer, no login, no checkout redirect. `finalPrice` must be
 * the SAME price already shown to the customer earlier - this function does
 * not recalculate it.
 */
async function createLeadDraftOrder({
  outfitType,
  finalPrice,
  primaryFabric,
  secondaryFabrics,
  mainImageUrl,
  name,
  phone,
  email,
  address,
  city,
  state,
  pincode,
}) {
  const mutation = `
    mutation draftOrderCreate($input: DraftOrderInput!) {
      draftOrderCreate(input: $input) {
        draftOrder {
          id
          name
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const customAttributes = buildCustomAttributes({
    outfitType, primaryFabric, secondaryFabrics, mainImageUrl,
    name, phone, email, address, city, state, pincode,
  });

  const variables = {
    input: {
      lineItems: [
        {
          title: `Outfit Enquiry - ${outfitType} (${primaryFabric})`,
          originalUnitPrice: finalPrice.toFixed(2),
          quantity: 1,
          customAttributes,
        },
      ],
    },
  };

  const { data } = await shopifyGraphqlRequest(mutation, variables);
  const { draftOrder, userErrors } = data.draftOrderCreate;


  if (userErrors && userErrors.length > 0) {
    throw new Error(`Shopify draftOrderCreate userErrors: ${JSON.stringify(userErrors)}`);
  }

  return draftOrder; // { id, name }
}

module.exports = { createLeadDraftOrder, buildCustomAttributes };