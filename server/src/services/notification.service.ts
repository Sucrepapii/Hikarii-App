import prisma from "../config/db";
import { sendPushNotification } from "../utils/notifications";

/**
 * Creates a notification in the database and attempts to send a push notification
 * if the user has a registered push token.
 */
export const notifyUser = async (
  userId: string,
  title: string,
  body: string,
  type: string,
  data?: any
) => {
  try {
    // 1. Create the notification record in the database
    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        body,
        type,
        data: data || {},
      },
    });

    // 2. Look up the user's push token
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { pushToken: true },
    });

    // 3. Send the push notification if token exists
    if (user && user.pushToken) {
      await sendPushNotification(user.pushToken, title, body, data);
    }

    return notification;
  } catch (error) {
    console.error("Failed to notify user:", error);
    return null;
  }
};
