const { initializeApp } = require("firebase-admin/app");
const hubspot = require("./webhooks/hubspot");
const { onRequest } = require("firebase-functions/v2/https");
require("dotenv").config();

initializeApp();

exports.hubSpotWebHook = onRequest(hubspot);
