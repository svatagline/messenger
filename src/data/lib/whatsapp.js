import axios from "axios";

export async function sendWhatsAppTemplate({
  to,
  sender,
  message,
  documentUrl,
}) {
  const url = `https://graph.facebook.com/v19.0/${process.env.PHONE_NUMBER_ID}/messages`;

  const payload = {
    messaging_product: "whatsapp",
    to,
    type: "template",
    template: {
      name: "invoice_message",
      language: { code: "en" },
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: sender },
            { type: "text", text: message },
          ],
        },
      ],
    },
  };

  const headers = {
    Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
    "Content-Type": "application/json",
  };

  return axios.post(url, payload, { headers });
}
