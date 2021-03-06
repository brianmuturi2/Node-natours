import '@babel/polyfill';
import { login, logout } from './login';
import { displayMap } from './mapbox';
import { updateData} from './updateSettings';
import { checkOut } from './stripe';

// DOM ELEMENTS

const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const email = document.getElementById('email');
const password = document.getElementById('password');
const passwordCurrent = document.getElementById('password-current');
const passwordConfirm = document.getElementById('password-confirm');
const name = document.getElementById('name');
const photo = document.getElementById('photo');
const updateUserForm = document.querySelector('.form-user-data');
const updatePasswordForm = document.querySelector('.form-user-settings');
const bookTour = document.getElementById('book-tour');

// DELEGATION

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    login(email.value, password.value);
  })
}

if (logOutBtn) {
  logOutBtn.addEventListener('click', logout);
}

if (updateUserForm) {
  updateUserForm.addEventListener('submit', e => {
    e.preventDefault();

    const form = new FormData();
    form.set('name', name.value);
    form.set('email', email.value);
    form.set('photo', photo.files[0]);
    updateData(form, 'data');
  });
}

if (updatePasswordForm) {
  updatePasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';
    await updateData({
      password: password.value,
      passwordCurrent: passwordCurrent.value,
      passwordConfirm: passwordConfirm.value
    }, 'password');

    document.querySelector('.btn--save-password').textContent = 'SAVE PASSWORD';
    password.value = '';
    passwordCurrent.value = '';
    passwordConfirm.value = '';
  });
}

if (bookTour) {
  bookTour.addEventListener('click', async e => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    console.log('tour id is ', tourId);

    e.preventDefault();
    await checkOut(tourId);
  })
}
