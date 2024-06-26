const axios = require("axios").default;

const activecampaign = async (request, response) => {
  // Puxa o payload da requisição
  const body = request.body;

  try {
    // Extraio o contactId para puxar as informações personalizadas, isso acontece por que o webhook da active
    // campaign não retorna diretamente os campos personalizados;
    const { contactid } = body.deal;
    // Monta o objeto de requisição para solicitar os campos personalizados para api da AC -> Active Campaign
    const requestOptions = {
      method: "GET",
      url: `${process.env.ACTIVE_CAMPAIGN_URL}/api/3/contacts/${contactid}/fieldValues`,
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "Api-Token": process.env.ACTIVE_CAMPAIGN_TOKEN,
      },
    };

    // Recebo a resposta da solicitação
    const fieldValuesResponse = await axios.request(requestOptions);
    const {
      data: { fieldValues },
    } = fieldValuesResponse;

    // Extraio o client_id e o session_id
    const clientAndSessionId = fieldValues.reduce((obj, item) => {
      if (item.field === process.env.ACTIVE_CAMPAIGN_FIELDVALUE_CLIENT_ID) {
        obj.client_id = item.value;
      } else if (
        item.field === process.env.ACTIVE_CAMPAIGN_FIELDVALUE_SESSION_ID
      ) {
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
