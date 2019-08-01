import axios from 'axios';
import { NotificationType, SendNotificationOptions } from 'interfaces'

export function sendNotification(recipients: Array<string>, sender: string, notificationType: NotificationType, options?: SendNotificationOptions) {
  return axios({
    data: {
      recipients,
      sender,
      notificationType,
      options,
    },
    method: 'post',
    url: `/api/mail/v0/notification`,
    timeout: 5000
  });
};
