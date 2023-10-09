import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

mock.onGet('/api/get_notifications').reply(200, {
  notifications: [
    {
      id: 1,
      business_division: [1],
      created_at: '2022/01/01',
      content: '社会保険についてのお知らせです。・・・・・'
    },
    {
      id: 2,
      business_division: [1, 2, 3],
      created_at: '2022/02/02',
      content: '社会保険についてのお知らせです。・・・・・'
    },
    {
      id: 3,
      business_division: [4, 3],
      created_at: '2022/03/03',
      content: '社会保険についてのお知らせです。・・・・・'
    },
    {
      id: 4,
      business_division: [1],
      created_at: '2022/04/04',
      content: '社会保険についてのお知らせです。・・・・・'
    },
    {
      id: 5,
      business_division: [4, 2],
      created_at: '2022/05/05',
      content: '社会保険についてのお知らせです。・・・・・'
    }
  ]
});

mock.onGet('/api/get_information_notifications').reply(200, {
  information_notification_list: []
});

mock.onGet('/api/get_request_notifications').reply(200, {
  request_notification_list: []
});

export default axios;
