import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_WHATSAPP_FROM || "whatsapp:+14155238886"; // Default Twilio sandbox number

export const sendWhatsAppMessage = async (to: string, message: string) => {
  try {
    if (!accountSid || !authToken) {
      console.log("Skipping WhatsApp: No TWILIO credentials provided.");
      return;
    }

    const client = twilio(accountSid, authToken);

    // Ensure 'to' is in WhatsApp format: whatsapp:+[number]
    const formattedTo = to.startsWith("whatsapp:") ? to : `whatsapp:${to}`;

    const response = await client.messages.create({
      from: fromNumber,
      body: message,
      to: formattedTo,
    });

    console.log("WhatsApp message sent successfully:", response.sid);
    return response;
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    throw error;
  }
};
