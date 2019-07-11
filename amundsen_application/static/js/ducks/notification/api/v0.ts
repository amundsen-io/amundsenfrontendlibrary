import axios from 'axios';
import { NotificationType, SendNotificationOptions } from 'interfaces'

export function sendNotification(recipients: Array<string>, sender: string, notificationType: NotificationType, options?: SendNotificationOptions) {
  return axios.post(`/api/mail/v0/notification`, {
    recipients,
    sender,
    notificationType,
    options,
  })
};
