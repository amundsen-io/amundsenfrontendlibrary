import axiosInstance from 'axiosInstance/instance';
import { NotificationType, SendNotificationOptions } from 'interfaces'

export function sendNotification(recipients: Array<string>, sender: string, notificationType: NotificationType, options?: SendNotificationOptions) {
  return axiosInstance({
    data: {
      notificationType,
      options,
      recipients,
      sender,
    },
    method: 'post',
    url: `/api/mail/v0/notification`,
  });
};
