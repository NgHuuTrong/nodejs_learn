/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (data) => {
  try {
    const response = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data,
    });

    if (response.data.status === 'success') {
      showAlert('success', 'Logged in successfully.');
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const response = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });

    if (response.data.status === 'success') {
      location.assign('/login');
      showAlert('success', 'Logged out successfully.');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const signup = async (data) => {
  try {
    const response = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data,
    });

    if (response.data.status === 'success') {
      showAlert('success', 'Signed up successfully.');
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
