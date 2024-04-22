const axios = require("axios").default;

const rdstationcrm = async (request, response) => {
  // Puxa o payload da requisição
  const body = request.body;

  try {
    // Extraio o contactId para puxar as informações personalizadas, isso acontece por que o webhook da active
    // campaign não retorna diretamente os campos personalizados;
    const {
      event_name,
      document: { user },
    } = body;

    // Monta o objeto de requisição para solicitar os campos personalizados para api da AC -> Active Campaign
    const requestOptions = {
      method: "GET",
      url: `https://crm.rdstation.com/api/v1/contacts/${user.id}?token=${process.env.RD_ACCESS_TOKEN}`,
    };

    // Recebo a resposta da solicitação
    const contactResponse = await axios.request(requestOptions);
    const {
      data: { contact_custom_fields },
    } = contactResponse;

    // Extraio o client_id e o session_id
    const clientAndSessionId = contact_custom_fields.reduce((obj, item) => {
      if (item.custom_field_id === process.env.RD_FIELDVALUE_CLIENT_ID) {
        obj.client_id = item.value;
      } else if (
        item.custom_field_id === process.env.RD_FIELDVALUE_SESSION_ID
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
          name: event_name, // Evento personalizado
          params: {
            session_id: clientAndSessionId.session_id,
            engagement_time_msec: "100",
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

module.exports = rdstationcrm;
