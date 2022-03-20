import '@babel/polyfill';
import { login, logout } from './login';
import { displayMap } from './mapbox';

// DOM ELEMENTS

const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form');
const logOutBtn = document.querySelector('.nav__el--logout');
const email = document.getElementById('email');
const password = document.getElementById('password');

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

