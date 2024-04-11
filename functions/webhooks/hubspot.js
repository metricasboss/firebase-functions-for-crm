const axios = require("axios").default;
const { Client } = require("@hubspot/api-client");

const hubspot = async (request, response) => {
  const events = request.body;
  const promises = events.map(async (event) => {
    const { objectId, propertyValue } = event;
    // Se não for o lifecyclestage nem brinca manda esse request embora
    // early return
    if (event.propertyValue == "lifecyclestage") return;

    try {
      // Configura o cliente da API da HubSpot
      const hubspotClient = new Client({
        accessToken: process.env.HUBSPOT_ACCESS_TOKEN,
      });

      const contactProperties =
        await hubspotClient.crm.contacts.basicApi.getById(
          objectId /* Que está representado aqui */,
          ["client_id", "session_id"]
        );

      const { client_id, session_id } = contactProperties.properties;

      // Preparando o payload para o GA4
      const gaPayload = {
        client_id: client_id,
        events: [
          {
            name: propertyValue, // Evento personalizado
            params: {
              session_id: session_id,
              engagement_time_msec: "100",
            },
          },
        ],
      };

      const response = await axios.post(
        `https://www.google-analytics.com/mp/collect?measurement_id=${process.env.GA4_MEASUREMENT_ID}&api_secret=${process.env.GA4_API_SECRET}`,
        gaPayload
      );

      return response.status === 204 ? true : false;
    } catch (error) {
      console.error(
        `Erro ao processar evento objectId ${objectId}: ${error.message}`
      );
      return null;
    }
  });

  await Promise.all(promises);

  response.status(200);
};

module.exports = hubspot;
