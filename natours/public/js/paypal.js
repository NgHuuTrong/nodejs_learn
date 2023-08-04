/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async (tourId, startDateId) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `http://localhost:3000/api/v1/bookings/checkout-session/${tourId}/${startDateId}`,
    });

    const { links } = res.data.data.payment;

    for (let i = 0; i < links.length; i++) {
      if (links[i].rel === 'approval_url') {
        location.assign(links[i].href);
        return;
      }
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
