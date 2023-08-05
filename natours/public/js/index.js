/* eslint-disable */
import '@babel/polyfill';
import { login, logout } from './login';
import { displayMap } from './mapbox';
import { updateSettings } from './updateSetting';
import { bookTour } from './paypal';
import { showAlert } from './alerts';
import { createReview } from './reviews';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const updateDataForm = document.querySelector('.form-user-data');
const updatePasswordForm = document.querySelector('.form-user-password');
const userAvtDisplay = document.querySelector('.form__user-photo');
const userAvtInput = document.querySelector('#photo');
const bookBtn = document.getElementById('book-tour');
const startDateSelect = document.getElementById('select-start-date');
const reviewBtn = document.querySelector('.btn--review');
const reviewSave = document.querySelector('.review-save');
const closeReview = document.querySelector('.close');
// VALUES

// DELEGATION
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--login').textContent = 'Logging in...';
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    await login({ email, password });
  });
}

if (updateDataForm) {
  updateDataForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--update--password').textContent =
      'Updating...';
    const form = new FormData();
    form.append('email', document.getElementById('email').value);
    form.append('name', document.getElementById('name').value);
    form.append('photo', document.getElementById('photo').files[0]);
    await updateSettings(form, 'data');
    location.reload();
  });
}

const handleDisplayUserPhoto = (e) => {
  const imgFile = e.target.files?.[0];

  if (!imgFile?.type.startsWith('image/')) return;
  const reader = new FileReader();

  reader.addEventListener('load', () => {
    userAvtDisplay.setAttribute('src', reader.result);
  });

  reader.readAsDataURL(imgFile);
};

if (userAvtInput) {
  userAvtInput.addEventListener('change', handleDisplayUserPhoto);
}

if (updatePasswordForm) {
  updatePasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--update--password').textContent =
      'Updating...';
    const currentPassword = document.getElementById('password-current').value;
    const newPassword = document.getElementById('password').value;
    const newPasswordConfirm =
      document.getElementById('password-confirm').value;
    await updateSettings(
      { currentPassword, newPassword, newPasswordConfirm },
      'password'
    );

    document.querySelector('.btn--update--password').textContent =
      'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}

if (bookBtn) {
  if (startDateSelect.value) {
    bookBtn.addEventListener('click', (e) => {
      e.target.textContent = 'Processing...';
      const { tourId } = e.target.dataset;
      const startDateId = startDateSelect.value;
      bookTour(tourId, startDateId);
    });
  } else {
    bookBtn.disabled = true;
    bookBtn.textContent = 'Tour is full!';
    startDateSelect.style.display = 'none';
  }
}

if (reviewBtn) {
  reviewBtn.addEventListener('click', () => {
    document.querySelector('.bg-modal').style.display = 'flex';
  });
}

if (closeReview) {
  closeReview.addEventListener('click', () => {
    document.querySelector('.bg-modal').style.display = 'none';
  });
}

if (reviewSave) {
  reviewSave.addEventListener('click', async (e) => {
    const review = document.getElementById('review').value;
    const rating = document.getElementById('ratings').value;
    const { tour, user } = e.target.dataset;
    await createReview(tour, user, review, rating);
    document.querySelector('.bg-modal').style.display = 'none';
  });
}
