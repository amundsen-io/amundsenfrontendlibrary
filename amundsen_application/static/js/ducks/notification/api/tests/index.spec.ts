import axios from 'axios';

import * as API from '../v0';
import { NotificationType } from 'interfaces';

jest.mock('axios');

describe('sendNotification', () => {
  it('calls axios with the correct params', async () => {
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
    expect(axios).toHaveBeenCalledWith({
      data: mockRequestObject,
      method: 'post',
      url: `/api/mail/v0/notification`,
    });

  });
});
