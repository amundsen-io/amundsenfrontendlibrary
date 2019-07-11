import axios from 'axios';

import * as API from '../v0';
import { NotificationType } from 'interfaces';

describe('sendNotification', () => {
  it('calls axios.post with the correct params', async () => {
    const axiosSpy = jest.spyOn(axios, 'post').mockImplementation(() => {
      return;
    });
    const mockRequestObject = {
      recipients: ['user1@test.com'],
      sender: 'user2@test.com',
      notificationType: NotificationType.ADDED,
      options: {
        resource_name: 'testResource',
        resource_url: 'https://testResource.com',
        description_requested: false,
        fields_requested: false,
      }
    }
    API.sendNotification(
      mockRequestObject.recipients,
      mockRequestObject.sender,
      mockRequestObject.notificationType,
      mockRequestObject.options,
    )
    expect(axiosSpy).toHaveBeenCalledWith(
      `/api/mail/v0/notification`,
      mockRequestObject,
    );

  });
});
