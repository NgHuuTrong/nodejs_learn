/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const updateSettings = async (data, type) => {
  try {
    const endpoint = type === 'data' ? 'updateMe' : 'updateMyPassword';
    const res = await axios({
      method: 'PATCH',
      url: `http://localhost:3000/api/v1/users/${endpoint}`,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `Your ${type} are changed successfully!`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
