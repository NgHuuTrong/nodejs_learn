/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const createReview = async (tour, user, review, rating) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/reviews',
      data: {
        tour,
        user,
        rating,
        review,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', `Your review is created successfully`);
      window.setTimeout(() => {
        location.reload();
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const editReview = async (review, rating, reviewId) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `http://localhost:3000/api/v1/reviews/${reviewId}`,
      data: {
        rating,
        review,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', `Your review is edited successfully`);
      window.setTimeout(() => {
        location.reload();
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
