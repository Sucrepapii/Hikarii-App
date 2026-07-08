import { Expo, ExpoPushMessage } from 'expo-server-sdk';

// Create a new Expo SDK client
// optionally providing an access token if you have enabled push security
let expo = new Expo();

export const sendPushNotification = async (
  pushToken: string,
  title: string,
  body: string,
  data?: any
) => {
  // Check that all your push tokens appear to be valid Expo push tokens
  if (!Expo.isExpoPushToken(pushToken)) {
    console.error(`Push token ${pushToken} is not a valid Expo push token`);
    return;
  }

  // Construct a message
  const message: ExpoPushMessage = {
    to: pushToken,
    sound: 'default',
    title: title,
    body: body,
    data: data,
  };

  try {
    const receipts = await expo.sendPushNotificationsAsync([message]);
    console.log("Push notification sent:", receipts);
    return receipts;
  } catch (error) {
    console.error("Error sending push notification:", error);
  }
};
