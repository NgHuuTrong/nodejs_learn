/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const forgotPassword = async (data) => {
  try {
    const response = await axios({
      method: 'POST',
      url: '/api/v1/users/forgotPassword',
      data,
    });

    if (response.data.status === 'success') {
      showAlert('success', 'Sending email successfully.');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const resetPassword = async (data, token) => {
  try {
    const response = await axios({
      method: 'PATCH',
      url: `/api/v1/users/resetPassword/${token}`,
      data,
    });

    if (response.data.status === 'success') {
      showAlert('success', 'Your password was resetted successfully.');
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
