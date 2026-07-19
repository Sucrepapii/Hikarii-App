import dotenv from "dotenv";
dotenv.config();

const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

export const sendWhatsAppMessage = async (to: string, message: string) => {
  try {
    if (!accessToken || !phoneNumberId) {
      console.log("Skipping WhatsApp: No WHATSAPP credentials provided.");
      return;
    }

    // Clean phone number (Meta expects digits only, e.g., '2349024129891' without '+' or 'whatsapp:')
    const formattedTo = to.replace("whatsapp:", "").replace(/\D/g, "");

    const url = `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: formattedTo,
        type: "text",
        text: {
          preview_url: false,
          body: message,
        },
      }),
    });

    const data = await response.json() as any;

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to send WhatsApp message");
    }

    console.log("WhatsApp message sent successfully via Meta:", data.messages?.[0]?.id);
    return data;
  } catch (error) {
    console.error("Error sending WhatsApp message via Meta:", error);
    throw error;
  }
};
