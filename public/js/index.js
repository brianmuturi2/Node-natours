import '@babel/polyfill';
import { login, logout } from './login';
import { displayMap } from './mapbox';
import { updateData} from './updateSettings';

// DOM ELEMENTS

const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const email = document.getElementById('email');
const password = document.getElementById('password');
const name = document.getElementById('name');
const updateUserForm = document.querySelector('.form-user-data');

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
    updateData(name.value, email.value);
  });
}
