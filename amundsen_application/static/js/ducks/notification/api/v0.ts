import axios, { AxiosResponse } from 'axios';
import { NotificationType, SendNotificationOptions } from '../types'

export function sendNotification(recipients: Array<string>, sender: string, notificationType: NotificationType, options?: SendNotificationOptions) {
  axios.post(`/api/mail/v0/notification`, {
    recipients,
    sender,
    notificationType,
    options,
  })
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.log(error);
  });
};
