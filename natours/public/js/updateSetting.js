/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const updateUser = async (email, name) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: 'http://localhost:3000/api/v1/users/updateMe',
      data: {
        email,
        name,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Your detail are changed successfully!');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
