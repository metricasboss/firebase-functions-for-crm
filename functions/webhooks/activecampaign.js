const axios = require("axios").default;

const activecampaign = async (request, response) => {
  const body = request.body;

  try {
    const { contactid } = body.deal;

    const requestOptions = {
      method: "GET",
      url: `${process.env.ACTIVE_CAMPAIGN_URL}/api/3/contacts/${contactid}/fieldValues`,
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "Api-Token": process.env.ACTIVE_CAMPAIGN_TOKEN,
      },
    };

    const fieldValuesResponse = await axios.request(requestOptions);
    const {
      data: { fieldValues },
    } = fieldValuesResponse;

    const clientAndSessionId = fieldValues.reduce((obj, item) => {
      if (item.field === "1") {
        obj.client_id = item.value;
      } else if (item.field === "2") {
        obj.session_id = item.value;
      }
      return obj;
    }, {});

    // Preparando o payload para o GA4
    const gaPayload = {
      client_id: clientAndSessionId.client_id,
      events: [
        {
          name: body.type, // Evento personalizado
          params: {
            session_id: clientAndSessionId.session_id,
            engagement_time_msec: "100",
            stage_title: body.stage_title,
            pipeline_title: body.pipeline_title,
          },
        },
      ],
    };

    await axios.post(
      `https://www.google-analytics.com/mp/collect?measurement_id=${process.env.GA4_MEASUREMENT_ID}&api_secret=${process.env.GA4_API_SECRET}`,
      gaPayload
    );

    return response.status(200).send();
  } catch (error) {
    console.error(`Erro ao processar evento  ${error.message}`);
    return null;
  }
};

module.exports = activecampaign;
