const { initializeApp } = require("firebase-admin/app");
const hubspot = require("./webhooks/hubspot");
const { onRequest } = require("firebase-functions/v2/https");
const activecampaign = require("./webhooks/activecampaign");
const rdstationcrm = require("./webhooks/rdstationcrm");
require("dotenv").config();

initializeApp();

exports.hubSpotWebHook = onRequest(hubspot);
exports.activeCampaignWebHook = onRequest(activecampaign);
exports.rdstationcrm = onRequest(rdstationcrm);
