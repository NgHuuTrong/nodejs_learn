/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async (tourId, startDateId) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/bookings/checkout-session/${tourId}/${startDateId}`,
    });

    if (res.data.status === 'success') {
      const { links } = res.data.data.payment;

      for (let i = 0; i < links.length; i++) {
        if (links[i].rel === 'approval_url') {
          location.assign(links[i].href);
          return;
        }
      }
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};
